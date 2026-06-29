// ==================== Slide Element Types ====================

export type SlideElementType =
  | 'text'
  | 'image'
  | 'stat-card'
  | 'timeline-node'
  | 'comparison-row'
  | 'quote-block'
  | 'icon-bullet'
  | 'html-content'
  | 'callout'
  | 'tag-row'
  | 'gloss'
  | 'footer-bar'

export interface TextContent {
  text: string
  variant: 'heading' | 'subheading' | 'body' | 'caption'
  alignment: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
}

export interface ImageContent {
  src: string
  alt: string
  fit: 'cover' | 'contain' | 'fill'
  caption: string
  position?: 'left' | 'right' | 'center' | 'background'
}

export interface StatCardContent {
  value: string
  label: string
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: string
  color?: string
}

export interface TimelineNodeContent {
  date: string
  title: string
  description: string
  icon: string
}

export interface ComparisonRowContent {
  label: string
  leftValue: string
  rightValue: string
  leftDetail: string
  rightDetail: string
  leftIcon?: string
  rightIcon?: string
}

export interface QuoteBlockContent {
  quote: string
  author: string
  role: string
  style: 'minimal' | 'decorative' | 'bold'
}

export interface IconBulletContent {
  icon: string
  title: string
  description: string
}

export interface HTMLContent {
  html: string
  css: string
}

export interface CalloutContent {
  variant: 'doing' | 'not-do' | 'info' | 'warn'
  title: string
  body: string
}

export interface TagRowContent {
  tags: string[]
}

export interface GlossContent {
  items: { term: string; definition: string }[]
}

export interface FooterBarContent {
  progressPercent: number
  pageLabel: string
  keyHint: string
}

import type { ElementStyle } from './style'
import type { ElementLayout } from './layout'

export type SlideElementContent =
  | TextContent
  | ImageContent
  | StatCardContent
  | TimelineNodeContent
  | ComparisonRowContent
  | QuoteBlockContent
  | IconBulletContent
  | HTMLContent
  | CalloutContent
  | TagRowContent
  | GlossContent
  | FooterBarContent

// ==================== Animation Config ====================

export interface ElementAnimationConfig {
  preset: string
  delay: number
  duration: number
  easing: string
  staggerChildren: number
}

// ==================== Slide Element ====================

export interface SlideElement {
  id: string
  type: SlideElementType
  content: SlideElementContent
  animation: ElementAnimationConfig
  style: ElementStyle
  layout?: ElementLayout
}

// ==================== Transition Type ====================

export type TransitionType =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-x'
  | 'flip-y'
  | 'none'

// ==================== Slide ====================

export interface Slide {
  id: string
  templateId: string
  title: string
  subtitle: string
  content: string // speaker notes / 演讲备注
  /** @deprecated merged into `content`, kept for backward compatibility */
  notes?: string
  elements: SlideElement[]
  order: number
  animationPreset: string
  transitionType: TransitionType
  backgroundColor: string
  backgroundImage: string | null
  duration: number
  htmlSource?: string
}
