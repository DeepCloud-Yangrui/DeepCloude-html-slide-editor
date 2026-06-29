import { useEditorStore } from '@/store/useEditorStore'
import { toLayoutStyle } from '@/utils/elementLayout'

export default function SelectionOverlay() {
  const selectedElementId = useEditorStore((s) => s.selectedElementId)
  const slides = useEditorStore((s) => s.slides)
  const currentSlideId = useEditorStore((s) => s.currentSlideId)

  if (!selectedElementId || !currentSlideId) return null

  const currentSlide = slides.find((s) => s.id === currentSlideId)
  if (!currentSlide) return null

  const element = currentSlide.elements.find((e) => e.id === selectedElementId)
  if (!element || !element.layout) return null

  return (
    <div
      style={{
        ...toLayoutStyle(element.layout),
        pointerEvents: 'none',
        zIndex: 1000,
        border: '2px solid #6366F1',
        borderRadius: '2px',
        position: 'absolute',
      }}
    />
  )
}
