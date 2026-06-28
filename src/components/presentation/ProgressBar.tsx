import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentIndex: number
  totalSlides: number
  onJump: (index: number) => void
}

export default function ProgressBar({ currentIndex, totalSlides, onJump }: ProgressBarProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-1.5">
      {Array.from({ length: totalSlides }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className="flex-1 h-1 rounded-full overflow-hidden bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: i <= currentIndex ? '100%' : '0%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </button>
      ))}
    </div>
  )
}
