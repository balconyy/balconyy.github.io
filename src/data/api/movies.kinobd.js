import axios from 'axios'
import { resolvePosterSetByMovie } from '@/utils/mediaUtils.js'

let apiInstance = null
let isErrorSimulationEnabled = false
const simulatedErrorCode = 500

const KINOBD_BASE_URL = 'https://kinobd.net'
const KINOBD_TOKEN = import.meta.env.VITE_KINOBD_TOKEN || ''
const DEFAULT_PLAYER_PROVIDERS = [
  'collaps',
  'vibix',
  'alloha',
  'kodik',
  'kinotochka',
  'flixcdn',
  'ashdi',
  'turbo',
  'videocdn',
  'bazon',
  'ustore',
  'pleer',
  'videospider',
  'iframe',
  'moonwalk',
  'hdvb',
  'cdnmovies',
  'lookbase',
  'kholobok',
  'videoapi',
  'voidboost',
  'videoseed',
  'ia',
  'ext',
].join(',')

const getApi = () => {
  if (apiInstance) return apiInstance

  apiInstance = axios.create({
    baseURL: KINOBD_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
  })

  apiInstance.interceptors.request.use(
    (config) => {
      if (KINOBD_TOKEN) {
        config.params = config.params || {}
        if (!config.params.token) {
          config.params.token = KINOBD_TOKEN
        }
      }
      return config
    },
    (err) => Promise.reject(err)
  )

  return apiInstance
}

const simulateErrorIfNeeded = async () => {
  if (isErrorSimulationEnabled && simulatedErrorCode) {
    const status = parseInt(simulatedErrorCode, 10)
    const error = new Error(`Simulated error ${status}`)
    error.response = { isLoading: status }
    throw error
  }
}

const apiCall = async (callFn) => {
  await simulateErrorIfNeeded()
  const api = getApi()
  return await callFn(api)
}

const toAbsoluteUrl = (value) => {
  if (!value || typeof value !== 'string') return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  if (value.startsWith('//')) return `https:${value}`
  try {
    return new URL(value, KINOBD_BASE_URL).toString()
  } catch {
    return value
  }
}

const extractIframeUrl = (value) => {
  if (!value || typeof value !== 'string') return ''

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('//')) {
    return toAbsoluteUrl(value)
  }

  const dataSrcMatch = value.match(/data-src="([^"]+)"/i)
  if (dataSrcMatch?.[1]) return toAbsoluteUrl(dataSrcMatch[1])

  const srcMatch = value.match(/src="([^"]+)"/i)
  if (srcMatch?.[1]) return toAbsoluteUrl(srcMatch[1])

  return ''
}


const toLegacyType = (typeValue) => {
  const type = String(typeValue || '').toLowerCase()
  if (type.includes('series')) return 'TV_SERIES'
  if (type.includes('show')) return 'TV_SERIES'
  if (type.includes('movie')) return 'FILM'
  return 'FILM'
}

const extractKinopoiskRating = (film) => {
  const rating =
    film?.rating_kp ??
    film?.rating_kinopoisk ??
    film?.ratings?.kp ??
    film?.ratings?.kinopoisk ??
    null
  const voteCount =
    film?.rating_kp_count ??
    film?.rating_kinopoisk_count ??
    film?.ratings_count_kp ??
    film?.ratings?.kp_count ??
    film?.ratings?.kinopoisk_count ??
    0

  return { rating, voteCount }
}

const extractImdbRating = (film) => {
  return film?.rating_imdb ?? film?.imdb_rating ?? film?.ratings?.imdb ?? null
}

const extractAppRating = (film) => {
  return film?.average_rating ?? film?.rating_reyohoho ?? film?.ratings?.reyohoho ?? null
}

const toRatingNumber = (rating) => {
  if (rating === null || rating === undefined || rating === '' || rating === 'null') return null
  const number = Number(String(rating).replace(',', '.'))
  return Number.isFinite(number) && number > 0 ? number : null
}

const buildLegacyMovie = (film) => {
  const kpId = film?.kinopoisk_id || film?.kp_id || film?.id || null
  const year = film?.year || film?.year_start || ''
  const nameRu = film?.name_russian || ''
  const nameEn = film?.name_original || ''
  const titleBase = nameRu || nameEn || 'Без названия'
  const title = year ? `${titleBase} (${year})` : titleBase
  const { rating: ratingKp, voteCount: ratingKpCount } = extractKinopoiskRating(film)
  const ratingImdb = extractImdbRating(film)
  const appRating = extractAppRating(film)
  const normalizedRating =
    ratingKp === null || ratingKp === undefined || ratingKp === '' ? 'null' : String(ratingKp)
  const posters = resolvePosterSetByMovie({
    ...film,
    kp_id: kpId
  })

  return {
    id: kpId,
    kp_id: kpId ? String(kpId) : '',
    title,
    year: year ? String(year) : '',
    poster: posters.preview,
    rating_kp: toRatingNumber(ratingKp),
    rating_imdb: toRatingNumber(ratingImdb),
    average_rating: toRatingNumber(appRating),
    raw_data: {
      film_id: kpId,
      name_ru: nameRu,
      name_en: nameEn,
      type: toLegacyType(film?.type),
      year: year ? String(year) : null,
      description: film?.description || null,
      film_length: film?.time || null,
      countries: parseCountries(film),
      genres: parseGenres(film),
      rating: normalizedRating,
      rating_imdb: ratingImdb === null || ratingImdb === undefined ? null : String(ratingImdb),
      rating_vote_count: ratingKpCount || 0,
      poster_url: posters.full,
      poster_url_preview: posters.preview
    },
    source: 'kinobd'
  }
}


