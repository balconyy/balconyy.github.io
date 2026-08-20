import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue'
import {JellyBlobEngine} from "@/engine/jellyBlobEngine.js";
import {blobApi} from "@/data/api/blob.ts";
import {useBlobScoreStore} from "@/store/score.ts";

/**
 * Wires a JellyBlobEngine instance to a <canvas> element: HiDPI-aware
 * sizing, the requestAnimationFrame loop, pointer-drag handling, score
 * tracking (including throw/"flight" scoring that keeps accruing after
 * release, driven by the engine's physics step), and pausing the loop
 * while the tab is hidden.
 *
 * @param {import('vue').Ref<HTMLCanvasElement | null>} canvasEl
 * @param {object} props - reactive props from the host component
 * @param {(event: string, ...args: any[]) => void} emit
 */
export function useJellyBlob(canvasEl, props, emit) {

    const scoreStore = useBlobScoreStore()

    const engine = new JellyBlobEngine({
        areaWidth: props.areaWidth,
        areaHeight: props.areaHeight,
        pointCount: props.pointCount,
        restRadius: props.restRadius,
        gravity: props.gravity,
        shapeStiffness: props.shapeStiffness,
        edgeStiffness: props.edgeStiffness,
        wallBounce: props.wallBounce,
        mouseStiffness: props.mouseStiffness,
        rotationScoreRate: props.rotationScoreRate,
        dragScoreRate: props.dragScoreRate,
        throwMinSpeed: props.throwMinSpeed,
        throwRotationScoreRate: props.throwRotationScoreRate,
        throwDragScoreRate: props.throwDragScoreRate,
        throwMaxDuration: props.throwMaxDuration,
    })

    let ctx = null
    let raf = null
    let lastT = 0
    const isVisible = shallowRef(document.visibilityState === 'visible')
    const score = shallowRef(engine.score)

    const isLoading = ref(false)

    const checkpoint = ref(0)
    let isSaving = false

    const getScore = async () => {
        try {
            isLoading.value = true;
            scoreStore.hydrate()
            console.log(scoreStore.score)
            const response = await blobApi.syncBlobInfo(scoreStore.score)
            console.log(response.data)
            checkpoint.value = response.data.checkpoint

            engine.setScore(response.data.score)
            score.value = engine.score
        } catch (e) {

        } finally {
            isLoading.value = false;
        }

    }

    const saveScore = async (newScore) => {
        try {
            const response = await blobApi.saveScore(Math.round(newScore))
            checkpoint.value = response.data.checkpoint
            scoreStore.setScore(response.data.score)
        } catch (e) {

        }

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

    function draw() {
        if (!ctx) return

        const {areaWidth: width, areaHeight: height, restRadius, colorStops} = props
        const points = engine.points
        const n = points.length
        if (!n) return

        ctx.clearRect(0, 0, width, height)
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

        const gradient = ctx.createRadialGradient(cx - 30, cy - 40, 10, cx, cy, restRadius * 1.6)
        for (const [offset, color] of colorStops) gradient.addColorStop(offset, color)

        ctx.fillStyle = gradient
        ctx.fill()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.stroke()
    }

    function loop(t) {
        if (!lastT) lastT = t
        let dt = (t - lastT) / 1000
        lastT = t
        dt = Math.min(dt, 1 / 30) // guard against tab-switch time jumps

        if (isVisible.value) {
            engine.step(dt)
            draw()

            // A thrown point keeps earning score on its own inside step()
            // (see JellyBlobEngine._scoreFlight), independent of pointer
            // events, so this is where flight-scoring gains surface — not
            // just onPointerMove.
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
        engine.moveGrab(pos.x, pos.y)

        // moveGrab awards points for held-drag movement; sync right away
        // so the displayed score doesn't lag behind pointer input. (Flight
        // scoring from a throw is synced separately, in loop().)
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


    function reset() {
        engine.build()
        lastT = 0
        draw()
    }


    // Resize: update engine bounds + canvas pixel size.
    watch(
        () => [props.areaWidth, props.areaHeight],
        () => {
            engine.updateConfig({areaWidth: props.areaWidth, areaHeight: props.areaHeight})
            fitCanvasToDPR()
        },
    )

    // Structural changes require rebuilding the point ring.
    watch(
        () => [props.pointCount, props.restRadius],
        ([pointCount, restRadius]) => {
            engine.updateConfig({pointCount, restRadius})
            reset()
        },
    )

    // Tunable physics params can just be patched in place, no rebuild needed.
    watch(
        () => [props.gravity, props.shapeStiffness, props.edgeStiffness, props.wallBounce, props.mouseStiffness],
        ([gravity, shapeStiffness, edgeStiffness, wallBounce, mouseStiffness]) => {
            engine.updateConfig({gravity, shapeStiffness, edgeStiffness, wallBounce, mouseStiffness})
        },
    )

    // Scoring tunables.
    watch(
        () => [props.rotationScoreRate, props.dragScoreRate],
        ([rotationScoreRate, dragScoreRate]) => {
            engine.updateConfig({rotationScoreRate, dragScoreRate})
        },
    )

    // Throw ("flight") scoring tunables.
    watch(
        () => [props.throwMinSpeed, props.throwRotationScoreRate, props.throwDragScoreRate, props.throwMaxDuration],
        ([throwMinSpeed, throwRotationScoreRate, throwDragScoreRate, throwMaxDuration]) => {
            engine.updateConfig({throwMinSpeed, throwRotationScoreRate, throwDragScoreRate, throwMaxDuration})
        },
    )

    watch(
        () => score.value,
        (newScore) => {
            scoreStore.setScore(newScore)

            if (!props.isAuth || isSaving) return

            if (newScore >= checkpoint.value) {
                isSaving = true
                saveScore(newScore).finally(() => {
                    isSaving = false
                })
            }
        },
    )

    onMounted(() => {
        fitCanvasToDPR()
        draw()
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
        isLoading,
        score,
        getScore,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        reset,
    }
}