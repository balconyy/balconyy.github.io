import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue'
import {JellyBlobEngine} from "@/engine/jellyBlobEngine.js";
import {blobApi} from "@/data/api/blob.ts";
import {useBlobScoreStore} from "@/store/score.ts";


export function useJellyBlob(canvasEl, props, emit) {

    const scoreStore = useBlobScoreStore()

    const engine = new JellyBlobEngine({
        areaWidth: props.areaWidth, areaHeight: props.areaHeight
    })

    let ctx = null
    let raf = null
    let lastT = 0
    const isVisible = shallowRef(document.visibilityState === 'visible')
    const score = shallowRef(engine.score)

    const isLoading = ref(true)
    const backgroundSrc = ref("")

    const checkpoint = ref(0)
    let isSaving = false

    const imageCache = new Map()

    const getJellyInfo = async () => {
        try {
            backgroundSrc.value = ""
            isLoading.value = true;
            scoreStore.hydrate()
            const response = await blobApi.syncBlobInfo(scoreStore.score)
            checkpoint.value = response.data.checkpoint
            backgroundSrc.value = response.data.characteristic.backgroundImage

            applyCharacteristic(response.data.characteristic)
            engine.setScore(response.data.score)
            score.value = engine.score
        } catch (e) {

        } finally {
            isLoading.value = false;
        }

    }

    const endLoading = () => {
        isLoading.value = false;
    }

    const saveScore = async (newScore) => {
        try {
            const response = await blobApi.saveScore(Math.round(newScore))
            checkpoint.value = response.data.checkpoint
            scoreStore.setScore(response.data.score)
        } catch (e) {

        }

    }

    function applyCharacteristic(characteristic) {
        const { jellyShape, ...physics } = characteristic

        console.log(characteristic)

        engine.updateConfig(physics)
        engine.updateConfig({
            jellyShape: jellyShape?.toLowerCase()
        })

        engine.build()
    }

    function applyGradient(ctx, texture, cx, cy, radius) {
        const gradient = ctx.createRadialGradient(cx - 30, cy - 40, 10, cx, cy, radius)
        for (const {stop, color} of texture.colorStops) gradient.addColorStop(stop, color)
        return gradient
    }

    function fitCanvasToDPR() {
        const canvas = canvasEl.value
        if (!canvas) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.round(props.areaWidth * dpr)
        canvas.height = Math.round(props.areaHeight * dpr)
        canvas.style.width = `${props.areaWidth}px`
        canvas.style.height = `${props.areaHeight}px`

        ctx = canvas.getContext('2d')
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function midpoint(a, b) {
        return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
    }


    function drawImageTexture(texture, cx, cy, radius) {
        ctx.save()
        ctx.clip('nonzero') // constrain everything below to the blob's own path

        ctx.fillStyle = texture.color
        ctx.fillRect(0, 0, props.areaWidth, props.areaHeight)

        const img = getCachedImage(texture.image)
        if (img && img.naturalWidth && img.naturalHeight) {
            drawImageMesh(texture, img, cx, cy, radius)
        }

        ctx.restore()
    }

    function drawImageMesh(texture, img, cx, cy, radius) {
        const points = engine.points
        const n = points.length
        if (n < 3) return

        // "Cover" sizing, same idea as before: at rest (undeformed, no
        // rotation) this reproduces a single image centered on the blob
        // and scaled so it fully spans the rest circle (plus a margin).
        const scaleParam = texture.scale ?? 1.25
        const coverSize = radius * 2 * scaleParam
        const k = coverSize / Math.min(img.naturalWidth, img.naturalHeight)

        // Slight outward expansion (from each triangle's own centroid) so
        // neighboring triangles' clip regions overlap a hair instead of
        // exactly coinciding — see expandTriangle() for why that matters.
        const seamFactor = 1 + (texture.seamOverlap ?? 0.03)

        const srcOf = (ox, oy) => ({
            x: img.naturalWidth / 2 + ox / k, y: img.naturalHeight / 2 + oy / k,
        })

        const srcCentroid = {x: img.naturalWidth / 2, y: img.naturalHeight / 2}
        const dstCentroid = {x: cx, y: cy}

        for (let i = 0; i < n; i++) {
            const a = points[i]
            const b = points[(i + 1) % n]

            const src = [srcCentroid, srcOf(a.ox, a.oy), srcOf(b.ox, b.oy)]
            const dst = [dstCentroid, {x: a.x, y: a.y}, {x: b.x, y: b.y}]

            const matrix = triangleAffine(src, dst)
            if (!matrix) continue

            const clipDst = expandTriangle(dst, seamFactor)

            ctx.save()
            ctx.beginPath()
            ctx.moveTo(clipDst[0].x, clipDst[0].y)
            ctx.lineTo(clipDst[1].x, clipDst[1].y)
            ctx.lineTo(clipDst[2].x, clipDst[2].y)
            ctx.closePath()
            ctx.clip()

            ctx.transform(...matrix)
            ctx.drawImage(img, 0, 0)
            ctx.restore()
        }
    }

    function draw() {
        if (!ctx) return
        const radius = engine.config.radius
        const {jellyTexture} = engine.config

        const points = engine.points
        const n = points.length
        if (!n) return

        ctx.clearRect(0, 0, props.areaWidth, props.areaHeight)

        ctx.beginPath()
        const firstMid = midpoint(points[n - 1], points[0])
        ctx.moveTo(firstMid.x, firstMid.y)
        for (let i = 0; i < n; i++) {
            const current = points[i]
            const next = points[(i + 1) % n]
            const mid = midpoint(current, next)
            ctx.quadraticCurveTo(current.x, current.y, mid.x, mid.y)
        }
        ctx.closePath()

        let cx = 0
        let cy = 0
        for (const p of points) {
            cx += p.x
            cy += p.y
        }
        cx /= n
        cy /= n

        if (jellyTexture?.type === 'image') {
            drawImageTexture(jellyTexture, cx, cy, radius)
        } else {
            let fillStyle
            switch (jellyTexture?.type) {
                case 'gradient':
                    fillStyle = applyGradient(ctx, jellyTexture, cx, cy, radius * 1.2)
                    break
                default:
                    fillStyle = '#8888ff'
            }

            ctx.fillStyle = fillStyle
            ctx.fill()
        }

    }

    function loop(t) {
        if (!lastT) lastT = t
        let dt = (t - lastT) / 1000
        lastT = t
        dt = Math.min(dt, 1 / 30)

        if (isVisible.value) {
            engine.step(dt)
            draw()

            if (engine.score !== score.value) {
                score.value = engine.score
                emit('score', engine.score, engine.lastGain)
            }
        }

        raf = requestAnimationFrame(loop)
    }

    function canvasPos(e) {
        const canvas = canvasEl.value
        if (!canvas) return {x: 0, y: 0}
        const rect = canvas.getBoundingClientRect()
        return {
            x: (e.clientX - rect.left) * (props.areaWidth / rect.width),
            y: (e.clientY - rect.top) * (props.areaHeight / rect.height),
        }
    }

    function onPointerDown(e) {
        const canvas = canvasEl.value
        if (!canvas) return

        const pos = canvasPos(e)
        const index = engine.grabNearest(pos.x, pos.y)

        if (index >= 0) {
            canvas.setPointerCapture(e.pointerId)
            emit('grab', index)
        }
    }

    function onPointerMove(e) {
        const pos = canvasPos(e)

        if (engine.pointerActive) {
            engine.moveGrab(pos.x, pos.y)
            canvasEl.value.style.cursor = 'grabbing'
        } else {
            canvasEl.value.style.cursor = engine.containsPoint(pos.x, pos.y) ? 'grab' : 'default'
        }

        if (engine.score !== score.value) {
            score.value = engine.score
            emit('score', engine.score, engine.lastGain)
        }
    }

    function onPointerUp(e) {
        const wasGrabbed = engine.grabbedIndex
        engine.release()

        const canvas = canvasEl.value
        if (canvas && e?.pointerId != null && canvas.hasPointerCapture(e.pointerId)) {
            canvas.releasePointerCapture(e.pointerId)
        }

        if (wasGrabbed >= 0) {
            emit('release', wasGrabbed)
            // release() starts a scoring "flight" when the point was let go
            // fast enough (see JellyBlobEngine.release / throwMinSpeed).
            if (engine.flight) emit('throw', wasGrabbed)
        }
    }

    function onVisibilityChange() {
        isVisible.value = document.visibilityState === 'visible'
        if (isVisible.value) lastT = 0 // avoid a huge dt spike after returning to the tab
    }


    function getCachedImage(src) {
        if (!src) return null

        let entry = imageCache.get(src)
        if (!entry) {
            const img = new Image()
            entry = {img, loaded: false}
            img.onload = () => {
                entry.loaded = true
            }
            img.onerror = () => {
                imageCache.delete(src)
            }
            img.src = src
            imageCache.set(src, entry)
        }

        return entry.loaded ? entry.img : null
    }

    function invert3x3(m) {
        const [a, b, c, d, e, f, g, h, i] = m

        const A = e * i - f * h
        const B = -(d * i - f * g)
        const C = d * h - e * g
        const det = a * A + b * B + c * C
        if (Math.abs(det) < 1e-9) return null

        const invDet = 1 / det
        const D = -(b * i - c * h)
        const E = a * i - c * g
        const F = -(a * h - b * g)
        const G = b * f - c * e
        const H = -(a * f - c * d)
        const I = a * e - b * d

        return [A * invDet, D * invDet, G * invDet, B * invDet, E * invDet, H * invDet, C * invDet, F * invDet, I * invDet,]
    }

    function triangleAffine(src, dst) {
        const M = [src[0].x, src[0].y, 1, src[1].x, src[1].y, 1, src[2].x, src[2].y, 1,]
        const Minv = invert3x3(M)
        if (!Minv) return null

        const dx = [dst[0].x, dst[1].x, dst[2].x]
        const dy = [dst[0].y, dst[1].y, dst[2].y]

        const a = Minv[0] * dx[0] + Minv[1] * dx[1] + Minv[2] * dx[2]
        const c = Minv[3] * dx[0] + Minv[4] * dx[1] + Minv[5] * dx[2]
        const e = Minv[6] * dx[0] + Minv[7] * dx[1] + Minv[8] * dx[2]

        const b = Minv[0] * dy[0] + Minv[1] * dy[1] + Minv[2] * dy[2]
        const d = Minv[3] * dy[0] + Minv[4] * dy[1] + Minv[5] * dy[2]
        const f = Minv[6] * dy[0] + Minv[7] * dy[1] + Minv[8] * dy[2]

        return [a, b, c, d, e, f]
    }

    function expandTriangle(pts, factor) {
        const cx = (pts[0].x + pts[1].x + pts[2].x) / 3
        const cy = (pts[0].y + pts[1].y + pts[2].y) / 3
        return pts.map(p => ({
            x: cx + (p.x - cx) * factor, y: cy + (p.y - cy) * factor,
        }))
    }


    // Resize: update engine bounds + canvas pixel size.
    watch(() => [props.areaWidth, props.areaHeight], () => {
        engine.updateConfig({areaWidth: props.areaWidth, areaHeight: props.areaHeight})
        fitCanvasToDPR()
    },)


    watch(() => score.value, (newScore) => {

        if (!props.isAuth || isSaving) return
        scoreStore.setScore(newScore)
        if (newScore >= checkpoint.value) {
            isSaving = true
            saveScore(newScore).finally(() => {
                isSaving = false
            })
        }
    },)

    onMounted(() => {
        fitCanvasToDPR()
        raf = requestAnimationFrame(loop)
        document.addEventListener('visibilitychange', onVisibilityChange)
    })

    onBeforeUnmount(() => {
        if (raf) cancelAnimationFrame(raf)
        raf = null
        ctx = null
        document.removeEventListener('visibilitychange', onVisibilityChange)
    })

    return {
        isLoading, score, backgroundSrc, getJellyInfo, endLoading, saveScore, onPointerDown, onPointerMove, onPointerUp,
    }
}