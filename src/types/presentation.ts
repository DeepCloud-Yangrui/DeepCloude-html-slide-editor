import type { TransitionType } from './slide'

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
  slides: any[]
  settings: PresentationSettings
  createdAt: string
  updatedAt: string
}
