/**
 * Framework-agnostic soft-body "blob" physics engine.
 *
 * Points are arranged in a ring and connected by distance constraints
 * (edges). A shape-matching constraint pulls them back toward a rotated
 * copy of their rest shape, so the ring wobbles like jelly but resists
 * total collapse. No Vue/DOM dependency here — this can be unit tested
 * or reused (e.g. in a Web Worker) on its own.
 *
 * Scoring: points are only awarded while a grabbed point is being
 * *moved* (see moveGrab). A plain click/tap (grab + release with no
 * movement in between) earns nothing. Moving the grabbed point in an
 * arc around the blob's centroid ("spinning" it) earns far more per
 * pixel of pointer travel than dragging it in a straight line, via
 * rotationScoreRate vs dragScoreRate — so holding + swirling the blob
 * is the dominant strategy over rapid clicking.
 *
 * Throw scoring: releasing a grabbed point while it's moving fast
 * enough (see throwMinSpeed) kicks off a short "flight" scoring
 * window — the point keeps earning points on its own, driven purely
 * by physics, for as long as it's still flying through the air.
 * Flight scoring uses its own, higher rates (throwRotationScoreRate /
 * throwDragScoreRate) than holding-and-dragging does, so throwing the
 * blob into a spin and letting go pays out faster than babysitting it
 * by hand. Flight scoring stops automatically once the point slows
 * below throwMinSpeed (it settled/landed) or gets grabbed again.
 */

export const DEFAULT_CONFIG = {
    areaWidth: 100,
    areaHeight: 100,
    pointCount: 12,
    restRadius: 70,
    gravity: 900,
    shapeStiffness: 0.15,
    edgeStiffness: 0.8,
    wallBounce: 0.7,
    mouseStiffness: 0.9,
    damping: 0.988,
    substeps: 4,
    wallMargin: 2,

    rotationScoreRate: 0.006,
    dragScoreRate: 0.00005,

    // Flight ("throw") scoring — active only after release(), while the
    // released point is still moving fast. Rates are higher than the
    // held-drag rates above, since letting a spinning blob fly is the
    // reward-maximizing move.
    throwMinSpeed: 60,             // px/s — below this, flight scoring stops
    throwRotationScoreRate: 0.02,  // per radian swept around centroid while flying
    throwDragScoreRate: 0.00025,   // per px of travel while flying
    throwMaxDuration: 1.5,         // s — hard cap on a single flight's scoring window
}

export class JellyBlobEngine {
    constructor(config = {}) {
        this.config = {...DEFAULT_CONFIG, ...config}
        this.points = []
        this.restEdgeLen = 0
        this.grabbedIndex = -1
        this.pointerTarget = {x: 0, y: 0}
        this.pointerActive = false

        this.score = 0
        this.lastGain = 500

        // Flight-scoring state, set by release() when a point is thrown
        // with enough speed, consumed/cleared by _scoreFlight() each substep.
        this.flight = null

        this.build()
    }

    updateConfig(patch) {
        Object.assign(this.config, patch)
    }

    /** (Re)builds the ring of points around the current rest shape. Does not touch score. */
    build() {
        const {pointCount, restRadius, areaWidth, areaHeight} = this.config
        const n = Math.max(4, Math.round(pointCount))
        const cx = areaWidth / 2
        const cy = areaHeight / 2

        this.points = []
        for (let i = 0; i < n; i++) {
            const angle = (i / n) * Math.PI * 2
            const ox = Math.cos(angle) * restRadius
            const oy = Math.sin(angle) * restRadius
            this.points.push({x: cx + ox, y: cy + oy, vx: 0, vy: 0, ox, oy, grabbed: false})
        }

        const angleStep = (Math.PI * 2) / n
        this.restEdgeLen = 2 * restRadius * Math.sin(angleStep / 2)

        this.grabbedIndex = -1
        this.pointerActive = false
        this.flight = null
    }

