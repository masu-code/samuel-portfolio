import { useEffect, useRef, useState } from 'react'

interface Dot {
  x: number
  y: number
  radius: number
  alpha: number
  order: number
}

const SIZE = 320
const STEP = 6
const MAX_RADIUS = 1.6

function drawFallbackSilhouette(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, SIZE, SIZE)

  // shoulders
  ctx.beginPath()
  ctx.moveTo(SIZE * 0.15, SIZE)
  ctx.quadraticCurveTo(SIZE * 0.5, SIZE * 0.62, SIZE * 0.85, SIZE)
  ctx.closePath()
  const shoulderGradient = ctx.createLinearGradient(0, SIZE * 0.6, 0, SIZE)
  shoulderGradient.addColorStop(0, 'rgba(255,255,255,0.55)')
  shoulderGradient.addColorStop(1, 'rgba(255,255,255,0.15)')
  ctx.fillStyle = shoulderGradient
  ctx.fill()

  // head
  const cx = SIZE * 0.5
  const cy = SIZE * 0.42
  const r = SIZE * 0.24
  const headGradient = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r)
  headGradient.addColorStop(0, 'rgba(255,255,255,0.95)')
  headGradient.addColorStop(1, 'rgba(255,255,255,0.35)')
  ctx.beginPath()
  ctx.ellipse(cx, cy, r * 0.82, r, 0, 0, Math.PI * 2)
  ctx.fillStyle = headGradient
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

function sampleToDots(source: CanvasImageSource): Dot[] {
  const sampleCanvas = document.createElement('canvas')
  sampleCanvas.width = SIZE
  sampleCanvas.height = SIZE
  const ctx = sampleCanvas.getContext('2d')!
  ctx.drawImage(source, 0, 0, SIZE, SIZE)
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE)

  const dots: Dot[] = []
  let order = 0
  for (let y = 0; y < SIZE; y += STEP) {
    for (let x = 0; x < SIZE; x += STEP) {
      const i = (y * SIZE + x) * 4
      const luminance = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
      if (luminance < 0.08) continue
      dots.push({
        x,
        y,
        radius: Math.max(0.4, luminance * MAX_RADIUS),
        alpha: Math.min(1, luminance + 0.15),
        order: order++,
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
      dotsRef.current = sampleToDots(source)
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
    const duration = prefersReducedMotion ? 0 : 1100
    const maxOrder = dots.reduce((max, d) => Math.max(max, d.order), 0) || 1
    let rafId: number
    const start = performance.now()

    const render = (now: number) => {
      const elapsed = now - start
      const progress = duration === 0 ? 1 : Math.min(1, elapsed / duration)

      ctx.clearRect(0, 0, SIZE, SIZE)
      for (const dot of dots) {
        const threshold = dot.order / maxOrder
        if (progress < threshold) continue
        const reveal = Math.min(1, (progress - threshold) * 6)
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 255, 218, ${dot.alpha * reveal})`
        ctx.fill()
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(render)
      }
    }

    rafId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafId)
  }, [ready, canvasRef])

  return { size: SIZE }
}
