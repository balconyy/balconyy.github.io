import axios from "axios";

export const searchApi = axios.create({
    baseURL: "http://45.81.35.103:8080/",
});

