/**
 * Скачивает эмоуты 7TV-канала в локальную папку и строит emotes.json.
 *
 * Запуск (нужен Node 18+ и tsx):
 *   npx tsx scripts/sync-7tv-emotes.ts --twitch-id 123456789
 *
 * Опции:
 *   --twitch-id    числовой ID канала (не логин!)
 *   --platform     twitch | kick | youtube (по умолчанию twitch)
 *   --set-id       ID эмоут-сета (из ссылки 7tv.app/emote-sets/<id>), вместо --twitch-id
 *   --out          папка вывода (по умолчанию public/emotes)
 *   --size         1x | 2x | 3x | 4x (по умолчанию 2x)
 *   --format       webp | avif | gif | png (по умолчанию webp)
 *   --concurrency  параллельных загрузок (по умолчанию 8)
 *
 *
 * Повторный запуск безопасен: уже скачанные файлы пропускаются.
 */
import {mkdir, rename, stat, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {parseArgs} from 'node:util'

const API = process.env.SEVENTV_API ?? 'https://7tv.io/v3'

interface HostFile {
    name: string // например "2x.webp"
    width: number
    height: number
    format: string
}

interface EmoteData {
    id: string
    name: string
    flags: number
    animated: boolean
    host: { url: string; files: HostFile[] }
}

interface ActiveEmote {
    id: string
    name: string // имя внутри сета: именно его пишут в чате
    flags: number
    data?: EmoteData
}

interface EmoteSet {
    id: string
    name: string
    emotes?: ActiveEmote[]
}

interface UserResponse {
    emote_set?: EmoteSet | null
}

export interface ManifestEntry {
    file: string // имя файла внутри папки эмоутов
    animated: boolean
    width: number
    height: number
    zeroWidth: boolean // эмоут-оверлей: рисуется поверх предыдущего
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function describeError(e: unknown): string {
    if (e instanceof Error) {
        const cause = (e as Error & { cause?: { code?: string; message?: string } }).cause
        return cause?.code ?? cause?.message ?? e.message
    }
    return String(e)
}

async function withRetries<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    for (let attempt = 1; ; attempt++) {
        try {
            return await fn()
        } catch (e) {
            if (attempt >= retries) throw e
            await sleep(500 * 2 ** (attempt - 1))
        }
    }
}

async function getJson<T>(url: string): Promise<T> {
    return withRetries(async () => {
        const res = await fetch(url, {signal: AbortSignal.timeout(20_000)})
        if (!res.ok) throw new Error(`HTTP ${res.status} для ${url}`)
        return (await res.json()) as T
    })
}

async function exists(file: string): Promise<boolean> {
    try {
        return (await stat(file)).size > 0
    } catch {
        return false
    }
}

async function download(url: string, dest: string): Promise<void> {
    await withRetries(async () => {
        const res = await fetch(url, {signal: AbortSignal.timeout(30_000)})
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buf = Buffer.from(await res.arrayBuffer())
        if (buf.length === 0) throw new Error('пустой ответ')
        // сначала во временный файл, чтобы обрыв не оставил битую картинку
        const tmp = `${dest}.part`
        await writeFile(tmp, buf)
        await rename(tmp, dest)
    })
}

async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>) {
    let next = 0
    const runners = Array.from({length: Math.min(limit, items.length)}, async () => {
        while (next < items.length) {
            const item = items[next++]
            await worker(item)
        }
    })
    await Promise.all(runners)
}

function pickFile(
    files: HostFile[],
    size: string,
    format: string,
    animated: boolean,
): HostFile | undefined {
    const exact = files.find((f) => f.name === `${size}.${format}`)
    if (exact) return exact
    // Запрошенного формата нет: берём тот же размер в другом формате.
    // Для анимированных эмоутов PNG не подходит (он статичный), поэтому его пропускаем.
    const fallback = animated ? ['webp', 'avif', 'gif'] : ['webp', 'png', 'avif', 'gif']
    return (
        fallback.map((fmt) => files.find((f) => f.name === `${size}.${fmt}`)).find(Boolean) ??
        files[0]
    )
}

