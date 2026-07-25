import axios from "axios";

export const baseClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000,
});

