import {baseClient} from "../http";
import {SearchListDTO} from "../dto/searchDTO";
import {MovieDto} from "../dto/movieDTO";
import { RecentlyLists} from "../dto/movieAddonDTO";

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
    getTimings(kpId: number) {
        return baseClient.get("/movie/timings", {
            params: { kpId }
        });
    },
    getRelations(kpId: number) {
        return baseClient.get("/movie/relations", {
            params: { kpId }
        });
    },
    getReviews(lbSlug: string) {
        return baseClient.get("/movie/reviews", {
            params: { lbSlug }
        });
    },
    getRecentlyWatched() {
        return baseClient.get<RecentlyLists>(`/movie/recently-watched`);
    }
};