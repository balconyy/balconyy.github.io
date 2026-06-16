import {baseClient} from "@/data/http.ts";
import axios from "axios";


const ensureUniqueKey = (obj) => {
    let idx = 0
    while (obj[`${idx}`]) idx++
    return `${idx}`
}


const altClient1 = axios.create({
    baseURL: "https://p2.ddbb.lol",
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000,
})


export const altClient2 = axios.create({
    baseURL: "https://nazeleniy.site/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000,
});

const normalizePlayerType = (value) => String(value || 'Player').trim()

const toPlayersMap = (providers = [], {type = null, translationId = null} = {}) => {
    const players = {}
    const selectedType = type ? String(type).toLowerCase() : null
    const selectedTranslationId =
        translationId === null || translationId === undefined ? null : String(translationId)

    for (const provider of providers) {
        const providerType = normalizePlayerType(provider?.type)

        if (selectedType && providerType.toLowerCase() !== selectedType) {
            continue
        }

        const providerBaseIframe = provider?.iframeUrl || ''

        if (providerBaseIframe) {
            const key = ensureUniqueKey(players)
            players[key] = {
                name: key,
                translate: providerType,
                iframe: providerBaseIframe,
                quality: '',
                warning: false,
                source: 'ddbb',
                raw_data: provider
            }
        }

        const translations = Array.isArray(provider?.translations) ? provider.translations : []
        for (const translation of translations) {
            const iframe = translation?.iframeUrl || ''
            if (!iframe) continue

            const tId =
                translation?.id === null || translation?.id === undefined ? null : String(translation.id)
            if (selectedTranslationId && tId !== selectedTranslationId) continue

            const translationName = String(translation?.name || 'Translation').trim()
            const key = translationName
            players[key] = {
                name: key,
                translate: translationName,
                iframe,
                quality: translation?.quality || '',
                warning: false,
                source: 'ddbb',
                raw_data: translation,
                provider: providerType
            }
        }
    }
    console.log(players)
    return players
}

const getPlayersAlt1 = async (kpId) => {
    const {data} = await altClient2.get(`/movie/${kpId}`);
    return transformAlt1(data)
}
const getPlayersAlt2 = async (kpId) => {
    const {data} = await baseClient.get('/players', {
            params: {
                kinopoiskId: String(kpId)
            },
            withCredentials: true
        }
    )
    const a = transformAlt2(data)
    return toPlayersMap(a.data)
}


const getPlayersAlt3 = async (kpId, {n = 0} = {}) => {
    const {data} = await altClient1.get('/api/players', {
            params: {
                kinopoisk: String(kpId),
                n
            }
        }
    )

    return toPlayersMap(data)
}


function transformAlt1(){

}

function transformAlt2(source) {
    const data = [];

    // Alloha
    if (source.alloha?.baseUrl) {
        data.push({
            type: "Alloha",
            iframeUrl: source.alloha.baseUrl,
        });
    }

    // Collaps
    if (source.collapsUrl) {
        data.push({
            type: "Collaps",
            iframeUrl: source.collapsUrl
        });
    }

    // Turbo
    if (source.turbo?.baseUrl) {
        data.push({
            type: "Turbo",
            iframeUrl: source.turbo.baseUrl,
        });
    }

    return { data };
}


export {
    getPlayersAlt2,
    getPlayersAlt3,
}
