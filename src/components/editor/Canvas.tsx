import { useRef } from 'react'
import { useEditorStore, useCurrentSlide } from '@/store/useEditorStore'
import TemplateRenderer from '@/templates/TemplateRenderer'
import SelectionOverlay from './SelectionOverlay'

export default function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const currentSlide = useCurrentSlide()
  const setSelectedElement = useEditorStore((s) => s.setSelectedElement)
  const updateElementContent = useEditorStore((s) => s.updateElementContent)

  if (!currentSlide) {
    return (
      <div className="flex-1 flex items-center justify-center bg-stone-100/50">
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
    <div className="flex-1 flex items-center justify-center bg-stone-100/50 p-8">
      <div
        ref={canvasRef}
        className="relative w-full max-w-[960px] slide-shadow rounded-lg overflow-hidden bg-white
                   transition-shadow duration-300 hover:slide-shadow-hover"
        style={{ aspectRatio: '16 / 9' }}
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
