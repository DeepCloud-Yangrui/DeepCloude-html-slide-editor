import type { Slide, SlideElement, PresentationSettings } from '@/types'

interface ExportedProject {
  schemaVersion: string
  exportedAt: string
  project: {
    title: string
    settings: PresentationSettings
    slides: ExportSlide[]
  }
}

interface ExportSlide extends Omit<Slide, 'htmlSource' | 'notes'> {
  htmlSource?: string
}

function sanitizeSlideForExport(slide: Slide): ExportSlide {
  const { notes: _, ...rest } = slide
  // Keep htmlSource only if it's not empty
  const cleanSlide: ExportSlide = { ...rest }
  if (!cleanSlide.htmlSource) {
    delete cleanSlide.htmlSource
  }
  return cleanSlide
}

export function exportProjectToJSON(
  title: string,
  settings: PresentationSettings,
  slides: Slide[],
): void {
  const project: ExportedProject = {
    schemaVersion: '0.5.0',
    exportedAt: new Date().toISOString(),
    project: {
      title,
      settings,
      slides: slides.map(sanitizeSlideForExport),
    },
  }

  const json = JSON.stringify(project, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const safeTitle = title.replace(/[<>:"/\\|?*]/g, '_').slice(0, 100) || 'slides'
  const date = new Date().toISOString().slice(0, 10)
  const filename = `${safeTitle}_${date}.json`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
