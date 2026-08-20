import { defineStore } from 'pinia'


export const useBlobScoreStore = defineStore('blobScore', {
    state: () => ({
        score: 0,
    }),
    actions: {
        setScore(value: number) {
            this.score = Math.round(value);
            localStorage.setItem('blob_score', String(this.score))
        },
        hydrate() {
            const cachedScore = localStorage.getItem('blob_score')
            this.score = cachedScore !== null ? Number(cachedScore) : 0
        },
    },
    persist: {
        storage: localStorage,
        pick: [
            'score',
        ],
    },
})