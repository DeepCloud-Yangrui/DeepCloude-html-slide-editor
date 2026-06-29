import { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useAutoPlay } from '@/hooks/useAutoPlay'
import AnimatedSlide from './AnimatedSlide'
import NavigationControls from './NavigationControls'
import ProgressBar from './ProgressBar'
import NarrationPanel from './NarrationPanel'
import { useState } from 'react'

export default function PresentationView() {
  const slides = usePresentationStore((s) => s.slides)
  const currentIndex = usePresentationStore((s) => s.currentIndex)
  const direction = usePresentationStore((s) => s.direction)
  const isPlaying = usePresentationStore((s) => s.isPlaying)
  const goToSlide = usePresentationStore((s) => s.goToSlide)
  const nextSlide = usePresentationStore((s) => s.nextSlide)
  const prevSlide = usePresentationStore((s) => s.prevSlide)
  const togglePlay = usePresentationStore((s) => s.togglePlay)

  const [showNarration, setShowNarration] = useState(false)

  const currentSlide = slides[currentIndex]

  // Keyboard shortcuts
  useKeyboard({
    ArrowRight: nextSlide,
    ArrowDown: nextSlide,
    ' ': () => {
      nextSlide()
    },
    ArrowLeft: prevSlide,
    ArrowUp: prevSlide,
    Home: () => goToSlide(0),
    End: () => goToSlide(slides.length - 1),
    Escape: () => {}, // handled by parent
    f: togglePlay,
  })

  // Auto-play
  const handleAutoAdvance = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      nextSlide()
    }
  }, [currentIndex, slides.length, nextSlide])

  const currentDuration = currentSlide?.duration ?? 0
  useAutoPlay(isPlaying, currentDuration > 0 ? currentDuration : 0, handleAutoAdvance)

  if (!currentSlide) {
    return (
      <div className="w-full h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-stone-400">没有幻灯片</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-stone-950 relative overflow-hidden select-none">
      {/* Progress bar */}
      <ProgressBar currentIndex={currentIndex} totalSlides={slides.length} onJump={goToSlide} />

      {/* Slide area */}
      <div className="absolute inset-0 top-4 bottom-0">
        <AnimatePresence mode="wait" initial={false}>
          <AnimatedSlide key={currentSlide.id} slide={currentSlide} direction={direction} />
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <NavigationControls
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < slides.length - 1}
        currentIndex={currentIndex}
        totalSlides={slides.length}
        onPrev={prevSlide}
        onNext={nextSlide}
      />

      {/* Narration panel */}
      <NarrationPanel
        isOpen={showNarration}
        onToggle={() => setShowNarration(!showNarration)}
        content={currentSlide.content}
        title={currentSlide.title}
      />

      {/* Click areas for prev/next */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-pointer" onClick={prevSlide} />
      <div className="absolute inset-y-0 right-0 w-1/4 z-30 cursor-pointer" onClick={nextSlide} />
    </div>
  )
}
