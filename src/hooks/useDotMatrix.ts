import { useEffect, useRef, useState } from 'react'

interface Dot {
  x: number
  y: number
  radius: number
  alpha: number
  glow: number
  order: number
  ox: number
  oy: number
}

const SIZE = 320
const ROW_STEP = 5
const COL_STEP = 4
const BASE_RADIUS = 1.1
const FACE_CENTER = { x: SIZE * 0.52, y: SIZE * 0.34 }
const FACE_RADIUS = SIZE * 0.17
const SPARKLE = { x: SIZE * 0.58, y: SIZE * 0.58 }
const HOVER_RADIUS = 64
const HOVER_STRENGTH = 16
const HOVER_EASE = 0.15

function drawFallbackSilhouette(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SIZE, SIZE)

  // shoulders / cloak
  ctx.beginPath()
  ctx.moveTo(SIZE * 0.12, SIZE)
  ctx.quadraticCurveTo(SIZE * 0.5, SIZE * 0.58, SIZE * 0.88, SIZE)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.fill()

  // head
  const cx = SIZE * 0.5
  const cy = SIZE * 0.42
  const r = SIZE * 0.24
  ctx.beginPath()
  ctx.ellipse(cx, cy, r * 0.82, r, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.fill()
}

async function loadDrawable(imageSrc?: string): Promise<CanvasImageSource> {
  if (imageSrc) {
    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imageSrc
      })
    } catch {
      // fall through to procedural placeholder
    }
  }

  const fallback = document.createElement('canvas')
  fallback.width = SIZE
  fallback.height = SIZE
  drawFallbackSilhouette(fallback.getContext('2d')!)
  return fallback
}

function colorDistance(data: Uint8ClampedArray, i: number, ref: [number, number, number]) {
  const dr = data[i] - ref[0]
  const dg = data[i + 1] - ref[1]
  const db = data[i + 2] - ref[2]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/** Builds a boolean silhouette mask from the source image, robust to both
 * transparent-background cutouts (used by the procedural placeholder) and
 * opaque photos with a roughly plain background. */
function buildSilhouetteMask(source: CanvasImageSource): Uint8Array {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(source, 0, 0, SIZE, SIZE)
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE)

  const mask = new Uint8Array(SIZE * SIZE)
  const corners = [
    [2, 2],
    [SIZE - 3, 2],
    [2, SIZE - 3],
    [SIZE - 3, SIZE - 3],
  ]
  const cornerAlpha = corners.reduce((sum, [x, y]) => sum + data[(y * SIZE + x) * 4 + 3], 0) / 4

  let inside = 0

  if (cornerAlpha < 200) {
    // transparent-background cutout: alpha channel IS the silhouette
    for (let p = 0; p < SIZE * SIZE; p++) {
      const isInside = data[p * 4 + 3] > 40
      mask[p] = isInside ? 1 : 0
      if (isInside) inside++
    }
  } else {
    // opaque photo: estimate background color from corners, mask = far from it
    const bg: [number, number, number] = [
      corners.reduce((sum, [x, y]) => sum + data[(y * SIZE + x) * 4], 0) / 4,
      corners.reduce((sum, [x, y]) => sum + data[(y * SIZE + x) * 4 + 1], 0) / 4,
      corners.reduce((sum, [x, y]) => sum + data[(y * SIZE + x) * 4 + 2], 0) / 4,
    ]
    for (let p = 0; p < SIZE * SIZE; p++) {
      const isInside = colorDistance(data, p * 4, bg) > 42
      mask[p] = isInside ? 1 : 0
      if (isInside) inside++
    }
  }

  const coverage = inside / (SIZE * SIZE)
  if (coverage < 0.04 || coverage > 0.92) {
    // degenerate mask (near-empty or near-full) — fall back to a soft
    // silhouette ellipse so the effect always renders something coherent
    const cx = SIZE * 0.5
    const cy = SIZE * 0.56
    const rx = SIZE * 0.42
    const ry = SIZE * 0.48
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const nx = (x - cx) / rx
        const ny = (y - cy) / ry
        mask[y * SIZE + x] = nx * nx + ny * ny <= 1 ? 1 : 0
      }
    }
  }

  return mask
}

/** Lays out dots along gently undulating horizontal flow-lines, clipped to
 * the silhouette mask, with a brighter glow cluster around the face. */
