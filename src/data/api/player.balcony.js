import {baseClient} from "@/data/http.ts";
import axios from "axios";

export const altClient = axios.create({
    baseURL: "https://nazeleniy.site/api", headers: {
        "Content-Type": "application/json"
    }, timeout: 15000,
});

const getPlayersAlt = async (kpId) => {
    const {data} = await altClient.get(`/movie/${kpId}`);
}

const getPlayers = async (kpId) => {
    const {data} = await baseClient.get(`/players/${kpId}`)
    return data
}


export {
    getPlayers
}
