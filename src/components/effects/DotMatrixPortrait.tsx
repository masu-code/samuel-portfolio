import { useRef } from 'react'
import { useDotMatrix } from '../../hooks/useDotMatrix'

export default function DotMatrixPortrait({ imageSrc, alt }: { imageSrc?: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useDotMatrix(canvasRef, imageSrc)

  return <canvas ref={canvasRef} role="img" aria-label={alt} className="max-w-full" />
}
