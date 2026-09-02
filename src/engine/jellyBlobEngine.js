/**
 * Framework-agnostic soft-body "blob" physics engine.
 *
 * Points are arranged in a ring and connected by distance constraints
 * (edges). A shape-matching constraint pulls them back toward a rotated
 * copy of their rest shape, so the ring wobbles like jelly but resists
 * total collapse. No Vue/DOM dependency here — this can be unit tested
 * or reused (e.g. in a Web Worker) on its own.
 *
 * Rest shape: `config.jellyShape` picks which outline the ring is built
 * from (see JELLY_SHAPES / SHAPE_OUTLINES below) — 'circle' (default),
 * 'square', 'triangle' or 'pear'. Each preset is already oriented the
 * way it should rest under gravity (flat base down, etc). Note that
 * _shapeMatch() always measures the ring's *current* best-fit rotation
 * and matches toward a copy of the rest shape rotated by that same
 * amount — it never pulls toward a fixed "upright" angle. So once
 * gravity/collisions tip an asymmetric shape like the pear onto its
 * side, the shape-match constraint holds it there; it has no notion of
 * "upright" to spring back to.
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
    contourDots: 10,
    radius: 70,
    gravity: 900,
    shapeStiffness: 0.135,
    edgeStiffness: 0.7,
    wallBounce: 0.7,
    mouseStiffness: 0.95,

    jellyShape: "circle",

    damping: 0.988,
    substeps: 4,
    wallMargin: 2,

    referenceFps: 75,

    rotationScoreRate: 0.0005,
    dragScoreRate: 0.0003,
    throwMinSpeed: 60,
    throwRotationScoreRate: 0.0025,
    throwDragScoreRate: 0.0005,
    throwMaxDuration: 1,
    jellyTexture: {
        type: 'gradient',
        colorStops: [
            {stop: 0, color: '#d9f3a3'},
            {stop: 0.45, color: '#8fcf4b'},
            {stop: 1, color: '#3f8f2a'},
        ],
    },
}

function polygonOutline(cornerAngles) {
    const sides = cornerAngles.length

    const areaAtUnitRadius = (sides / 2) * Math.sin((2 * Math.PI) / sides)
    const scale = Math.sqrt(Math.PI / areaAtUnitRadius)

    const corners = cornerAngles.map(deg => {
        const a = (deg * Math.PI) / 180
        return {x: Math.cos(a) * scale, y: Math.sin(a) * scale}
    })

    return t => {
        const scaled = (((t % 1) + 1) % 1) * sides
        const i = Math.floor(scaled) % sides
        const frac = scaled - Math.floor(scaled)
        const a = corners[i]
        const b = corners[(i + 1) % sides]
        return {x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac}
    }
}

const SHAPE_OUTLINES = {
    circle(t) {
        const a = t * Math.PI * 2
        return {x: Math.cos(a), y: Math.sin(a)}
    },

    // Corners at 45/135/225/315° give an axis-aligned square: flat
    // horizontal top and bottom edges, flat vertical sides.
    square: polygonOutline([45, 135, 225, 315]),

    // Apex straight up; the two base corners share the same y, so the
    // base is flat and horizontal (parallel to the floor), centered
    // under the apex.
    triangle: polygonOutline([-90, 30, 150]),

    // Polar silhouette (radius as a function of angle): a bigger lobe at
    // the bottom, a smaller lobe at the top, and a pinched waist on the
    // sides — reads as a pear, or a numeral "8" stood on end.
    pear(t) {
        const theta = t * Math.PI * 2
        const phi = theta + Math.PI / 2 // phi = 0 -> straight up
        const topBottomAsymmetry = 0.4 // bigger => bottom lobe bulges more relative to top
        const waistPinch = 0.5 // bigger => tighter waist between the two lobes
        const r = 1 - topBottomAsymmetry * Math.cos(phi) + waistPinch * Math.cos(2 * phi)
        return {x: r * Math.cos(theta), y: r * Math.sin(theta)}
    },
}

/** Valid values for config.jellyShape, e.g. to populate a preset picker in the UI. */
export const JELLY_SHAPES = Object.freeze(Object.keys(SHAPE_OUTLINES))

/**
 * Walks `outline` at equal arc-length intervals (instead of equal steps
 * of its own parameter t) and returns `n` points. Sampling by raw t
 * would bunch points up wherever the outline moves slowly in t — badly
 * so for the square/triangle presets, whose straight edges are far from
 * constant-speed. The distance-constraint solver wants points evenly
 * spread around the actual perimeter, so this oversamples densely,
 * builds a cumulative-length table, and interpolates against that.
 */
function resamplePerimeter(outline, n, oversample = 600) {
    const dense = []
    for (let i = 0; i <= oversample; i++) dense.push(outline(i / oversample))

    const cumulative = [0]
    for (let i = 1; i < dense.length; i++) {
        const dx = dense[i].x - dense[i - 1].x
        const dy = dense[i].y - dense[i - 1].y
        cumulative.push(cumulative[i - 1] + Math.hypot(dx, dy))
    }
    const total = cumulative[cumulative.length - 1]

    const points = []
    let j = 0
    for (let i = 0; i < n; i++) {
        const targetLen = (total * i) / n
        while (j < cumulative.length - 2 && cumulative[j + 1] < targetLen) j++
        const segLen = cumulative[j + 1] - cumulative[j]
        const frac = segLen > 0 ? (targetLen - cumulative[j]) / segLen : 0
        const a = dense[j]
        const b = dense[j + 1]
        points.push({x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac})
    }
    return points
}

