import {defineStore} from 'pinia'
import {Movie} from "@/models/movie";

type HistoryItem = Movie & {
    lastViewedAt: number
}

export const useMovieStore = defineStore('movie', {
    state: () => ({
        _version: 2,
        history: {} as Record<string, HistoryItem>,
    }),

    actions: {
        checkVersion() {
            if (this._version !== 2) {
                this.history = {}
            }
        },
        addToHistory(movie: Movie) {
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
        getFullHistory(): Movie[] {
            return Object.values(this.history)
                .sort((a: HistoryItem, b: HistoryItem) => b.lastViewedAt - a.lastViewedAt)
                .map(item => item as Movie);
        },

        removeFromHistory(kpId: number) {
            if (this.history[kpId]) {
                delete this.history[kpId]
            }
        },

        clearHistory() {
            this.history = {}
        },
    },

    persist: {
        key: 'movie-history',
        storage: localStorage,
        pick: ['history', '_version'],
    }

})