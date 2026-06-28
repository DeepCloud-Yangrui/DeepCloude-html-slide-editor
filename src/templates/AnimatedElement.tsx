import { motion } from 'framer-motion'
import { elementEntrance } from '@/animations/variants'
import type { SlideElement } from '@/types'

interface AnimatedElementProps {
  element: SlideElement
  animated: boolean
  index?: number
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

export default function AnimatedElement({
  element,
  animated,
  index = 0,
  onClick,
  className = '',
  children,
}: AnimatedElementProps) {
  if (!animated) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    )
  }

  const variant = elementEntrance[element.animation.preset] ?? elementEntrance.fadeInUp

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate="visible"
      transition={{
        delay: element.animation.delay,
        duration: element.animation.duration,
        ease: element.animation.easing === 'spring'
          ? undefined
          : [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
