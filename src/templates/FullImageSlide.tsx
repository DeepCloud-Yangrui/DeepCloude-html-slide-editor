import { motion } from 'framer-motion'
import { Image as ImageIcon } from 'lucide-react'
import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import { kenBurns } from '@/animations/variants'
import type { TextContent, ImageContent } from '@/types'

export default function FullImageSlide({ slide, mode, animated = false, onElementChange }: TemplateComponentProps) {
  const image = slide.elements.find((e) => e.type === 'image')
  const imageContent = image?.content as ImageContent | undefined
  const heading = slide.elements.find((e) => e.type === 'text' && (e.content as TextContent).variant === 'heading')
  const subheading = slide.elements.find((e) => e.type === 'text' && (e.content as TextContent).variant === 'subheading')

  function handleChange(elementId: string, value: string) {
    onElementChange?.(elementId, 'text', value)
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-900">
      {imageContent?.src ? (
        <motion.img
          src={imageContent.src}
          alt={imageContent.alt}
          className="absolute inset-0 w-full h-full object-cover"
          variants={animated ? kenBurns : undefined}
          initial={animated ? 'hidden' : undefined}
          animate={animated ? 'visible' : undefined}
        />
      ) : (
        <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-stone-600">
            <ImageIcon size={64} />
            <span className="text-sm">添加背景图片</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-8">
        {heading && (
          <AnimatedElement element={heading} animated={animated} index={0}>
            <h2 className="text-4xl font-extrabold text-white text-center leading-tight mb-3 drop-shadow-lg">
              <InlineText
                value={(heading.content as TextContent).text}
                onChange={(v) => handleChange(heading.id, v)}
                mode={mode}
                placeholder="输入标题"
              />
            </h2>
          </AnimatedElement>
        )}
        {subheading && (
          <AnimatedElement element={subheading} animated={animated} index={1}>
            <p className="text-lg text-stone-200 text-center max-w-lg drop-shadow">
              <InlineText
                value={(subheading.content as TextContent).text}
                onChange={(v) => handleChange(subheading.id, v)}
                mode={mode}
                placeholder="输入副标题"
              />
            </p>
          </AnimatedElement>
        )}
      </div>
    </div>
  )
}
