import {shallowRef} from 'vue';
import type {Emote, EmoteManifest} from '@/utils/emotes';

// public/emotes/* отдаётся как <BASE_URL>emotes/*
const EMOTES_DIR = `${import.meta.env.BASE_URL}emotes/`;

// Общий на всё приложение словарь name → Emote.
// Именно Map, а не объект: иначе слова вроде "constructor" или "toString"
// в сообщении находились бы в прототипе и считались эмодзи.
const emotes = shallowRef<ReadonlyMap<string, Emote>>(new Map());

let loading: Promise<void> | null = null;

async function loadEmotes(): Promise<void> {
    try {
        const response = await fetch(`${EMOTES_DIR}emotes.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const manifest = (await response.json()) as EmoteManifest;

        const map = new Map<string, Emote>();
        for (const [name, entry] of Object.entries(manifest)) {
            map.set(name, {
                name,
                url: EMOTES_DIR + entry.file,
                animated: entry.animated,
                width: entry.width,
                height: entry.height,
                zeroWidth: entry.zeroWidth,
            });
        }
        emotes.value = map;
    } catch (e) {
        // без эмодзи чат остаётся рабочим — просто показывает текст как есть
        console.warn('[emotes] не удалось загрузить emotes.json', e);
    }
}

export function useEmotes() {
    // json грузится один раз, при первом использовании
    if (!loading) loading = loadEmotes();
    return {emotes};
}