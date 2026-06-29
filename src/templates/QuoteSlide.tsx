import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import type { QuoteBlockContent } from '@/types'

export default function QuoteSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const quoteElement = slide.elements.find((e) => e.type === 'quote-block')
  const content = quoteElement?.content as QuoteBlockContent | undefined

  if (!content) return null

  const isBold = content.style === 'bold'
  const isMinimal = content.style === 'minimal'

  function handleChange(field: string, value: string) {
    if (quoteElement) onElementChange?.(quoteElement.id, field, value)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'radial-gradient(ellipse at center, #6366F1 0%, transparent 70%)',
        }}
      />

      <svg
        className="absolute top-12 left-12 text-brand/8"
        width="120"
        height="100"
        viewBox="0 0 120 100"
      >
        <text
          x="0"
          y="100"
          style={{ fontFamily: 'Georgia, serif', fontSize: '160px', fill: 'currentColor' }}
        >
          "
        </text>
      </svg>

      <div className="relative z-10 flex flex-col items-center max-w-xl px-8">
        <AnimatedElement element={quoteElement!} animated={animated} index={0}>
          <blockquote
            className={`
              ${
                isBold
                  ? 'text-3xl font-extrabold text-stone-900'
                  : isMinimal
                    ? 'text-2xl font-light text-stone-700'
                    : 'text-2xl italic font-serif text-stone-800'
              }
              text-center leading-relaxed
            `}
          >
            <InlineText
              value={content.quote}
              onChange={(v) => handleChange('quote', v)}
              mode={mode}
              multiline
              placeholder="输入引用内容"
            />
          </blockquote>
        </AnimatedElement>

        <div className="w-12 h-0.5 bg-brand/40 rounded-full my-6" />

        <div className="text-center">
          <p className="text-base font-semibold text-stone-900">
            <InlineText
              value={content.author}
              onChange={(v) => handleChange('author', v)}
              mode={mode}
              placeholder="作者"
            />
          </p>
          {content.role && (
            <p className="text-sm text-stone-400 mt-1">
              <InlineText
                value={content.role}
                onChange={(v) => handleChange('role', v)}
                mode={mode}
                placeholder="职位/出处"
              />
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