    setScore(score) {
        this.score = score
    }

    // ---------------------------------------------------------------------
    // Constraint solvers
    // ---------------------------------------------------------------------

    /** Current centroid of the point ring. */
    centroid() {
        let cx = 0
        let cy = 0
        for (const p of this.points) {
            cx += p.x
            cy += p.y
        }
        const n = this.points.length || 1
        return {x: cx / n, y: cy / n}
    }

    _solveEdge(a, b, rest, stiffness) {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy) || 0.0001
        const diff = (dist - rest) / dist
        const cx = dx * 0.5 * diff * stiffness
        const cy = dy * 0.5 * diff * stiffness

        if (!a.grabbed) {
            a.x += cx
            a.y += cy
        }
        if (!b.grabbed) {
            b.x -= cx
            b.y -= cy
        }
    }

    /** Pulls points back toward a rotated copy of their rest shape. */
    _shapeMatch() {
        const {points} = this
        if (!points.length) return

        const {x: cx, y: cy} = this.centroid()

        let A = 0
        let B = 0
        for (const p of points) {
            const px = p.x - cx
            const py = p.y - cy
            A += px * p.ox + py * p.oy
            B += py * p.ox - px * p.oy
        }

        const angle = Math.atan2(B, A)
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const stiffness = this.config.shapeStiffness

        for (const p of points) {
            if (p.grabbed) continue
            const gx = cx + (p.ox * c - p.oy * s)
            const gy = cy + (p.ox * s + p.oy * c)
            p.x += (gx - p.x) * stiffness
            p.y += (gy - p.y) * stiffness
        }
    }

    _solveWalls() {
        const {areaWidth, areaHeight, wallMargin, wallBounce} = this.config
        const maxX = areaWidth - wallMargin
        const maxY = areaHeight - wallMargin

        for (const p of this.points) {
            if (p.x < wallMargin) {
                p.x = wallMargin
                p.vx *= -wallBounce
            }
            if (p.x > maxX) {
                p.x = maxX
                p.vx *= -wallBounce
            }
            if (p.y < wallMargin) {
                p.y = wallMargin
                p.vy *= -wallBounce
            }
            if (p.y > maxY) {
                p.y = maxY
                p.vy *= -wallBounce
            }
        }
    }

    _solvePointer(dt) {
        if (!this.pointerActive || this.grabbedIndex < 0) return
        const p = this.points[this.grabbedIndex]
        if (!p) return

        const dx = this.pointerTarget.x - p.x
        const dy = this.pointerTarget.y - p.y
        const stiffness = this.config.mouseStiffness

        p.x += dx * stiffness
        p.y += dy * stiffness
        p.vx = (dx * stiffness) / dt
        p.vy = (dy * stiffness) / dt
    }

    /**
     * Awards score for a thrown point while it's still airborne, using the
     * same "arc beats straight line" logic as moveGrab, but driven by the
     * point's own physics-integrated motion instead of pointer input.
     * Stops (and clears this.flight) once the point slows down, gets
     * grabbed again, or the flight has run past throwMaxDuration.
     */
    _scoreFlight(dt) {
        const flight = this.flight
        if (!flight) return

        const p = this.points[flight.index]
        if (!p || p.grabbed) {
            this.flight = null
            return
        }

        const speed = Math.hypot(p.vx, p.vy)
        flight.elapsed += dt

        if (speed < this.config.throwMinSpeed || flight.elapsed > this.config.throwMaxDuration) {
            this.flight = null
            return
        }

        const {x: cx, y: cy} = this.centroid()
        const newAngle = Math.atan2(p.y - cy, p.x - cx)
        let dAngle = newAngle - flight.prevAngle
        dAngle = Math.atan2(Math.sin(dAngle), Math.cos(dAngle)) // normalize to [-PI, PI]

        const dist = speed * dt

        const gained = Math.abs(dAngle) * this.config.throwRotationScoreRate + dist * this.config.throwDragScoreRate

        this.lastGain = gained
        if (gained > 0) this.score += gained

        flight.prevAngle = newAngle
    }

    _substep(dt) {
        const {gravity, damping, edgeStiffness} = this.config

        for (const p of this.points) {
            if (p.grabbed) continue
            p.vy += gravity * dt
            p.vx *= damping
            p.vy *= damping
            p.x += p.vx * dt
            p.y += p.vy * dt
        }

        this._solvePointer(dt)

        for (let i = 0; i < this.points.length; i++) {
            this._solveEdge(this.points[i], this.points[(i + 1) % this.points.length], this.restEdgeLen, edgeStiffness)
        }

        this._shapeMatch()
        this._solveWalls()
        this._scoreFlight(dt)
    }

    /** Advances the simulation by `dt` seconds, split into substeps for stability. */
    step(dt) {
        const sub = Math.max(1, Math.round(this.config.substeps))
        const sdt = dt / sub
        for (let i = 0; i < sub; i++) this._substep(sdt)
    }

    // ---------------------------------------------------------------------
    // Pointer interaction
    // ---------------------------------------------------------------------

    /** Grabs the nearest point to (x, y) if it's within maxDistance. Returns its index, or -1. */
    grabNearest(x, y, maxDistance = 46) {
        let index = -1
        let best = Infinity

        this.points.forEach((p, i) => {
            const d = Math.hypot(p.x - x, p.y - y)
            if (d < best) {
                best = d
                index = i
            }
        })

        if (index >= 0 && best < maxDistance) {
            this.points[index].grabbed = true
            this.grabbedIndex = index
            this.pointerActive = true
            this.pointerTarget.x = x
            this.pointerTarget.y = y
            this.lastGain = 0
            return index
        }

        return -1
    }

    /**
     * Moves the pointer target for the currently grabbed point, and awards
     * score for the movement. A tap that never calls moveGrab (or calls it
     * with no effective displacement) earns nothing — only actual dragging
     * pays out, and dragging in an arc around the blob's centroid pays out
     * much faster than dragging in a straight line.
     */
    moveGrab(x, y) {
        if (!this.pointerActive) return

        const prevTarget = this.pointerTarget
        const {x: cx, y: cy} = this.centroid()

        const prevAngle = Math.atan2(prevTarget.y - cy, prevTarget.x - cx)
        const newAngle = Math.atan2(y - cy, x - cx)
        let dAngle = newAngle - prevAngle
        dAngle = Math.atan2(Math.sin(dAngle), Math.cos(dAngle)) // normalize to [-PI, PI]

        const dist = Math.hypot(x - prevTarget.x, y - prevTarget.y)

        const gained = Math.abs(dAngle) * this.config.rotationScoreRate + dist * this.config.dragScoreRate

        this.lastGain = gained
        if (gained > 0) this.score += gained

        this.pointerTarget = {x, y}
    }

    release() {
        const p = this.points[this.grabbedIndex]

        if (p) {
            p.grabbed = false

            const speed = Math.hypot(p.vx, p.vy)
            if (speed >= this.config.throwMinSpeed) {
                const {x: cx, y: cy} = this.centroid()
                this.flight = {
                    index: this.grabbedIndex,
                    prevAngle: Math.atan2(p.y - cy, p.x - cx),
                    elapsed: 0,
                }
            } else {
                this.flight = null
            }
        }

        this.grabbedIndex = -1
        this.pointerActive = false
        this.lastGain = 0
    }

    containsPoint(x, y) {
        let cx = 0, cy = 0
        for (const p of this.points) {
            cx += p.x;
            cy += p.y
        }
        cx /= this.points.length
        cy /= this.points.length
        const dx = x - cx, dy = y - cy
        return (dx * dx + dy * dy) <= (this.config.restRadius ** 2)
    }

}