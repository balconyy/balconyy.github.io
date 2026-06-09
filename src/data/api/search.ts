import {baseClient} from "../http";
import {SearchListDTO} from "../dto/searchDTO";
import {FilmDto} from "../dto/filmDTO";

export const searchApi = {
    search(query: string, controller: AbortController) {
        return baseClient.get<SearchListDTO>("/search", {
            params: { name: query },
            signal: controller.signal
        });
    },
    film(id: number) {
        return baseClient.get<FilmDto>(`/film/${id}`);
    }
};