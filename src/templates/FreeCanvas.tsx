import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import { toInlineStyle } from '@/utils/elementStyle'
import { toLayoutStyle } from '@/utils/elementLayout'
import { normalizeElementLayout } from '@/utils/elementLayout'
import { useEditorStore } from '@/store/useEditorStore'
import { useState, useRef, useCallback } from 'react'
import type {
  ElementLayout,
  TextContent,
  StatCardContent,
  CalloutContent,
  IconBulletContent,
  QuoteBlockContent,
} from '@/types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as any)[name] ?? LucideIcons.Circle
}

const SUPPORTED_TYPES = ['text', 'stat-card', 'callout', 'icon-bullet', 'quote-block']

export default function FreeCanvas({
  slide,
  mode,
  animated = false,
  onElementClick,
  onElementChange,
}: TemplateComponentProps) {
  const setSelectedElement = useEditorStore((s) => s.setSelectedElement)
  const updateElementLayout = useEditorStore((s) => s.updateElementLayout)
  const canvasRef = useRef<HTMLDivElement>(null)

  const [dragging, setDragging] = useState<{
    elementId: string
    startX: number
    startY: number
    startLayout: ElementLayout
  } | null>(null)

  function handleChange(elementId: string, field: string, value: string) {
    onElementChange?.(elementId, field, value)
  }

  function handleCanvasClick() {
    setSelectedElement(null)
  }

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, elementId: string, layout: ElementLayout) => {
      if (mode !== 'editor') return
      if (e.button !== 0) return
      e.stopPropagation()
      const el = e.currentTarget as HTMLElement
      el.setPointerCapture(e.pointerId)
      setSelectedElement(elementId)
      setDragging({ elementId, startX: e.clientX, startY: e.clientY, startLayout: layout })
    },
    [setSelectedElement],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (mode !== 'editor') return
      if (!dragging) return
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = 960 / rect.width
      const scaleY = 540 / rect.height
      const deltaX = (e.clientX - dragging.startX) * scaleX
      const deltaY = (e.clientY - dragging.startY) * scaleY
      const nextLayout = {
        ...dragging.startLayout,
        x: dragging.startLayout.x + deltaX,
        y: dragging.startLayout.y + deltaY,
      }
      updateElementLayout(slide.id, dragging.elementId, nextLayout)
    },
    [dragging, slide.id, updateElementLayout],
  )

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      const el = e.currentTarget as HTMLElement
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
      setDragging(null)
    },
    [dragging],
  )

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative overflow-hidden"
      onClick={handleCanvasClick}
      style={{
        width: '960px',
        height: '540px',
        backgroundColor: slide.backgroundColor || '#FAFAF9',
      }}
    >
      {slide.elements
        .filter((el) => SUPPORTED_TYPES.includes(el.type))
        .map((element, i) => {
          const layout = element.layout
          const content = element.content

          function renderContent() {
            switch (element.type) {
              case 'text': {
                const c = content as TextContent
                return (
                  <AnimatedElement element={element} animated={animated} index={i}>
                    <div className="w-full h-full flex items-start">
                      {c.variant === 'heading' ? (
                        <h2
                          className="text-3xl font-bold text-stone-900"
                          style={toInlineStyle(element.style)}
                        >
                          <InlineText
                            value={c.text}
                            onChange={(v) => handleChange(element.id, 'text', v)}
                            mode={mode}
                            placeholder="输入标题"
                          />
                        </h2>
                      ) : (
                        <p
                          className="text-stone-600 leading-relaxed"
                          style={toInlineStyle(element.style)}
                        >
                          <InlineText
                            value={c.text}
                            onChange={(v) => handleChange(element.id, 'text', v)}
                            mode={mode}
                            placeholder="输入正文..."
                            multiline
                          />
                        </p>
                      )}
                    </div>
                  </AnimatedElement>
                )
              }

              case 'stat-card': {
                const c = content as StatCardContent
                const Icon = getIcon(c.icon)
                return (
                  <AnimatedElement element={element} animated={animated} index={i}>
                    <div
                      className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card w-full h-full flex flex-col justify-center"
                      style={toInlineStyle(element.style)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${c.color || '#6366F1'}15` }}
                        >
                          <Icon size={18} style={{ color: c.color || '#6366F1' }} />
                        </div>
                      </div>
                      <div className="text-2xl font-extrabold text-stone-900">
                        <InlineText
                          value={c.value}
                          onChange={(v) => handleChange(element.id, 'value', v)}
                          mode={mode}
                          placeholder="数值"
                        />
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        <InlineText
                          value={c.label}
                          onChange={(v) => handleChange(element.id, 'label', v)}
                          mode={mode}
                          placeholder="标签"
                        />
                      </div>
                    </div>
                  </AnimatedElement>
                )
              }

              case 'callout': {
                const c = content as CalloutContent
                const variants: Record<string, string> = {
                  doing: 'bg-emerald-50 border-l-emerald-500 text-emerald-900',
                  'not-do': 'bg-red-50 border-l-red-500 text-red-900',
                  info: 'bg-blue-50 border-l-blue-500 text-blue-900',
                  warn: 'bg-amber-50 border-l-amber-500 text-amber-900',
                }
                const cls = variants[c.variant] ?? variants.info
                return (
                  <AnimatedElement element={element} animated={animated} index={i}>
                    <div
                      className={`${cls} border-l-4 rounded-lg px-4 py-3 w-full h-full flex flex-col`}
                      style={toInlineStyle(element.style)}
                    >
                      <strong className="block text-sm mb-1">
                        <InlineText
                          value={c.title}
                          onChange={(v) => handleChange(element.id, 'title', v)}
                          mode={mode}
                          placeholder="提示标题"
                        />
                      </strong>
                      <span className="text-sm leading-relaxed">
                        <InlineText
                          value={c.body}
                          onChange={(v) => handleChange(element.id, 'body', v)}
                          mode={mode}
                          placeholder="提示内容..."
                          multiline
                        />
                      </span>
                    </div>
                  </AnimatedElement>
                )
              }

              case 'icon-bullet': {
                const c = content as IconBulletContent
                const Icon = getIcon(c.icon)
                return (
                  <AnimatedElement element={element} animated={animated} index={i}>
                    <div
                      className="flex items-start gap-3 w-full h-full"
                      style={toInlineStyle(element.style)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={16} className="text-brand" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-stone-900 mb-1">
                          <InlineText
                            value={c.title}
                            onChange={(v) => handleChange(element.id, 'title', v)}
                            mode={mode}
                            placeholder="要点标题"
                          />
                        </h3>
                        <p className="text-stone-500 text-sm leading-relaxed">
                          <InlineText
                            value={c.description}
                            onChange={(v) => handleChange(element.id, 'description', v)}
                            mode={mode}
                            placeholder="要点描述"
                          />
                        </p>
                      </div>
                    </div>
                  </AnimatedElement>
                )
              }

              case 'quote-block': {
                const c = content as QuoteBlockContent
                return (
                  <AnimatedElement element={element} animated={animated} index={i}>
                    <div
                      className="w-full h-full flex flex-col items-center justify-center text-center"
                      style={toInlineStyle(element.style)}
                    >
                      <blockquote className="text-xl italic text-stone-800 leading-relaxed">
                        <InlineText
                          value={c.quote}
                          onChange={(v) => handleChange(element.id, 'quote', v)}
                          mode={mode}
                          placeholder="引用内容"
                          multiline
                        />
                      </blockquote>
                      <p className="text-sm text-stone-400 mt-2">
                        <InlineText
                          value={c.author}
                          onChange={(v) => handleChange(element.id, 'author', v)}
                          mode={mode}
                          placeholder="作者"
                        />
                      </p>
                    </div>
                  </AnimatedElement>
                )
              }

              default:
                return null
            }
          }

          const normalizedLayout = normalizeElementLayout(layout)
          if (!normalizedLayout) return null

          return (
            <div
              key={element.id}
              style={{
                ...toLayoutStyle(normalizedLayout),
                overflow: 'hidden',
                cursor: mode === 'editor' ? 'move' : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation()
                onElementClick?.(element.id)
              }}
              onPointerDown={(e) => handlePointerDown(e, element.id, normalizedLayout)}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {renderContent()}
            </div>
          )
        })}
    </div>
  )
}
