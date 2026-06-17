import {baseClient} from "@/data/http.ts";
import axios from "axios";

export const altClient2 = axios.create({
    baseURL: "https://nazeleniy.site/api", headers: {
        "Content-Type": "application/json"
    }, timeout: 15000,
});


const getPlayersAlt1 = async (kpId) => {
    const {data} = await altClient2.get(`/movie/${kpId}`);
}


function transformAlt2(source) {
    const data = [];
    if (source.alloha?.baseUrl) {
        data.push({
            type: "Alloha", iframeUrl: source.alloha.baseUrl,
        });
    }
    if (source.turbo?.baseUrl) {
        data.push({
            type: "Turbo", iframeUrl: source.turbo.baseUrl,
        });
    }
    if (source.collapsUrl) {
        data.push({
            type: "Collaps", iframeUrl: source.collapsUrl
        });
    }


    return data;
}

const getPlayersAlt2 = async (kpId) => {
    const {data} = await baseClient.get('/players', {
        params: {
            kinopoiskId: String(kpId)
        }, withCredentials: true
    })
    const players = []
    const transform = transformAlt2(data)
    console.log(transform)
    for (const elem of transform) {
        players.push({
            iframe: elem.iframeUrl, name: elem.type
        })
    }
    return players
}


export {
    getPlayersAlt2,
}
