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
import SlideThumbnail from './SlideThumbnail'

export default function SlideList() {
  const slides = useEditorStore((s) => s.slides)
  const currentSlideId = useEditorStore((s) => s.currentSlideId)
  const setCurrentSlide = useEditorStore((s) => s.setCurrentSlide)
  const addSlide = useEditorStore((s) => s.addSlide)
  const duplicateSlide = useEditorStore((s) => s.duplicateSlide)
  const deleteSlide = useEditorStore((s) => s.deleteSlide)
  const moveSlide = useEditorStore((s) => s.moveSlide)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id)
      const newIndex = slides.findIndex((s) => s.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        moveSlide(oldIndex, newIndex)
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          幻灯片 ({slides.length})
        </span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {slides.map((slide, index) => (
              <SlideThumbnail
                key={slide.id}
                slide={slide}
                isActive={slide.id === currentSlideId}
                index={index}
                onSelect={() => setCurrentSlide(slide.id)}
                onDuplicate={() => duplicateSlide(slide.id)}
                onDelete={() => {
                  if (slides.length <= 1) return
                  if (!window.confirm('确定要删除这张幻灯片吗？此操作可以撤销（Ctrl+Z）。')) return
                  deleteSlide(slide.id)
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => addSlide('bullets')}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                   border-2 border-dashed border-stone-200 text-stone-400
                   hover:border-brand hover:text-brand transition-colors text-sm font-medium"
      >
        <Plus size={16} />
        添加幻灯片
      </button>
    </div>
  )
}
