import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import { toInlineStyle } from '@/utils/elementStyle'
import type {
  TextContent,
  CalloutContent,
  TagRowContent,
  GlossContent,
  FooterBarContent,
} from '@/types'

const calloutStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  doing: {
    bg: 'bg-emerald-50',
    border: 'border-l-emerald-500',
    text: 'text-emerald-900',
    icon: '✓',
  },
  'not-do': {
    bg: 'bg-red-50',
    border: 'border-l-red-500',
    text: 'text-red-900',
    icon: '✗',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-l-blue-500',
    text: 'text-blue-900',
    icon: 'ℹ',
  },
  warn: {
    bg: 'bg-amber-50',
    border: 'border-l-amber-500',
    text: 'text-amber-900',
    icon: '⚠',
  },
}

export default function ContentSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  function handleChange(elementId: string, field: string, value: string) {
    onElementChange?.(elementId, field, value)
  }

  function handleGlossItemChange(
    elementId: string,
    index: number,
    field: 'term' | 'definition',
    value: string,
  ) {
    const element = slide.elements.find((e) => e.id === elementId)
    if (!element) return
    const content = element.content as GlossContent
    const newItems = [...content.items]
    newItems[index] = { ...newItems[index], [field]: value }
    onElementChange?.(elementId, 'items', JSON.stringify(newItems))
  }

  return (
    <div
      className="w-full h-full flex flex-col justify-start px-14 py-10"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      {slide.elements.map((element, i) => {
        switch (element.type) {
          case 'text': {
            const content = element.content as TextContent
            if (content.variant === 'heading') {
              return (
                <AnimatedElement key={element.id} element={element} animated={animated} index={i}>
                  <h2
                    className="text-3xl font-bold text-stone-900 mb-6"
                    style={toInlineStyle(element.style)}
                  >
                    <InlineText
                      value={content.text}
                      onChange={(v) => handleChange(element.id, 'text', v)}
                      mode={mode}
                      placeholder="输入标题"
                    />
                  </h2>
                </AnimatedElement>
              )
            }
            return (
              <AnimatedElement key={element.id} element={element} animated={animated} index={i}>
                <p
                  className="text-stone-600 leading-relaxed mb-4"
                  style={toInlineStyle(element.style)}
                >
                  <InlineText
                    value={content.text}
                    onChange={(v) => handleChange(element.id, 'text', v)}
                    mode={mode}
                    placeholder="正文..."
                    multiline
                  />
                </p>
              </AnimatedElement>
            )
          }

          case 'tag-row': {
            const content = element.content as TagRowContent
            return (
              <AnimatedElement key={element.id} element={element} animated={animated} index={i}>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {content.tags.map((tag, ti) => (
                    <span
                      key={ti}
                      className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-stone-100 text-stone-500"
                    >
                      {mode === 'editor' ? (
                        <InlineText
                          value={tag}
                          onChange={(v) => {
                            const newTags = [...content.tags]
                            newTags[ti] = v
                            onElementChange?.(element.id, 'tags', JSON.stringify(newTags))
                          }}
                          mode={mode}
                        />
                      ) : (
                        tag
                      )}
                    </span>
                  ))}
                </div>
              </AnimatedElement>
            )
          }

          case 'callout': {
            const content = element.content as CalloutContent
            const style = calloutStyles[content.variant] ?? calloutStyles.info
            return (
              <AnimatedElement key={element.id} element={element} animated={animated} index={i}>
                <div
                  className={`${style.bg} ${style.text} border-l-4 ${style.border} rounded-lg px-4 py-3 mb-4`}
                  style={toInlineStyle(element.style)}
                >
                  <strong className="block text-sm mb-1">
                    <InlineText
                      value={content.title}
                      onChange={(v) => handleChange(element.id, 'title', v)}
                      mode={mode}
                      placeholder="提示标题"
                    />
                  </strong>
                  <span className="text-sm leading-relaxed">
                    <InlineText
                      value={content.body}
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

          case 'gloss': {
            const content = element.content as GlossContent
            return (
              <AnimatedElement key={element.id} element={element} animated={animated} index={i}>
                <div className="mt-auto pt-3 border-t border-stone-200 text-xs text-stone-400 leading-relaxed flex flex-wrap gap-x-4 gap-y-1">
                  {content.items.map((item, gi) => (
                    <span key={gi}>
                      <code className="text-xs bg-stone-100 px-1 py-0.5 rounded text-stone-600">
                        {mode === 'editor' ? (
                          <InlineText
                            value={item.term}
                            onChange={(v) => handleGlossItemChange(element.id, gi, 'term', v)}
                            mode={mode}
                          />
                        ) : (
                          item.term
                        )}
                      </code>
                      {' = '}
                      {mode === 'editor' ? (
                        <InlineText
                          value={item.definition}
                          onChange={(v) => handleGlossItemChange(element.id, gi, 'definition', v)}
                          mode={mode}
                        />
                      ) : (
                        item.definition
                      )}
                    </span>
                  ))}
                </div>
              </AnimatedElement>
            )
          }

          case 'footer-bar': {
            const content = element.content as FooterBarContent
            return (
              <AnimatedElement key={element.id} element={element} animated={animated} index={i}>
                <div className="absolute bottom-4 left-14 right-14 flex items-center gap-3">
                  <div className="flex-1 h-1 bg-stone-200 rounded-full">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: `${content.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
                    {mode === 'editor' ? (
                      <InlineText
                        value={content.pageLabel}
                        onChange={(v) => handleChange(element.id, 'pageLabel', v)}
                        mode={mode}
                      />
                    ) : (
                      content.pageLabel
                    )}
                  </span>
                </div>
              </AnimatedElement>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