function buildFlowField(mask: Uint8Array): Dot[] {
  const dots: Dot[] = []
  let order = 0

  for (let row = 0, rowIndex = 0; row < SIZE; row += ROW_STEP, rowIndex++) {
    const phase = rowIndex * 0.35
    const amplitude = 5 + 3 * Math.sin(rowIndex * 0.12)

    for (let x = 0; x < SIZE; x += COL_STEP) {
      const wave =
        amplitude * Math.sin(x * 0.045 + phase) + amplitude * 0.4 * Math.sin(x * 0.11 - phase * 1.6)
      const y = row + wave
      if (y < 0 || y >= SIZE) continue

      const mx = Math.round(x)
      const my = Math.round(y)
      if (mask[my * SIZE + mx] !== 1) continue

      const distToFace = Math.hypot(x - FACE_CENTER.x, y - FACE_CENTER.y)
      const glow = Math.max(0, 1 - distToFace / FACE_RADIUS)

      dots.push({
        x,
        y,
        radius: BASE_RADIUS + glow * 1.1,
        alpha: Math.min(1, 0.55 + glow * 0.45),
        glow,
        order: order++,
        ox: 0,
        oy: 0,
      })
    }
  }

  return dots
}

export function useDotMatrix(canvasRef: React.RefObject<HTMLCanvasElement | null>, imageSrc?: string) {
  const dotsRef = useRef<Dot[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadDrawable(imageSrc).then((source) => {
      if (cancelled) return
      const mask = buildSilhouetteMask(source)
      dotsRef.current = buildFlowField(mask)
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [imageSrc])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    canvas.style.width = `${SIZE}px`
    canvas.style.height = `${SIZE}px`
    ctx.scale(dpr, dpr)

    const dots = dotsRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = prefersReducedMotion ? 0 : 1400
    const maxOrder = dots.reduce((max, d) => Math.max(max, d.order), 0) || 1
    const start = performance.now()

    const mouse = { x: -9999, y: -9999, active: false }
    let rafId = 0
    let loopRunning = false

    const drawSparkle = (alpha: number) => {
      const { x, y } = SPARKLE
      const size = 5
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = alpha
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.quadraticCurveTo(0, 0, size, 0)
      ctx.quadraticCurveTo(0, 0, 0, size)
      ctx.quadraticCurveTo(0, 0, -size, 0)
      ctx.quadraticCurveTo(0, 0, 0, -size)
      ctx.fill()
      ctx.restore()
    }

    const render = (now: number) => {
      const elapsed = now - start
      const progress = duration === 0 ? 1 : Math.min(1, elapsed / duration)
      const interactive = progress >= 1 && !prefersReducedMotion
      let stillSettling = false

      ctx.clearRect(0, 0, SIZE, SIZE)
      for (const dot of dots) {
        const threshold = dot.order / maxOrder
        if (progress < threshold) continue
        const reveal = Math.min(1, (progress - threshold) * 6)

        if (interactive) {
          const dx = dot.x - mouse.x
          const dy = dot.y - mouse.y
          const dist = Math.hypot(dx, dy)
          let targetOx = 0
          let targetOy = 0
          if (mouse.active && dist < HOVER_RADIUS && dist > 0.01) {
            const falloff = 1 - dist / HOVER_RADIUS
            targetOx = (dx / dist) * falloff * HOVER_STRENGTH
            targetOy = (dy / dist) * falloff * HOVER_STRENGTH
          }
          dot.ox += (targetOx - dot.ox) * HOVER_EASE
          dot.oy += (targetOy - dot.oy) * HOVER_EASE
          if (Math.abs(dot.ox) > 0.05 || Math.abs(dot.oy) > 0.05) stillSettling = true
        }

        ctx.beginPath()
        ctx.arc(dot.x + dot.ox, dot.y + dot.oy, dot.radius, 0, Math.PI * 2)
        const color = dot.glow > 0.5 ? '255, 255, 255' : '100, 255, 218'
        ctx.fillStyle = `rgba(${color}, ${dot.alpha * reveal})`
        ctx.fill()
      }

      if (progress > 0.85) {
        drawSparkle(Math.min(1, (progress - 0.85) * 6))
      }

      if (progress < 1 || mouse.active || stillSettling) {
        rafId = requestAnimationFrame(render)
      } else {
        loopRunning = false
      }
    }

    const ensureLoop = () => {
      if (!loopRunning) {
        loopRunning = true
        rafId = requestAnimationFrame(render)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * SIZE
      mouse.y = ((event.clientY - rect.top) / rect.height) * SIZE
      mouse.active = true
      ensureLoop()
    }

    const handlePointerLeave = () => {
      mouse.active = false
      ensureLoop()
    }

    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)

    ensureLoop()

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [ready, canvasRef])

  return { size: SIZE }
}
