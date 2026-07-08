import { Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEditorStore } from '@/store/useEditorStore'
import { getTemplateById } from '@/data/templates'
import SlideThumbnail from './SlideThumbnail'

export default function SlideList() {
  const slides = useEditorStore((s) => s.slides)
  const currentSlideId = useEditorStore((s) => s.currentSlideId)
  const setCurrentSlide = useEditorStore((s) => s.setCurrentSlide)
  const addSlide = useEditorStore((s) => s.addSlide)
  const duplicateSlide = useEditorStore((s) => s.duplicateSlide)
  const deleteSlide = useEditorStore((s) => s.deleteSlide)
  const moveSlide = useEditorStore((s) => s.moveSlide)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id)
      const newIndex = slides.findIndex((s) => s.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) moveSlide(oldIndex, newIndex)
    }
  }

  return (
    <div className="w-52 flex-shrink-0 bg-white border-r border-stone-200/60 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-100">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          页面 ({slides.length})
        </span>
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-y-auto p-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {slides.map((slide, index) => {
                const template = getTemplateById(slide.templateId)
                const label = template?.nameZh ?? slide.templateId

                return (
                  <SlideThumbnail
                    key={slide.id}
                    slide={slide}
                    isActive={slide.id === currentSlideId}
                    index={index}
                    label={label}
                    onSelect={() => setCurrentSlide(slide.id)}
                    onDuplicate={() => duplicateSlide(slide.id)}
                    onDelete={() => {
                      if (slides.length <= 1) return
                      if (!window.confirm('确定要删除这张幻灯片吗？此操作可以撤销（Ctrl+Z）。'))
                        return
                      deleteSlide(slide.id)
                    }}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-stone-100">
        <button
          onClick={() => addSlide('bullets')}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg
                     border border-dashed border-stone-200 text-stone-400 text-xs font-medium
                     hover:border-brand hover:text-brand transition-colors"
        >
          <Plus size={14} />
          添加页面
        </button>
      </div>
    </div>
  )
}
