import axios from "axios";

export const baseClient = axios.create({
    baseURL: "https://balcony-api.duckdns.org",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000,
});

