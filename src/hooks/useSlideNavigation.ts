import { useCallback } from 'react'

export function useSlideNavigation(
  currentIndex: number,
  totalSlides: number,
  onGoTo: (index: number) => void,
) {
  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      onGoTo(currentIndex + 1)
    }
  }, [currentIndex, totalSlides, onGoTo])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      onGoTo(currentIndex - 1)
    }
  }, [currentIndex, onGoTo])

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        onGoTo(index)
      }
    },
    [totalSlides, onGoTo],
  )

  const goFirst = useCallback(() => onGoTo(0), [onGoTo])
  const goLast = useCallback(() => onGoTo(totalSlides - 1), [totalSlides, onGoTo])

  return {
    goNext,
    goPrev,
    goTo,
    goFirst,
    goLast,
    hasNext: currentIndex < totalSlides - 1,
    hasPrev: currentIndex > 0,
    currentIndex,
    totalSlides,
  }
}