async function setupProxy() {
    const proxy = process.env.HTTPS_PROXY ?? process.env.https_proxy
    if (!proxy) return
    try {
        const moduleName = 'undici'
        const undici: any = await import(moduleName)
        undici.setGlobalDispatcher(new undici.ProxyAgent(proxy))
        console.log(`Использую прокси ${new URL(proxy).host}`)
    } catch {
        throw new Error('Задан HTTPS_PROXY, но пакет undici не установлен: npm i -D undici')
    }
}

async function main() {
    const {values: args} = parseArgs({
        options: {
            'twitch-id': {type: 'string'},
            platform: {type: 'string', default: 'twitch'},
            'set-id': {type: 'string'},
            out: {type: 'string', default: 'public/emotes'},
            size: {type: 'string', default: '2x'},
            format: {type: 'string', default: 'webp'},
            concurrency: {type: 'string', default: '8'},
        },
    })

    if (!args['twitch-id'] && !args['set-id']) {
        console.error('Укажите --twitch-id <числовой ID> или --set-id <ID эмоут-сета>')
        process.exit(2)
    }

    const outDir = path.resolve(args.out!)
    const concurrency = Math.max(1, Number(args.concurrency) || 8)
    await setupProxy()

    console.log('Запрашиваю список эмоутов…')
    let set: EmoteSet | null | undefined
    try {
        set = args['set-id']
            ? await getJson<EmoteSet>(`${API}/emote-sets/${args['set-id']}`)
            : (await getJson<UserResponse>(`${API}/users/${args.platform}/${args['twitch-id']}`)).emote_set
    } catch (e) {
        console.error(`Не удалось получить данные с 7TV: ${describeError(e)}`)
        console.error('Если 7TV недоступен в вашем регионе, включите VPN или задайте HTTPS_PROXY.')
        process.exit(1)
    }

    const active = (set?.emotes ?? []).filter((e) => e.data)
    if (!set || active.length === 0) {
        console.error('У канала нет активного эмоут-сета или он пуст.')
        process.exit(1)
    }
    console.log(`Сет «${set.name}»: ${active.length} эмоутов`)

    await mkdir(outDir, {recursive: true})

    const manifest: Record<string, ManifestEntry> = {}
    const failed: string[] = []
    let done = 0

    await runPool(active, concurrency, async (emote) => {
        const data = emote.data!
        const file = pickFile(data.host.files, args.size!, args.format!, data.animated)
        try {
            if (!file) throw new Error('нет доступных файлов')
            const ext = path.extname(file.name) || `.${args.format}`
            // имя файла = ID эмоута: в названиях эмоутов бывают символы, недопустимые в путях
            const localName = `${emote.id}${ext}`
            const dest = path.join(outDir, localName)

            if (!(await exists(dest))) {
                const base = data.host.url.startsWith('//') ? `https:${data.host.url}` : data.host.url
                await download(`${base}/${file.name}`, dest)
            }

            manifest[emote.name] = {
                file: localName,
                animated: data.animated,
                width: file.width,
                height: file.height,
                // флаги: ActiveEmote.flags бит 0 и EmoteData.flags бит 8 (в 7TV v3), сверьте на своих данных
                zeroWidth: (emote.flags & 1) === 1 || (data.flags & 256) === 256,
            }
        } catch (e) {
            failed.push(`${emote.name}: ${describeError(e)}`)
        } finally {
            done++
            process.stdout.write(`\rСкачано ${done}/${active.length}`)
        }
    })
    process.stdout.write('\n')

    const sorted = Object.fromEntries(
        Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
    )
    await writeFile(path.join(outDir, 'emotes.json'), JSON.stringify(sorted, null, 2) + '\n')

    console.log(`Готово: ${Object.keys(sorted).length} эмоутов в ${outDir}`)
    if (failed.length) {
        console.error(`\nНе удалось скачать (${failed.length}):`)
        for (const line of failed) console.error(`  - ${line}`)
        console.error('Запустите скрипт ещё раз: уже скачанное он пропустит.')
        process.exit(1)
    }
}

main().catch((e) => {
    console.error(describeError(e))
    process.exit(1)
})