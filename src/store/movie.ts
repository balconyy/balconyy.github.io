import {defineStore} from 'pinia'
import {Movie} from "@/models/movie";

type HistoryItem = Movie & {
    lastViewedAt: number
}

export const useMovieStore = defineStore('movie', {
    state: () => ({
        history: {} as Record<string, HistoryItem>
    }),

    actions: {
        addToHistory(movie: Movie) {
            const now = Date.now()
            const existing = this.history[movie.id]

            if (existing) {
                existing.lastViewedAt = now
                this.selected = existing
                return
            }

            const item: HistoryItem = {
                ...movie,
                lastViewedAt: now,
            }

            this.history[movie.id] = item
            this.selected = item
        },
        getFullHistory(): Movie[] {
            return Object.values(this.history)
                .sort((a: HistoryItem, b: HistoryItem) => b.lastViewedAt - a.lastViewedAt)
                .map(item => item as Movie);
        },

        removeFromHistory(kpId: string) {
            if (this.history[kpId]) {
                delete this.history[kpId]
            }
        },

        clearHistory() {
            this.history = {}
            this.selected = null
        },
    },

    persist: true

})