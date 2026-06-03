import axios from "axios";

export const searchClient = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 15000,
});

