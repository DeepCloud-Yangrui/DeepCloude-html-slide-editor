import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationControlsProps {
  hasPrev: boolean
  hasNext: boolean
  currentIndex: number
  totalSlides: number
  onPrev: () => void
  onNext: () => void
}

export default function NavigationControls({
  hasPrev,
  hasNext,
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
}: NavigationControlsProps) {
  const [visible, setVisible] = useState(false)
  const [showCounter, setShowCounter] = useState(true)

  // Show controls on mouse move, hide after 3s idle
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    function handleMove() {
      setVisible(true)
      clearTimeout(timer)
      timer = setTimeout(() => setVisible(false), 3000)
    }

    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      clearTimeout(timer)
    }
  }, [])

  // Show slide counter briefly on each change
  useEffect(() => {
    setShowCounter(true)
    const timer = setTimeout(() => setShowCounter(false), 2000)
    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <>
      {/* Prev button */}
      <AnimatePresence>
        {visible && hasPrev && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12
                       flex items-center justify-center rounded-xl
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm
                       text-white transition-colors cursor-pointer"
            onClick={onPrev}
          >
            <ChevronLeft size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Next button */}
      <AnimatePresence>
        {visible && hasNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12
                       flex items-center justify-center rounded-xl
                       bg-white/10 hover:bg-white/20 backdrop-blur-sm
                       text-white transition-colors cursor-pointer"
            onClick={onNext}
          >
            <ChevronRight size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide counter */}
      <AnimatePresence>
        {showCounter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40
                       px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm
                       text-white text-sm font-medium"
          >
            {currentIndex + 1} / {totalSlides}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
