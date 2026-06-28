export const smoothSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

export const gentleTween = {
  type: 'tween' as const,
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1], // Material Design standard
}

export const bouncySpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 15,
}

export const slowReveal = {
  type: 'tween' as const,
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1],
}

export const slideTransitionConfig = {
  type: 'tween' as const,
  duration: 0.55,
  ease: [0.4, 0, 0.2, 1],
}
