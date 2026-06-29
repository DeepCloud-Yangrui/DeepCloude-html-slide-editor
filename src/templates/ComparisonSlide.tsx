import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import { toInlineStyle } from '@/utils/elementStyle'
import type { TextContent, ComparisonRowContent } from '@/types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as any)[name] ?? LucideIcons.Circle
}

export default function ComparisonSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const heading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'heading',
  )
  const rows = slide.elements.filter((e) => e.type === 'comparison-row')

  function handleChange(elementId: string, field: string, value: string) {
    onElementChange?.(elementId, field, value)
  }

  return (
    <div
      className="w-full h-full flex flex-col justify-center px-16 py-12"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      {heading && (
        <AnimatedElement element={heading} animated={animated} index={0}>
          <h2
            className="text-3xl font-bold text-stone-900 mb-8 text-center"
            style={heading ? toInlineStyle(heading.style) : undefined}
          >
            <InlineText
              value={(heading.content as TextContent).text}
              onChange={(v) => handleChange(heading.id, 'text', v)}
              mode={mode}
              placeholder="输入标题"
            />
          </h2>
        </AnimatedElement>
      )}

      <div className="flex items-stretch gap-0 max-w-2xl mx-auto w-full">
        <div className="flex-1 bg-white rounded-2xl rounded-r-none border border-stone-100 p-6">
          <div className="text-center mb-4 pb-3 border-b border-stone-100">
            <div className="text-xs font-semibold text-brand uppercase tracking-wider mb-1">
              方案 A
            </div>
            <div className="text-sm text-stone-500">当前方案</div>
          </div>
          {rows.map((row, _i) => {
            const content = row.content as ComparisonRowContent
            const LeftIcon = getIcon(content.leftIcon || 'Check')
            return (
              <div
                key={row.id}
                className="flex items-center gap-3 py-2.5 border-b border-stone-50 last:border-0"
              >
                <LeftIcon size={16} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-stone-900">
                    <InlineText
                      value={content.leftValue}
                      onChange={(v) => handleChange(row.id, 'leftValue', v)}
                      mode={mode}
                      placeholder="左侧值"
                    />
                  </div>
                  {content.leftDetail && (
                    <div className="text-xs text-stone-400">
                      <InlineText
                        value={content.leftDetail}
                        onChange={(v) => handleChange(row.id, 'leftDetail', v)}
                        mode={mode}
                        placeholder="详情"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col items-center justify-center px-3 bg-stone-50 rounded-xl relative z-10 -mx-1 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
            VS
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl rounded-l-none border border-stone-100 p-6">
          <div className="text-center mb-4 pb-3 border-b border-stone-100">
            <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              方案 B
            </div>
            <div className="text-sm text-stone-500">对比方案</div>
          </div>
          {rows.map((row, _i) => {
            const content = row.content as ComparisonRowContent
            const RightIcon = getIcon(content.rightIcon || 'X')
            return (
              <div
                key={row.id}
                className="flex items-center gap-3 py-2.5 border-b border-stone-50 last:border-0"
              >
                <RightIcon size={16} className="text-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-stone-900">
                    <InlineText
                      value={content.rightValue}
                      onChange={(v) => handleChange(row.id, 'rightValue', v)}
                      mode={mode}
                      placeholder="右侧值"
                    />
                  </div>
                  {content.rightDetail && (
                    <div className="text-xs text-stone-400">
                      <InlineText
                        value={content.rightDetail}
                        onChange={(v) => handleChange(row.id, 'rightDetail', v)}
                        mode={mode}
                        placeholder="详情"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
