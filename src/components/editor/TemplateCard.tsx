import { memo } from 'react'
import type { Template } from '@/types'

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: () => void
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 text-left
        ${
          isSelected
            ? 'ring-2 ring-brand ring-offset-2'
            : 'hover:ring-1 hover:ring-stone-300 hover:shadow-elevated'
        }`}
    >
      {/* Preview area with gradient */}
      <div
        className="aspect-[16/9] flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${template.previewColors[0]}, ${template.previewColors[1]})`,
        }}
      >
        <span className="text-white/80 text-lg font-semibold">{template.nameZh}</span>
      </div>

      {/* Info */}
      <div className="p-3 bg-white border-t border-stone-100">
        <div className="text-sm font-semibold text-stone-900">{template.nameZh}</div>
        <div className="text-xs text-stone-500 mt-0.5">{template.descriptionZh}</div>
      </div>
    </button>
  )
}

export default memo(TemplateCard)
