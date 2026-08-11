import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  char: string
  fontSize: number
  baseAlpha: number
  currentAlpha: number
  delay: number
  shimmer: number
}

interface SamplePoint {
  x: number
  y: number
  char: string
  alpha: number
}

/** Darkest → brightest. A blank pixel renders as a space (invisible). */
const CHARS = ' .:-=+*#%@'.split('')
const FIT_RATIO = 0.8
const REPULSE_RADIUS_RATIO = 0.2
const REPULSE_STRENGTH = 4
const MOUSE_EASE = 0.15
const REVEAL_DURATION = 1.5
const SETTLE_DURATION = 2.5
const SHIMMER_WINDOW = 3
const SCATTER_RANGE = 400

function getResponsiveSize(width: number) {
  if (width <= 480) return Math.min(220, width - 40)
  if (width <= 768) return Math.min(280, width - 60)
  return 400
}

function drawFallbackSilhouette(ctx: CanvasRenderingContext2D, size: number) {
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = 'rgba(255,255,255,1)'

  // shoulders / cloak
  ctx.beginPath()
  ctx.moveTo(size * 0.12, size)
  ctx.quadraticCurveTo(size * 0.5, size * 0.58, size * 0.88, size)
  ctx.closePath()
  ctx.fill()

  // head
  const cx = size * 0.5
  const cy = size * 0.42
  const r = size * 0.24
  ctx.beginPath()
  ctx.ellipse(cx, cy, r * 0.82, r, 0, 0, Math.PI * 2)
  ctx.fill()
}

async function loadSource(imageSrc: string | undefined, size: number): Promise<CanvasImageSource> {
  if (imageSrc) {
    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = imageSrc
      })
    } catch {
      // fall through to procedural placeholder
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  drawFallbackSilhouette(canvas.getContext('2d')!, size)
  return canvas
}

/** Samples a source image (fit to 80% of the canvas, aspect-preserved) into a
 * sparse grid of characters, one per opaque pixel, using luminance -> glyph
 * density from CHARS. Transparent pixels (alpha <= 128) are skipped, so a
 * cutout photo naturally produces the silhouette shape. */
function sampleToPoints(source: CanvasImageSource, size: number): SamplePoint[] {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const srcWidth = 'width' in source ? (source as HTMLImageElement).naturalWidth || (source as HTMLCanvasElement).width : size
  const srcHeight = 'height' in source ? (source as HTMLImageElement).naturalHeight || (source as HTMLCanvasElement).height : size
  const aspect = srcWidth / srcHeight

  let fitHeight = size * FIT_RATIO
  let fitWidth = fitHeight * aspect
  if (fitWidth > size * FIT_RATIO) {
    fitWidth = size * FIT_RATIO
    fitHeight = fitWidth / aspect
  }
  const offsetX = (size - fitWidth) / 2
  const offsetY = (size - fitHeight) / 2
  ctx.drawImage(source, offsetX, offsetY, fitWidth, fitHeight)

  const { data } = ctx.getImageData(0, 0, size, size)
  const isCompact = size <= 280
  const h = isCompact ? 5 : 7
  const colStep = h * 0.7
  const rowStep = h * 1.1

  const points: SamplePoint[] = []
  for (let y = 0; y < size; y += rowStep) {
    for (let x = 0; x < size; x += colStep) {
      const i = (Math.floor(y) * size + Math.floor(x)) * 4
      if (data[i + 3] > 128) {
        const luminance = (data[i] + data[i + 1] + data[i + 2]) / 765
        const charIndex = Math.floor(luminance * (CHARS.length - 1))
        points.push({
          x: Number(x.toFixed(1)),
          y: Number(y.toFixed(1)),
          char: CHARS[charIndex],
          alpha: Number((0.4 + luminance * 0.6).toFixed(2)),
        })
      }
    }
  }
  return points
}

/** Particles start scattered randomly and spring toward their sampled target
 * position, each with its own reveal delay and shimmer phase. */
function createParticles(points: SamplePoint[], isCompact: boolean): Particle[] {
  const fontSize = isCompact ? 5 : 7
  return points.map((p) => ({
    x: p.x + (Math.random() - 0.5) * SCATTER_RANGE,
    y: p.y + (Math.random() - 0.5) * SCATTER_RANGE,
    targetX: p.x,
    targetY: p.y,
    vx: 0,
    vy: 0,
    char: p.char,
    fontSize,
    baseAlpha: p.alpha,
    currentAlpha: 0,
    delay: Math.random() * 0.4,
    shimmer: Math.random() * Math.PI * 2,
  }))
}

