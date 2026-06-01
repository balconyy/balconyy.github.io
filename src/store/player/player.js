import { defineStore } from 'pinia'

const PLAYER_STORE_NAME = 'player'
export const usePlayerStore = defineStore(PLAYER_STORE_NAME, {
  state: () => ({
    preferredPlayer: null,
    aspectRatio: '16:9',
    isCentered: false,
    showFavoriteTooltip: true,
    kinobdSourceByKpId: {},
    compressorEnabled: false,
    mirrorEnabled: false,
    videoOverlayEnabled2: true,
    overlaySettings: {
      showTitle: true,
      showDuration2: false,
      showBackground: false,
      showTimingsOnMouseMove: false,
      highlightTimings: true,
      autoBlurTimings: true,
      fontSize: 18
    },
    obsSettings: {
      enabled: false,
      host: 'localhost',
      port: 4455,
      password: '',
      connected: false,
      filtersFound: [],
      selectedFilterId: null,
      showObsInOverlay: true
    }
  }),

  actions: {
    updatePreferredPlayer(player) {
      this.preferredPlayer = player
    },
    clearPreferredPlayer() {
      this.preferredPlayer = null
    },
    updateAspectRatio(ratio) {
      this.aspectRatio = ratio
    },
    updateCentering(value) {
      this.isCentered = value
    },
    setFavoriteTooltip(value) {
      this.showFavoriteTooltip = value
    },
    setKinoBdSource(kpId, inid) {
      if (!kpId) return
      this.kinobdSourceByKpId = {
        ...this.kinobdSourceByKpId,
        [String(kpId)]: inid
      }
    },

  }
})
