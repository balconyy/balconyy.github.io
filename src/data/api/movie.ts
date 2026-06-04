import {client} from "../http";
import {SearchListDTO} from "../dto/searchDTO";
import {FilmDto} from "../dto/filmDTO";

export const searchApi = {
    search(query: string, controller: AbortController) {
        return client.get<SearchListDTO>("/search", {
            params: { name: query },
            signal: controller.signal
        });
    },
    film(id: number) {
        return client.get<FilmDto>(`/film/${id}`);
    }
};