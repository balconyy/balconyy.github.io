import {baseClient} from "../http";
import {SearchListDTO} from "../dto/searchDTO";
import {MovieDto} from "../dto/movieDTO";
import {MovieAddonDto} from "../dto/movieAddonDTO";
import {Movie} from "../../models/movie";

export const movieApi = {
    search(query: string, controller: AbortController) {
        return baseClient.get<SearchListDTO>("/search", {
            params: {name: query},
            signal: controller.signal
        });
    },
    getMovie(id: number) {
        return baseClient.get<MovieDto>(`/movie/by-id/${id}`);
    },
    getMovieAddons(kpId: number, lbSlug: string | undefined) {
        return baseClient.get<MovieAddonDto>("/movie/addons", {
            params: {kpId: kpId, ...(lbSlug ? { lbSlug } : {})}
        });
    },
    getRecentlyWatched() {
        return baseClient.get<Movie[]>(`/movie/recently-watched`);
    }
};