import type { TransitionType, Slide } from './slide'

export interface PresentationSettings {
  autoPlay: boolean
  autoPlayInterval: number
  defaultTransition: TransitionType
  showProgressBar: boolean
  showNarrationPanel: boolean
  aspectRatio: '16:9' | '4:3' | '16:10'
}

export interface Presentation {
  id: string
  title: string
  description: string
  schemaVersion: string
  slides: Slide[]
  settings: PresentationSettings
  createdAt: string
  updatedAt: string
}