export function useDotMatrix(canvasRef: React.RefObject<HTMLCanvasElement | null>, imageSrc?: string) {
  const [size, setSize] = useState(() => getResponsiveSize(typeof window !== 'undefined' ? window.innerWidth : 1200))
  const particlesRef = useRef<Particle[]>([])
  const pointsCache = useRef(new Map<string, SamplePoint[]>())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setSize(getResponsiveSize(window.innerWidth)), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const isCompact = size <= 280
    const cacheKey = `${imageSrc ?? 'fallback'}:${size}`
    const cached = pointsCache.current.get(cacheKey)

    if (cached) {
      particlesRef.current = createParticles(cached, isCompact)
      setReady(true)
      return
    }

    loadSource(imageSrc, size).then((source) => {
      if (cancelled) return
      const points = sampleToPoints(source, size)
      pointsCache.current.set(cacheKey, points)
      particlesRef.current = createParticles(points, isCompact)
      setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [imageSrc, size])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fontSize = size <= 280 ? 5 : 7
    const repulseRadius = size * REPULSE_RADIUS_RATIO

    const mouseRaw = { x: -1000, y: -1000 }
    const mouseEased = { x: -1000, y: -1000, active: false }
    const start = performance.now()
    let rafId = 0

    if (prefersReducedMotion) {
      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const p of particlesRef.current) {
        ctx.fillStyle = `rgba(100, 255, 218, ${p.baseAlpha})`
        ctx.fillText(p.char, p.targetX, p.targetY)
      }
      return
    }

    const render = () => {
      rafId = requestAnimationFrame(render)

      const particles = particlesRef.current
      ctx.clearRect(0, 0, size, size)
      if (!particles.length) return

      const elapsed = (performance.now() - start) / 1000
      mouseEased.x += (mouseRaw.x - mouseEased.x) * MOUSE_EASE
      mouseEased.y += (mouseRaw.y - mouseEased.y) * MOUSE_EASE

      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (const p of particles) {
        const t = elapsed - p.delay
        if (t < 0) continue

        const reveal = 1 - (1 - Math.min(t / REVEAL_DURATION, 1)) ** 2
        const isShimmering = mouseEased.active || t < SHIMMER_WINDOW
        const shimmerDelta = isShimmering ? Math.sin(elapsed * 2 + p.shimmer) * 0.1 : 0
        p.currentAlpha = Math.max(0, p.baseAlpha * reveal + shimmerDelta)

        const settle = 1 - (1 - Math.min(t / SETTLE_DURATION, 1)) ** 3

        if (mouseEased.active) {
          const dx = p.x - mouseEased.x
          const dy = p.y - mouseEased.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < repulseRadius && dist > 0) {
            const force = (1 - dist / repulseRadius) * REPULSE_STRENGTH
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        const dxTarget = p.targetX - p.x
        const dyTarget = p.targetY - p.y
        const stiffness = 0.01 + settle * 0.08
        p.vx += dxTarget * stiffness
        p.vy += dyTarget * stiffness

        if (isShimmering) {
          p.vx += Math.sin(elapsed * 0.5 + p.targetY * 0.1) * 0.15
          p.vy += Math.cos(elapsed * 0.5 + p.targetX * 0.1) * 0.15
          p.vx *= 0.92
          p.vy *= 0.92
        } else {
          p.vx *= 0.85
          p.vy *= 0.85
          if (t > 4 && Math.abs(dxTarget) < 0.01 && Math.abs(dyTarget) < 0.01) {
            p.x = p.targetX
            p.y = p.targetY
            p.vx = 0
            p.vy = 0
          }
        }

        p.x += p.vx
        p.y += p.vy

        ctx.fillStyle = `rgba(100, 255, 218, ${p.currentAlpha})`
        ctx.fillText(p.char, p.x, p.y)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRaw.x = event.clientX - rect.left
      mouseRaw.y = event.clientY - rect.top
      mouseEased.active = true
    }
    const resetMouse = () => {
      mouseEased.active = false
      mouseRaw.x = -1000
      mouseRaw.y = -1000
    }
    const handleTouchMove = (event: TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const touch = event.touches[0]
      mouseRaw.x = touch.clientX - rect.left
      mouseRaw.y = touch.clientY - rect.top
      mouseEased.active = true
      if (event.cancelable) event.preventDefault()
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', resetMouse)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', resetMouse)

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', resetMouse)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', resetMouse)
    }
  }, [ready, canvasRef, size])

  return { size }
}
