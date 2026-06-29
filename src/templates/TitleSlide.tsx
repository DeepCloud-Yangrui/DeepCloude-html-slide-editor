import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import type { TextContent } from '@/types'

export default function TitleSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const bgColor = slide.backgroundColor || '#FAFAF9'
  const heading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'heading',
  )
  const subheading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'subheading',
  )
  const caption = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'caption',
  )

  function handleChange(elementId: string, value: string) {
    onElementChange?.(elementId, 'text', value)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, #6366F1 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #8B5CF6 0%, transparent 60%)',
        }}
      />
      <div className="absolute top-12 right-16 w-32 h-32 rounded-full border border-brand/10" />
      <div className="absolute bottom-16 left-12 w-24 h-24 rounded-full bg-brand/5" />

      <div className="relative z-10 flex flex-col items-center gap-4 max-w-2xl px-8">
        {heading && (
          <AnimatedElement element={heading} animated={animated} index={0}>
            <h1 className="text-5xl font-extrabold text-stone-900 text-center leading-tight tracking-tight">
              <InlineText
                value={(heading.content as TextContent).text}
                onChange={(v) => handleChange(heading.id, v)}
                mode={mode}
                placeholder="输入标题"
              />
            </h1>
          </AnimatedElement>
        )}

        {subheading && (
          <AnimatedElement element={subheading} animated={animated} index={1}>
            <p className="text-xl text-stone-500 text-center font-normal max-w-lg">
              <InlineText
                value={(subheading.content as TextContent).text}
                onChange={(v) => handleChange(subheading.id, v)}
                mode={mode}
                placeholder="输入副标题"
              />
            </p>
          </AnimatedElement>
        )}

        {caption && (
          <AnimatedElement element={caption} animated={animated} index={2}>
            <p className="text-sm text-stone-400 text-center mt-4">
              <InlineText
                value={(caption.content as TextContent).text}
                onChange={(v) => handleChange(caption.id, v)}
                mode={mode}
                placeholder="输入作者/日期"
              />
            </p>
          </AnimatedElement>
        )}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-brand/30 rounded-full" />
    </div>
  )
}
