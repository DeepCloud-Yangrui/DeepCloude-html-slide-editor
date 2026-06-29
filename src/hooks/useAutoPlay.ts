import { useEffect, useRef, useCallback } from 'react'

export function useAutoPlay(enabled: boolean, interval: number, onAdvance: () => void) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    clearTimer()

    if (enabled && interval > 0) {
      timerRef.current = setInterval(() => {
        onAdvanceRef.current()
      }, interval * 1000)
    }

    return clearTimer
  }, [enabled, interval, clearTimer])
}
