import {searchClient} from "../http";
import {MovieListDTO} from "../dto/movieDTO";

export const searchApi = {
    search(query: string, controller: AbortController) {
        return searchClient.get<MovieListDTO>("/search", {
            params: { name: query },
            signal: controller.signal
        });
    },
};