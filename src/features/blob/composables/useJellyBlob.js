import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue'
import {JellyBlobEngine} from "@/engine/jellyBlobEngine.js";
import {blobApi} from "@/data/api/blob.ts";
import {useBlobScoreStore} from "@/store/score.ts";


export function useJellyBlob(canvasEl, props, emit) {

    const scoreStore = useBlobScoreStore()

    const engine = new JellyBlobEngine({
        areaWidth: props.areaWidth,
        areaHeight: props.areaHeight
    })

    let ctx = null
    let raf = null
    let lastT = 0
    const isVisible = shallowRef(document.visibilityState === 'visible')
    const score = shallowRef(engine.score)

    const isLoading = ref(true)

    const checkpoint = ref(0)
    let isSaving = false

    const getScore = async () => {
        try {
            isLoading.value = true;
            scoreStore.hydrate()
            const response = await blobApi.syncBlobInfo(scoreStore.score)
            checkpoint.value = response.data.checkpoint

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
        const {contourDots, radius, jellyTexture, jellyShape, backgroundImage, ...physics} = characteristic
        engine.updateConfig(physics)

        const needsRebuild =
            contourDots !== engine.config.contourDots ||
            radius !== engine.config.radius

        engine.updateConfig({jellyTexture, jellyShape, backgroundImage})

        if (needsRebuild) {
            engine.updateConfig({contourDots, radius})
            engine.build()
        }
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

    function draw() {
        if (!ctx) return
        const {areaWidth, radius} = props
        const {jellyTexture} = engine.config

        const points = engine.points
        const n = points.length
        if (!n) return

        ctx.clearRect(0, 0, areaWidth, props.areaHeight)

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
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.stroke()
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
        () => [props.contourDots, props.radius],
        ([contourDots, radius]) => {
            engine.updateConfig({contourDots, radius})
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

            if (!props.isAuth || isSaving) return
            scoreStore.setScore(newScore)
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
        endLoading,
        saveScore,
        onPointerDown,
        onPointerMove,
        onPointerUp,
    }
}