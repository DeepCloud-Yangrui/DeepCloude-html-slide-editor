import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import type { TextContent, IconBulletContent } from '@/types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as any)[name] ?? LucideIcons.Circle
}

export default function BulletPointsSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const heading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'heading',
  )
  const bullets = slide.elements.filter((e) => e.type === 'icon-bullet')

  function handleChange(elementId: string, field: string, value: string) {
    onElementChange?.(elementId, field, value)
  }

  return (
    <div
      className="w-full h-full flex flex-col justify-center px-16 py-12"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand via-purple-500 to-brand/20" />

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

      <div className="flex flex-col gap-5">
        {bullets.map((bullet, i) => {
          const content = bullet.content as IconBulletContent
          const Icon = getIcon(content.icon)
          return (
            <AnimatedElement key={bullet.id} element={bullet} animated={animated} index={i + 1}>
              <div className="flex items-start gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-subtle transition-colors">
                  <Icon size={20} className="text-brand" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-1">
                    <InlineText
                      value={content.title}
                      onChange={(v) => handleChange(bullet.id, 'title', v)}
                      mode={mode}
                      placeholder="要点标题"
                    />
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    <InlineText
                      value={content.description}
                      onChange={(v) => handleChange(bullet.id, 'description', v)}
                      mode={mode}
                      placeholder="要点描述"
                    />
                  </p>
                </div>
              </div>
            </AnimatedElement>
          )
        })}
      </div>
    </div>
  )
}
