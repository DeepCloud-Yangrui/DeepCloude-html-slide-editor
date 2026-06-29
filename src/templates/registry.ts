import type { ComponentType } from 'react'
import type { Slide } from '@/types'
import TitleSlide from './TitleSlide'
import BulletPointsSlide from './BulletPointsSlide'
import ImageTextSlide from './ImageTextSlide'
import QuoteSlide from './QuoteSlide'
import StatsSlide from './StatsSlide'
import TimelineSlide from './TimelineSlide'
import ComparisonSlide from './ComparisonSlide'
import FullImageSlide from './FullImageSlide'
import HTMLSlide from './HTMLSlide'
import ContentSlide from './ContentSlide'
import FreeCanvas from './FreeCanvas'

export interface TemplateComponentProps {
  slide: Slide
  mode: 'editor' | 'presentation'
  animated?: boolean
  onElementClick?: (elementId: string) => void
  onElementChange?: (elementId: string, field: string, value: string) => void
}

const registry: Record<string, ComponentType<TemplateComponentProps>> = {
  title: TitleSlide,
  bullets: BulletPointsSlide,
  'image-text': ImageTextSlide,
  quote: QuoteSlide,
  stats: StatsSlide,
  timeline: TimelineSlide,
  comparison: ComparisonSlide,
  'full-image': FullImageSlide,
  html: HTMLSlide,
  content: ContentSlide,
  free: FreeCanvas,
}

export function getTemplateComponent(templateId: string): ComponentType<TemplateComponentProps> {
  return registry[templateId] ?? TitleSlide
}
