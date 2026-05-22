import {defineStore} from "pinia";
import {searchApi} from "../data/http";
import type {Movie} from "@/models/movie";
import {MovieResponseDTO} from "../data/dto/movie.dto";
import {MovieMapper} from "../data/mapper/movie.mapper";

export const useSearchStore = defineStore("movies", {
    state: () => ({
        movies: [] as Movie[],
        loading: false as boolean,
        error: null as string | null,
    }),

    actions: {
        async searchMovies(query: string) {
            this.loading = true;
            this.error = null;
            try {
                const rawRes = await searchApi.get<MovieResponseDTO[]>(`/search/${query}`);
                this.movies = MovieMapper.toDomainList(rawRes.data);
            } catch (e) {
                this.error = "Ошибка загрузки фильмов";
            } finally {
                this.loading = false;
            }
        },
    },
});