import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import type { TextContent, StatCardContent } from '@/types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as any)[name] ?? LucideIcons.BarChart3
}

export default function StatsSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const heading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'heading',
  )
  const statCards = slide.elements.filter((e) => e.type === 'stat-card')

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
          <h2 className="text-3xl font-bold text-stone-900 mb-10">
            <InlineText
              value={(heading.content as TextContent).text}
              onChange={(v) => handleChange(heading.id, 'text', v)}
              mode={mode}
              placeholder="输入标题"
            />
          </h2>
        </AnimatedElement>
      )}

      <div className="grid grid-cols-2 gap-5">
        {statCards.map((card, i) => {
          const content = card.content as StatCardContent
          const Icon = getIcon(content.icon)
          const trendColor =
            content.trend === 'up'
              ? 'text-emerald-500'
              : content.trend === 'down'
                ? 'text-red-500'
                : 'text-stone-400'

          return (
            <AnimatedElement key={card.id} element={card} animated={animated} index={i + 1}>
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card hover:shadow-elevated transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${content.color || '#6366F1'}15` }}
                  >
                    <Icon size={20} style={{ color: content.color || '#6366F1' }} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                    <InlineText
                      value={content.trendValue}
                      onChange={(v) => handleChange(card.id, 'trendValue', v)}
                      mode={mode}
                    />
                    {content.trend === 'up' && <LucideIcons.TrendingUp size={14} />}
                    {content.trend === 'down' && <LucideIcons.TrendingDown size={14} />}
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-stone-900 mb-1">
                  <InlineText
                    value={content.value}
                    onChange={(v) => handleChange(card.id, 'value', v)}
                    mode={mode}
                    placeholder="数值"
                  />
                </div>
                <div className="text-sm text-stone-500">
                  <InlineText
                    value={content.label}
                    onChange={(v) => handleChange(card.id, 'label', v)}
                    mode={mode}
                    placeholder="标签"
                  />
                </div>
              </div>
            </AnimatedElement>
          )
        })}
      </div>
    </div>
  )
}
