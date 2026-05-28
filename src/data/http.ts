import axios from "axios";

export const searchClient = axios.create({
    baseURL: "https://balcony-api.duckdns.org",
    timeout: 5000,
});

