import { useState } from 'react'

export default function ImageWithFallback({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-navy-light font-serif text-sm text-slate ${className}`}
      >
        imagen pendiente
      </div>
    )
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} className={className} />
}
