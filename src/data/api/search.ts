import {searchClient} from "../http";
import {SearchDTO, SearchListDTO} from "../dto/searchDTO";
import {FilmDto} from "../dto/filmDTO";

export const searchApi = {
    search(query: string, controller: AbortController) {
        return searchClient.get<SearchListDTO>("/search", {
            params: { name: query },
            signal: controller.signal
        });
    },
    film(id: number) {
        return searchClient.get<FilmDto>(`/film/${id}`);
    }
};