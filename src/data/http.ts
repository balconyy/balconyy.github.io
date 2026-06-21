import axios from "axios";

export const baseClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000,
});

