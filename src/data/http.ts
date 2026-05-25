import axios from "axios";

export const searchApi = axios.create({
    baseURL: "https://balcony-api.duckdns.org",
});

