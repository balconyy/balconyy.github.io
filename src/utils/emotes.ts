export interface EmoteManifestEntry {
    file: string;
    animated: boolean;
    width: number;
    height: number;
    zeroWidth: boolean;
}

export type EmoteManifest = Record<string, EmoteManifestEntry>;

export interface Emote {
    name: string;
    url: string;
    animated: boolean;
    width: number;
    height: number;
    zeroWidth: boolean;
}

export type EmoteToken = Extract<EmotePart, { type: 'emote' }>;

export type EmotePart =
    | { type: 'text'; value: string }
    | { type: 'emote'; emotes: Emote[] };

const MAX_EMOTES_IN_STACK = 6;

export function parseEmotes(text: string, emotes: ReadonlyMap<string, Emote>): EmotePart[] {
    if (!text) return [];
    if (emotes.size === 0) return [{type: 'text', value: text}];

    const parts: EmotePart[] = [];
    let buffer = '';                 // накопленный обычный текст
    let gap = '';                    // пробелы сразу после эмодзи: пока не знаем, съедать ли их
    let lastEmote: EmoteToken | null = null; // последний эмодзи, если после него были только пробелы

    const flushText = () => {
        if (buffer) {
            parts.push({type: 'text', value: buffer});
            buffer = '';
        }
    };

    // split с capture-группой оставляет разделители в массиве:
    // чётные индексы — слова (могут быть пустыми), нечётные — пробельные последовательности
    const chunks = text.split(/(\s+)/);

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        if (!chunk) continue;

        if (i % 2 === 1) {
            if (lastEmote) gap += chunk;
            else buffer += chunk;
            continue;
        }

        const emote = emotes.get(chunk);

        if (emote?.zeroWidth && lastEmote && lastEmote.emotes.length < MAX_EMOTES_IN_STACK) {
            lastEmote.emotes.push(emote);
            gap = '';
            continue;
        }

        buffer += gap;
        gap = '';

        if (emote) {
            flushText();
            lastEmote = {type: 'emote', emotes: [emote]};
            parts.push(lastEmote);
        } else {
            buffer += chunk;
            lastEmote = null;
        }
    }

    buffer += gap;
    flushText();

    return parts;
}