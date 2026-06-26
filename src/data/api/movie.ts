import {baseClient} from "../http";
import {SearchListDTO} from "../dto/searchDTO";
import {MovieResponseDto} from "../dto/movieDTO";

export const movieApi = {
    search(query: string, controller: AbortController) {
        return baseClient.get<SearchListDTO>("/search", {
            params: {name: query},
            signal: controller.signal
        });
    },
    getMovie(id: number) {
        return baseClient.get<MovieResponseDto>(`/movie/${id}`);
    },
};