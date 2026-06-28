import { memo } from 'react'
import { Copy, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Slide } from '@/types'
import { getTemplateById } from '@/data/templates'
import TemplateRenderer from '@/templates/TemplateRenderer'

interface SlideThumbnailProps {
  slide: Slide
  isActive: boolean
  index: number
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function SlideThumbnail({ slide, isActive, index, onSelect, onDuplicate, onDelete }: SlideThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const template = getTemplateById(slide.templateId)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer
        ${isActive
          ? 'ring-2 ring-brand ring-offset-2'
          : 'hover:ring-1 hover:ring-stone-300'
        }`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 w-5 h-5 flex items-center justify-center
                   text-stone-400 hover:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity
                   cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={12} />
      </button>

      {/* Slide number */}
      <div className="absolute top-1 right-1 z-10 bg-white/90 text-stone-500 text-[10px] font-medium
                      px-1.5 py-0.5 rounded-md border border-stone-200/60">
        {index + 1}
      </div>

      {/* Mini slide preview */}
      <div className="aspect-[16/9] bg-white overflow-hidden scale-[0.5] origin-top-left w-[200%] h-[200%] pointer-events-none">
        <TemplateRenderer slide={slide} mode="editor" animated={false} />
      </div>

      {/* Template name badge */}
      <div className="absolute bottom-1 left-1 text-[10px] text-stone-400 bg-white/80 px-1 rounded">
        {template?.nameZh ?? slide.templateId}
      </div>

      {/* Hover actions */}
      <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate() }}
          className="w-5 h-5 flex items-center justify-center rounded bg-white/90 text-stone-500
                     hover:text-brand hover:bg-white transition-colors"
        >
          <Copy size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="w-5 h-5 flex items-center justify-center rounded bg-white/90 text-stone-500
                     hover:text-red-500 hover:bg-white transition-colors"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  )
}

export default memo(SlideThumbnail)
