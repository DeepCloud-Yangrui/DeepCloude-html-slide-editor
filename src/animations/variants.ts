import type { Variants } from 'framer-motion'

// ==================== Slide Transitions ====================
export const slideTransitions: Record<string, Variants> = {
  fade: {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  },
  'slide-left': {
    enter: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: '-30%', opacity: 0 },
  },
  'slide-right': {
    enter: { x: '-100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: '30%', opacity: 0 },
  },
  'slide-up': {
    enter: { y: '100%', opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: '-30%', opacity: 0 },
  },
  'slide-down': {
    enter: { y: '-100%', opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: '30%', opacity: 0 },
  },
  'zoom-in': {
    enter: { scale: 0.5, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  'zoom-out': {
    enter: { scale: 1.5, opacity: 0 },
    center: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  'flip-x': {
    enter: { rotateX: 90, opacity: 0 },
    center: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 },
  },
  'flip-y': {
    enter: { rotateY: 90, opacity: 0 },
    center: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  none: {
    enter: {},
    center: {},
    exit: {},
  },
}

// ==================== Direction-aware Slide Transitions ====================
export function getSlideVariant(transitionType: string, direction: 1 | -1): Variants {
  // For direction-aware transitions, we swap enter/exit
  const base = slideTransitions[transitionType] ?? slideTransitions.fade

  if (direction === -1) {
    // Reverse: swap enter and exit directions
    const reversedEnter = { ...base.exit }
    const reversedExit = { ...base.enter }
    return {
      enter: reversedEnter,
      center: base.center,
      exit: reversedExit,
    }
  }

  return base
}

// ==================== Element Entrance Variants ====================
export const elementEntrance: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  scaleInBounce: {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
}

// ==================== Stagger Container ====================
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

// ==================== Ken Burns ====================
export const kenBurns: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: 1.05,
    transition: { duration: 8, ease: 'easeOut' },
  },
}

// ==================== Special: Typewriter ====================
export const typewriterChar: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.02 },
  },
}
