import axios from "axios";

export const client = axios.create({
    baseURL: "https://balcony-api.duckdns.org",
    timeout: 15000,
});

