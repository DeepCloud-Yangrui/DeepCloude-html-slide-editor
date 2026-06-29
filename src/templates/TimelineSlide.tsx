import { motion } from 'framer-motion'
import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import { toInlineStyle } from '@/utils/elementStyle'
import type { TextContent, TimelineNodeContent } from '@/types'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function getIcon(name: string): LucideIcon {
  return (LucideIcons as any)[name] ?? LucideIcons.Circle
}

export default function TimelineSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const heading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'heading',
  )
  const nodes = slide.elements.filter((e) => e.type === 'timeline-node')

  function handleChange(elementId: string, field: string, value: string) {
    onElementChange?.(elementId, field, value)
  }

  return (
    <div
      className="w-full h-full flex flex-col justify-center px-16 py-12 relative"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      {heading && (
        <AnimatedElement element={heading} animated={animated} index={0}>
          <h2
            className="text-3xl font-bold text-stone-900 mb-10"
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

      <div className="relative pl-10">
        <motion.div
          className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-stone-200 rounded-full origin-top"
          initial={animated ? { scaleY: 0 } : undefined}
          animate={animated ? { scaleY: 1 } : undefined}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <div className="flex flex-col gap-8">
          {nodes.map((node, i) => {
            const content = node.content as TimelineNodeContent
            const Icon = getIcon(content.icon)
            return (
              <AnimatedElement key={node.id} element={node} animated={animated} index={i + 1}>
                <div className="flex items-start gap-5 relative">
                  <motion.div
                    className="absolute left-[-33px] top-1.5 w-4 h-4 rounded-full bg-brand border-4 border-white shadow-sm z-10"
                    initial={animated ? { scale: 0 } : undefined}
                    animate={animated ? { scale: 1 } : undefined}
                    transition={{
                      delay: 0.5 + i * 0.15,
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Icon size={16} className="text-brand" />
                      <span className="text-sm font-semibold text-brand">
                        <InlineText
                          value={content.date}
                          onChange={(v) => handleChange(node.id, 'date', v)}
                          mode={mode}
                          placeholder="日期"
                        />
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-900 mb-1">
                      <InlineText
                        value={content.title}
                        onChange={(v) => handleChange(node.id, 'title', v)}
                        mode={mode}
                        placeholder="事件标题"
                      />
                    </h3>
                    <p className="text-sm text-stone-500">
                      <InlineText
                        value={content.description}
                        onChange={(v) => handleChange(node.id, 'description', v)}
                        mode={mode}
                        placeholder="事件描述"
                      />
                    </p>
                  </div>
                </div>
              </AnimatedElement>
            )
          })}
        </div>
      </div>
    </div>
  )
}