export class JellyBlobEngine {
    constructor(config = {}) {
        this.config = {...DEFAULT_CONFIG, ...config}
        this.points = []
        this.restEdgeLengths = []
        this.grabbedIndex = -1
        this.pointerTarget = {x: 0, y: 0}
        this.pointerActive = false

        this.score = 0
        this.lastGain = 500

        // Flight-scoring state, set by release() when a point is thrown
        // with enough speed, consumed/cleared by _scoreFlight() each substep.
        this.flight = null

        // Leftover real time not yet consumed by a physics substep. See step().
        this._accumulator = 0

        this.build()
    }

    updateConfig(patch) {
        Object.assign(this.config, patch)
    }

    /** (Re)builds the ring of points around the current rest shape. Does not touch score. */
    build() {
        const {contourDots, radius, areaWidth, areaHeight, jellyShape} = this.config
        const n = Math.max(4, Math.round(contourDots))
        const cx = areaWidth / 2
        const cy = areaHeight / 2

        const outline = SHAPE_OUTLINES[jellyShape] || SHAPE_OUTLINES.circle
        const unit = resamplePerimeter(outline, n)

        // Recenter on the sampled points' own centroid (not just the
        // continuous curve's ideal centroid) so the rest shape is exactly
        // zero-mean. _shapeMatch()/getRotationAngle() both assume that —
        // for a lopsided preset like the pear, skipping this would leave
        // the matched target's average position slightly off from the
        // physics-computed centroid, and the blob would fight itself
        // every substep instead of settling.
        let meanX = 0
        let meanY = 0
        for (const p of unit) {
            meanX += p.x
            meanY += p.y
        }
        meanX /= unit.length
        meanY /= unit.length

        this.points = unit.map(({x, y}) => {
            const ox = (x - meanX) * radius
            const oy = (y - meanY) * radius
            return {x: cx + ox, y: cy + oy, vx: 0, vy: 0, ox, oy, grabbed: false}
        })

        // Per-edge rest lengths, taken directly from the rest positions —
        // a regular polygon (the old circle-only code) has one shared
        // edge length, but the square/triangle/pear outlines don't, so
        // each edge needs its own.
        this.restEdgeLengths = this.points.map((p, i) => {
            const next = this.points[(i + 1) % this.points.length]
            return Math.hypot(next.ox - p.ox, next.oy - p.oy)
        })

        this.grabbedIndex = -1
        this.pointerActive = false
        this.flight = null
        this._accumulator = 0
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

    /**
     * Current best-fit rotation (radians) of the point ring relative to its
     * rest shape — the same angle _shapeMatch pulls points toward. Exposed
     * publicly so a renderer can spin a texture (e.g. an image) in sync
     * with the blob's own rotation.
     */
    getRotationAngle() {
        const {points} = this
        if (!points.length) return 0

        const {x: cx, y: cy} = this.centroid()

        let A = 0
        let B = 0
        for (const p of points) {
            const px = p.x - cx
            const py = p.y - cy
            A += px * p.ox + py * p.oy
            B += py * p.ox - px * p.oy
        }

        return Math.atan2(B, A)
    }

    /** Pulls points back toward a rotated copy of their rest shape. */
    _shapeMatch() {
        const {points} = this
        if (!points.length) return

        const {x: cx, y: cy} = this.centroid()
        const angle = this.getRotationAngle()
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
            this._solveEdge(this.points[i], this.points[(i + 1) % this.points.length], this.restEdgeLengths[i], edgeStiffness)
        }

        this._shapeMatch()
        this._solveWalls()
        this._scoreFlight(dt)
    }

    step(dt) {
        const substeps = Math.max(1, Math.round(this.config.substeps))
        const fixedDt = 1 / (this.config.referenceFps * substeps)

        this._accumulator += dt

        const maxTicksPerCall = substeps * 8 // generous headroom for slow frames
        let ticks = 0
        while (this._accumulator >= fixedDt && ticks < maxTicksPerCall) {
            this._substep(fixedDt)
            this._accumulator -= fixedDt
            ticks++
        }

        // Drop any remainder we couldn't catch up on rather than let it
        // build up and cause a burst of steps on the next call.
        if (ticks === maxTicksPerCall) this._accumulator = 0
    }


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

    /**
     * Point-in-polygon test against the ring's *current* (live) points,
     * via standard ray casting. Using the actual point ring instead of a
     * circle-of-radius approximation matters once the rest shape isn't a
     * circle — a circle approximation would report false hits outside a
     * square's/triangle's straight edges, and false misses/hits around
     * an asymmetric pear.
     */
    containsPoint(x, y) {
        const {points} = this
        const n = points.length
        if (n < 3) return false

        let inside = false
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const pi = points[i]
            const pj = points[j]
            const crosses = (pi.y > y) !== (pj.y > y) &&
                x < ((pj.x - pi.x) * (y - pi.y)) / (pj.y - pi.y) + pi.x
            if (crosses) inside = !inside
        }
        return inside
    }


}