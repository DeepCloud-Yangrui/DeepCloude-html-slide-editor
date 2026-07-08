import { useRef } from 'react'
import { useEditorStore, useCurrentSlide } from '@/store/useEditorStore'
import TemplateRenderer from '@/templates/TemplateRenderer'
import SelectionOverlay from './SelectionOverlay'

export default function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const currentSlide = useCurrentSlide()
  const slides = useEditorStore((s) => s.slides)
  const setSelectedElement = useEditorStore((s) => s.setSelectedElement)
  const updateElementContent = useEditorStore((s) => s.updateElementContent)
  const currentIdx = currentSlide ? slides.findIndex((s) => s.id === currentSlide.id) + 1 : 0

  if (!currentSlide) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          backgroundImage: 'radial-gradient(circle, #d6d3d1 0.5px, transparent 0.5px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="text-stone-400 text-sm">请选择或创建一张幻灯片</div>
      </div>
    )
  }

  const isFreeTemplate = currentSlide.templateId === 'free'

  function handleElementClick(elementId: string) {
    setSelectedElement(elementId)
  }

  function handleElementChange(elementId: string, field: string, value: string) {
    updateElementContent(currentSlide!.id, elementId, { [field]: value })
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative overflow-auto"
      style={{
        backgroundImage: 'radial-gradient(circle, #d6d3d1 0.5px, transparent 0.5px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Page info bar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 text-xs text-stone-400 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-stone-200/60 z-10">
        <span>
          Page {currentIdx} / {slides.length}
        </span>
        <span className="w-px h-3 bg-stone-200" />
        <span>16:9</span>
        <span className="w-px h-3 bg-stone-200" />
        <span>1280×720</span>
      </div>

      {/* Slide frame */}
      <div
        ref={canvasRef}
        className="slide-shadow rounded-xl overflow-hidden bg-white"
        style={{ width: 'min(90%, 800px)', aspectRatio: '16/9' }}
      >
        <TemplateRenderer
          slide={currentSlide}
          mode="editor"
          animated={false}
          onElementClick={handleElementClick}
          onElementChange={handleElementChange}
        />
        {isFreeTemplate && <SelectionOverlay canvasRef={canvasRef} />}
      </div>
    </div>
  )
}
