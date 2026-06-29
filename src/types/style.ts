export interface ElementStyle {
  fontSize?: string // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  fontWeight?: string // 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  color?: string // #RGB 或 #RRGGBB
  textAlign?: string // 'left' | 'center' | 'right' | 'justify'
  backgroundColor?: string // #RGB 或 #RRGGBB
  padding?: string // 'none' | 'sm' | 'md' | 'lg'
  borderRadius?: string // 'none' | 'sm' | 'md' | 'lg' | 'full'
}
