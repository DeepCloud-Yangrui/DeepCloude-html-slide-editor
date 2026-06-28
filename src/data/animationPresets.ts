import type { TransitionType, ElementPreset } from '@/types'

export interface AnimationPresetConfig {
  id: string
  name: string
  nameZh: string
  description: string
  transitionType: TransitionType
  elementPresets: { type: string; preset: ElementPreset; delay: number; duration: number }[]
  staggerChildren: number
}

export const ANIMATION_PRESETS: AnimationPresetConfig[] = [
  {
    id: 'gentle',
    name: 'Gentle',
    nameZh: '柔和渐入',
    description: 'Soft fades with subtle upward movement',
    transitionType: 'fade',
    elementPresets: [
      { type: 'heading', preset: 'fadeInUp', delay: 0, duration: 0.5 },
      { type: 'subheading', preset: 'fadeInUp', delay: 0.15, duration: 0.5 },
      { type: 'body', preset: 'fadeInUp', delay: 0.25, duration: 0.5 },
      { type: 'caption', preset: 'fadeIn', delay: 0.35, duration: 0.5 },
      { type: 'default', preset: 'fadeInUp', delay: 0, duration: 0.4 },
    ],
    staggerChildren: 0.1,
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    nameZh: '戏剧性',
    description: 'Bold entrance with scale and spring physics',
    transitionType: 'zoom-in',
    elementPresets: [
      { type: 'heading', preset: 'scaleInBounce', delay: 0, duration: 0.7 },
      { type: 'subheading', preset: 'fadeInUp', delay: 0.3, duration: 0.6 },
      { type: 'body', preset: 'fadeInUp', delay: 0.4, duration: 0.5 },
      { type: 'caption', preset: 'fadeIn', delay: 0.5, duration: 0.5 },
      { type: 'default', preset: 'scaleInBounce', delay: 0, duration: 0.5 },
    ],
    staggerChildren: 0.15,
  },
  {
    id: 'stagger',
    name: 'Staggered',
    nameZh: '逐项浮现',
    description: 'Elements cascade in one after another',
    transitionType: 'slide-up',
    elementPresets: [
      { type: 'heading', preset: 'fadeInDown', delay: 0, duration: 0.5 },
      { type: 'subheading', preset: 'fadeInLeft', delay: 0.1, duration: 0.5 },
      { type: 'body', preset: 'fadeInLeft', delay: 0, duration: 0.4 },
      { type: 'caption', preset: 'fadeIn', delay: 0, duration: 0.4 },
      { type: 'default', preset: 'fadeInLeft', delay: 0, duration: 0.4 },
    ],
    staggerChildren: 0.12,
  },
  {
    id: 'smooth',
    name: 'Smooth',
    nameZh: '平滑滑动',
    description: 'Smooth sliding transitions between slides',
    transitionType: 'slide-right',
    elementPresets: [
      { type: 'heading', preset: 'fadeInRight', delay: 0, duration: 0.5 },
      { type: 'subheading', preset: 'fadeInRight', delay: 0.1, duration: 0.5 },
      { type: 'body', preset: 'fadeInRight', delay: 0.15, duration: 0.4 },
      { type: 'caption', preset: 'fadeIn', delay: 0.2, duration: 0.4 },
      { type: 'default', preset: 'fadeInRight', delay: 0, duration: 0.4 },
    ],
    staggerChildren: 0.08,
  },
  {
    id: 'reveal',
    name: 'Reveal',
    nameZh: '揭幕效果',
    description: 'Elements reveal with blur and scale',
    transitionType: 'fade',
    elementPresets: [
      { type: 'heading', preset: 'blurIn', delay: 0, duration: 0.6 },
      { type: 'subheading', preset: 'blurIn', delay: 0.1, duration: 0.5 },
      { type: 'body', preset: 'blurIn', delay: 0.2, duration: 0.5 },
      { type: 'caption', preset: 'blurIn', delay: 0.3, duration: 0.5 },
      { type: 'default', preset: 'blurIn', delay: 0, duration: 0.4 },
    ],
    staggerChildren: 0.1,
  },
]

export function getAnimationPreset(id: string): AnimationPresetConfig | undefined {
  return ANIMATION_PRESETS.find((p) => p.id === id)
}

export function getElementPreset(
  presetId: string,
  type: string,
): { preset: ElementPreset; delay: number; duration: number } {
  const preset = getAnimationPreset(presetId)
  const elementPreset =
    preset?.elementPresets.find((ep) => ep.type === type) ??
    preset?.elementPresets.find((ep) => ep.type === 'default')
  return {
    preset: elementPreset?.preset ?? 'fadeInUp',
    delay: elementPreset?.delay ?? 0,
    duration: elementPreset?.duration ?? 0.4,
  }
}
