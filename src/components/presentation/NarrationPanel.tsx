import { motion, AnimatePresence } from 'framer-motion'
import { X, ScrollText } from 'lucide-react'

interface NarrationPanelProps {
  isOpen: boolean
  onToggle: () => void
  content: string
  title: string
}

export default function NarrationPanel({ isOpen, onToggle, content, title }: NarrationPanelProps) {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center
                   rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm
                   text-white transition-colors cursor-pointer"
      >
        <ScrollText size={18} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 bottom-0 w-96 z-40
                       bg-stone-900/95 backdrop-blur-xl border-l border-white/10
                       flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">口播内容</h3>
              <button
                onClick={onToggle}
                className="w-8 h-8 flex items-center justify-center rounded-lg
                           text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {title && (
                <h4 className="text-white text-base font-semibold mb-3">{title}</h4>
              )}
              <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                {content || '暂无口播内容'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
