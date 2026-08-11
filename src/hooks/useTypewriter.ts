import { useEffect, useState } from 'react'

export function useTypewriter(text: string, speedMs = 60, startDelayMs = 300) {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsDone(false)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplayedText(text)
      setIsDone(true)
      return
    }

    let index = 0
    let intervalId: ReturnType<typeof setInterval>

    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1
        setDisplayedText(text.slice(0, index))
        if (index >= text.length) {
          clearInterval(intervalId)
          setIsDone(true)
        }
      }, speedMs)
    }, startDelayMs)

    return () => {
      clearTimeout(startId)
      clearInterval(intervalId)
    }
  }, [text, speedMs, startDelayMs])

  return { displayedText, isDone }
}
