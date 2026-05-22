import axios from "axios";

export const searchApi = axios.create({
    baseURL: "https://api4.rhserv.vu",
});

