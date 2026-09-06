export type MessagePart =
    | { type: 'text'; value: string }
    | { type: 'image'; value: string };

// Список расширений, которые считаем картинками. Дополняйте при необходимости.
const IMAGE_EXTENSIONS = ['png', 'jpe?g', 'gif', 'webp', 'bmp', 'svg'];

const IMAGE_URL_REGEX = new RegExp(
    `(https?:\\/\\/[^\\s]+?\\.(?:${IMAGE_EXTENSIONS.join('|')})(?:\\?[^\\s]*)?)(?!\\w)`,
    'gi'
);

/**
 * Разбивает текст сообщения на куски: обычный текст и ссылки на картинки.
 * Ссылка считается картинкой, если оканчивается на один из IMAGE_EXTENSIONS
 * (с необязательной query-строкой после расширения, например ?size=200).
 */
export function parseMessageParts(text: string): MessagePart[] {
    if (!text) return [];

    const parts: MessagePart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // regex глобальный и переиспользуется между вызовами — обязательно сбрасываем lastIndex
    IMAGE_URL_REGEX.lastIndex = 0;

    while ((match = IMAGE_URL_REGEX.exec(text)) !== null) {
        const url = match[1];
        const start = match.index;

        if (start > lastIndex) {
            parts.push({type: 'text', value: text.slice(lastIndex, start)});
        }

        parts.push({type: 'image', value: url});
        lastIndex = start + url.length;
    }

    if (lastIndex < text.length) {
        parts.push({type: 'text', value: text.slice(lastIndex)});
    }

    return parts;
}