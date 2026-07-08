import { memo } from 'react'
import { Copy, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Slide } from '@/types'
import { getTemplateById } from '@/data/templates'

interface SlideThumbnailProps {
  slide: Slide
  isActive: boolean
  index: number
  label?: string
  onSelect: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function SlideThumbnail({
  slide,
  isActive,
  index,
  label,
  onSelect,
  onDuplicate,
  onDelete,
}: SlideThumbnailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const template = getTemplateById(slide.templateId)
  const tag = label ?? template?.nameZh ?? slide.templateId
  const titlePreview = slide.title || ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
        ${isActive ? 'bg-brand-light/40 ring-1 ring-brand/30' : 'hover:bg-stone-50'}`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2.5 p-2.5">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0
                     text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={12} />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Page number + template tag */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-semibold text-stone-400 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
              {tag}
            </span>
          </div>
          {/* Title preview */}
          {titlePreview && (
            <div className="text-[11px] text-stone-600 truncate leading-tight">{titlePreview}</div>
          )}
        </div>

        {/* Hover actions */}
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-stone-400
                       hover:text-brand hover:bg-white/60 transition-colors"
          >
            <Copy size={10} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="w-5 h-5 flex items-center justify-center rounded text-stone-400
                       hover:text-red-500 hover:bg-white/60 transition-colors"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SlideThumbnail)
