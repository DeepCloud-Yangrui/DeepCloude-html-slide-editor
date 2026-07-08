import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEditorStore, useCurrentSlide } from '@/store/useEditorStore'
import { getTemplateById } from '@/data/templates'
import PropertiesPanel from './PropertiesPanel'
import type { SlideElement } from '@/types'

export default function ContentPanel() {
  const currentSlide = useCurrentSlide()
  const updateElementContent = useEditorStore((s) => s.updateElementContent)
  const updateSlideField = useEditorStore((s) => s.updateSlideField)
  const [showAdvanced, setShowAdvanced] = useState(false)

  if (!currentSlide) {
    return <div className="p-6 text-center text-sm text-stone-400">请先创建或选择一张页面</div>
  }

  const template = getTemplateById(currentSlide.templateId)

  function handleContent(elementId: string, field: string, value: string) {
    updateElementContent(currentSlide!.id, elementId, { [field]: value })
  }

  return (
    <div className="p-4 space-y-4">
      {/* Page overview */}
      <div>
        <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
          {template?.nameZh ?? currentSlide.templateId}
        </div>
        <div className="text-sm font-semibold text-stone-800 truncate">
          {currentSlide.title || '无标题'}
        </div>
        {currentSlide.content && (
          <div className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-tight">
            备注：{currentSlide.content}
          </div>
        )}
      </div>

      <hr className="border-stone-100" />

      {/* Element content fields */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">内容</h4>
        {currentSlide.elements.length === 0 && (
          <p className="text-xs text-stone-400">此页面暂无内容元素</p>
        )}
        {currentSlide.elements.map((el) => (
          <ElementField
            key={el.id}
            element={el}
            onChange={(field, value) => handleContent(el.id, field, value)}
          />
        ))}
      </div>

      {/* Speaker notes */}
      <hr className="border-stone-100" />
      <div>
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
          演讲备注
        </h4>
        <textarea
          value={currentSlide.content || ''}
          onChange={(e) => updateSlideField(currentSlide.id, 'content', e.target.value)}
          placeholder="输入此页的演讲备注..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-700
                     bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                     resize-none transition-colors placeholder:text-stone-300"
        />
      </div>

      {/* Advanced: style and element settings */}
      <hr className="border-stone-100" />
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wider
                   hover:text-stone-700 transition-colors w-full text-left"
      >
        {showAdvanced ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        样式与元素设置
      </button>
      {showAdvanced && (
        <div className="pt-1">
          <PropertiesPanel />
        </div>
      )}
    </div>
  )
}

// Represents a known editable text field on an element
interface EditableField {
  key: string
  label: string
  multiline: boolean
}

// Returns the editable fields for a SlideElement, based on type
function getEditableFields(element: SlideElement): EditableField[] {
  const c = element.content as unknown as Record<string, unknown>
  const fields: EditableField[] = []

  if (typeof c.text === 'string') {
    const variant = c.variant
    if (variant === 'body' || variant === 'caption') {
      fields.push({ key: 'text', label: '正文', multiline: true })
    } else {
      fields.push({ key: 'text', label: '标题文字', multiline: false })
    }
  }
  if (typeof c.title === 'string') {
    // Skip 'title' when it's an icon-bullet (treated as a typed entry)
    fields.push({ key: 'title', label: '标题', multiline: false })
  }
  if (typeof c.description === 'string') {
    fields.push({ key: 'description', label: '描述', multiline: true })
  }
  if (typeof c.quote === 'string') {
    fields.push({ key: 'quote', label: '引用', multiline: true })
  }
  if (typeof c.author === 'string') {
    fields.push({ key: 'author', label: '作者', multiline: false })
  }
  if (typeof c.value === 'string') {
    fields.push({ key: 'value', label: '数值', multiline: false })
  }
  if (typeof c.label === 'string') {
    fields.push({ key: 'label', label: '标签', multiline: false })
  }
  if (typeof c.body === 'string') {
    fields.push({ key: 'body', label: '提示内容', multiline: true })
  }
  if (typeof c.date === 'string') {
    fields.push({ key: 'date', label: '日期', multiline: false })
  }
  if (typeof c.leftValue === 'string') {
    fields.push({ key: 'leftValue', label: '左侧值', multiline: false })
  }
  if (typeof c.rightValue === 'string') {
    fields.push({ key: 'rightValue', label: '右侧值', multiline: false })
  }

  return fields
}

const ELEMENT_TYPE_LABELS: Record<string, string> = {
  text: '文本',
  'icon-bullet': '要点',
  'stat-card': '数据',
  'timeline-node': '时间',
  'comparison-row': '对比',
  'quote-block': '引用',
  callout: '提示',
  'tag-row': '标签',
  gloss: '术语',
  'footer-bar': '底部',
  image: '图片',
  'html-content': 'HTML',
}

function ElementField({
  element,
  onChange,
}: {
  element: SlideElement
  onChange: (field: string, value: string) => void
}) {
  const fields = getEditableFields(element)
  const typeLabel = ELEMENT_TYPE_LABELS[element.type] ?? element.type

  if (fields.length === 0) return null

  return (
    <div className="border border-stone-100 rounded-lg p-3 space-y-2">
      <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
        {typeLabel}
      </div>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-[11px] font-medium text-stone-500 mb-0.5">{f.label}</label>
          {f.multiline ? (
            <textarea
              value={(element.content as unknown as Record<string, unknown>)[f.key] as string}
              onChange={(e) => onChange(f.key, e.target.value)}
              rows={2}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                         resize-none transition-colors"
            />
          ) : (
            <input
              type="text"
              value={(element.content as unknown as Record<string, unknown>)[f.key] as string}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                         transition-colors"
            />
          )}
        </div>
      ))}
    </div>
  )
}
