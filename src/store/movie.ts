
import {MovieKp} from "@/models/movieKp";
import {defineStore} from "pinia";
import {MovieInfo} from "@/models/movie";

type HistoryItem = MovieInfo & {
    lastViewedAt: number
}

export const useMovieStore = defineStore('movie', {
    state: () => ({
        _version: 2,
        history: {} as Record<string, HistoryItem>,
        searchText: '' as string,
        query: [] as MovieKp [],
        tabId: 1 as number
    }),

    actions: {
        checkVersion() {
            if (this._version !== 2) {
                this.history = {}
            }
        },
        addToHistory(movie: MovieInfo) {
            const now = Date.now()
            const existing = this.history[movie.kpId]
            if (existing) {
                existing.lastViewedAt = now
                return
            }

            this.history[movie.kpId] = {
                ...movie,
                lastViewedAt: now,
            }
        },
        getFullHistory(): MovieInfo[] {
            return Object.values(this.history)
                .sort((a: HistoryItem, b: HistoryItem) => b.lastViewedAt - a.lastViewedAt)
                .map(item => item as MovieInfo);
        },

        removeFromHistory(kpId: number) {
            if (this.history[kpId]) {
                delete this.history[kpId]
            }
        },
        clearHistory() {
            this.history = {}
        },
        saveQuery(searchText: string, list: MovieKp[]) {
            this.searchText = searchText
            this.query = list
            sessionStorage.setItem('query_cache', searchText)
            sessionStorage.setItem('movies_cache', JSON.stringify(list))
        },

        hydrateQuery() {
            const cachedText = sessionStorage.getItem('query_cache')
            const cachedList = sessionStorage.getItem('movies_cache')
            if (cachedText) {
                this.searchText = cachedText
            }
            if (cachedList) {
                this.query = JSON.parse(cachedList)
            }
        },

        clearQuery() {
            this.query = []
            this.searchText = ''
            sessionStorage.removeItem('query_cache')
            sessionStorage.removeItem('movies_cache')
        }
    },

    persist: {
        key: 'movie-history',
        storage: localStorage,
        pick: ['history', '_version'],
    }

})