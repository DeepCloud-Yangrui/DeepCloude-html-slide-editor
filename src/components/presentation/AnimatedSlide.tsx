import { motion } from 'framer-motion'
import { getSlideVariant } from '@/animations/variants'
import { slideTransitionConfig } from '@/animations/transitions'
import TemplateRenderer from '@/templates/TemplateRenderer'
import type { Slide } from '@/types'

interface AnimatedSlideProps {
  slide: Slide
  direction: 1 | -1
}

export default function AnimatedSlide({ slide, direction }: AnimatedSlideProps) {
  const variant = getSlideVariant(slide.transitionType, direction)

  return (
    <motion.div
      variants={variant}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slideTransitionConfig}
      className="absolute inset-0"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      <TemplateRenderer slide={slide} mode="presentation" animated={true} />
    </motion.div>
  )
}
