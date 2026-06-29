export type TemplateCategory = 'opening' | 'content' | 'visual' | 'data' | 'comparison' | 'closing'

export interface Template {
  id: string
  name: string
  nameZh: string
  description: string
  descriptionZh: string
  category: TemplateCategory
  icon: string
  previewColors: string[]
  defaultAnimationPreset: string
}