const ensureUniqueKey = (obj, baseKey) => {
  if (!obj[baseKey]) return baseKey
  let idx = 2
  while (obj[`${baseKey} #${idx}`]) idx++
  return `${baseKey} #${idx}`
}

const buildPlayersMap = (items = []) => {
  const players = {}

  for (const item of items) {
    const iframe = extractIframeUrl(item?.iframe)
    if (!iframe) continue

    const baseKey = `KINOBD>${item?.name_russian || item?.name_original || item?.id || 'Player'}`
    const key = ensureUniqueKey(players, baseKey)

    players[key] = {
      name: key,
      translate: item?.name_russian || item?.name_original || 'KinoBD',
      iframe,
      quality: item?.time || '',
      warning: false,
      source: 'kinobd',
      raw_data: item
    }

    if (item?.yt_video_id) {
      const trailerKey = ensureUniqueKey(players, 'TRAILER>YouTube')
      players[trailerKey] = {
        name: trailerKey,
        translate: 'YouTube Trailer',
        iframe: `https://www.youtube.com/embed/${item.yt_video_id}`,
        quality: '',
        warning: false,
        source: 'kinobd'
      }
    }
  }

  return players
}

const toProviderPlayersMap = (providerMap = {}) => {
  const players = {}
  const providers = Object.entries(providerMap || {})

  for (const [provider, value] of providers) {
    const iframe = extractIframeUrl(value?.iframe)
    if (!iframe) continue

    const baseLabel = String(provider || 'player').toUpperCase()
    const translate =
      value?.translate && String(value.translate).trim()
        ? String(value.translate).trim()
        : baseLabel
    const key = ensureUniqueKey(players, baseLabel)

    players[key] = {
      name: key,
      translate,
      iframe,
      quality: value?.quality || '',
      warning: false,
      source: 'kinobd',
      raw_data: value
    }
  }

  return players
}

const searchPlayerCandidates = async (query, { type = 'title', page = 1 } = {}) => {
  const normalizedType = type === 'kp_id' ? 'kp_id' : 'title'
  const { data } = await apiCall((api) =>
    api.get('/api/player/search', {
      params: {
        q: String(query),
        type: normalizedType,
        page
      }
    })
  )

  const rows = Array.isArray(data?.data) ? data.data : []
  return rows.map((item) => ({
    id: item?.id ?? null, // inid for /playerdata
    kp_id: item?.kinopoisk_id || item?.kp_id || null,
    imdb_id: item?.imdb_id || null,
    title: item?.name_russian || item?.name_original || '',
    year: item?.year || '',
    iframe: extractIframeUrl(item?.iframe),
    raw_data: item
  }))
}

const getPlayerDataByInid = async (
  inid,
  { playerUrl = '', cacheKey = '', providers = DEFAULT_PLAYER_PROVIDERS, fast = 1 } = {}
) => {
  const resolvedPlayerUrl = toAbsoluteUrl(playerUrl)
  const playerOrigin = (() => {
    try {
      return resolvedPlayerUrl ? new URL(resolvedPlayerUrl).origin : ''
    } catch {
      return ''
    }
  })()

  const params = cacheKey ? `cache${cacheKey}` : `cache${inid}`
  const body = new URLSearchParams({
    fast: String(fast),
    inid: String(inid),
    player: providers
  })

  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  if (resolvedPlayerUrl) headers['X-Re'] = resolvedPlayerUrl
  if (playerOrigin && import.meta.env.SSR) {
    headers.Origin = playerOrigin
    headers.Referer = `${playerOrigin}/`
  }

  const { data } = await apiCall((api) =>
    api.post(`/playerdata?${params}`, body.toString(), {
      headers
    })
  )

  return toProviderPlayersMap(data)
}



const getMovieSeoByKpId = async (kpId) => {
  const { data } = await apiCall((api) =>
    api.get('/api/films/search/kp_id', {
      params: {
        q: String(kpId),
        page: 1
      }
    })
  )

  const film = Array.isArray(data?.data) ? data.data[0] : null
  return film ? buildLegacyMovie(film) : null
}

const getPlayers = async (kpId, options = {}) => {
  console.log("ПУТИН " + kpId)
  const {
    mode = 'kp_id',
    selectIndex = 0,
    usePlayerData = true,
    providers = DEFAULT_PLAYER_PROVIDERS,
    forceInid = null
  } = options
  const searchType = mode === 'title' ? 'title' : 'kp_id'
  const candidates = await searchPlayerCandidates(kpId, { type: searchType, page: 1 })

  if (!candidates.length && !forceInid) return {}

  if (usePlayerData) {
    let selected = null
    if (forceInid) {
      selected = candidates.find((item) => String(item.id) === String(forceInid)) || null
    }
    if (!selected && candidates.length > 0) {
      selected = candidates[Math.max(0, Math.min(selectIndex, candidates.length - 1))]
    }

    if (selected?.id || forceInid) {
      try {
        return await getPlayerDataByInid(selected?.id || forceInid, {
          playerUrl: selected?.iframe || '',
          providers
        })
      } catch (error) {
        console.warn('[movies.kinobd] /playerdata failed, fallback to iframe list', error)
      }
    }
  }

  return buildPlayersMap(candidates.map((c) => c.raw_data))
}
const apiSearch = async (searchTerm, page = 1) => {
  const { data } = await apiCall((api) =>
      api.get('/api/films/search/title', {
        params: {
          q: searchTerm,
          page
        }
      })
  )

  const rows = Array.isArray(data?.data) ? data.data : []
  return rows.map(buildLegacyMovie)
}



export {
  searchPlayerCandidates,
  getPlayerDataByInid,
  apiSearch,
  getMovieSeoByKpId,
  getPlayers,
}