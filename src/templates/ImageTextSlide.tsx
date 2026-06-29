import { Image as ImageIcon } from 'lucide-react'
import type { TemplateComponentProps } from './registry'
import AnimatedElement from './AnimatedElement'
import InlineText from '@/components/shared/InlineText'
import { toInlineStyle } from '@/utils/elementStyle'
import type { TextContent, ImageContent } from '@/types'

export default function ImageTextSlide({
  slide,
  mode,
  animated = false,
  onElementChange,
}: TemplateComponentProps) {
  const heading = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'heading',
  )
  const body = slide.elements.find(
    (e) => e.type === 'text' && (e.content as TextContent).variant === 'body',
  )
  const image = slide.elements.find((e) => e.type === 'image')
  const imageContent = image?.content as ImageContent | undefined
  const imagePos = imageContent?.position ?? 'left'
  const isImageLeft = imagePos === 'left'

  function handleChange(elementId: string, value: string) {
    onElementChange?.(elementId, 'text', value)
  }

  const textBlock = (
    <div className="flex-1 flex flex-col justify-center px-8">
      {heading && (
        <AnimatedElement element={heading} animated={animated} index={0}>
          <h2
            className="text-3xl font-bold text-stone-900 mb-4"
            style={heading ? toInlineStyle(heading.style) : undefined}
          >
            <InlineText
              value={(heading.content as TextContent).text}
              onChange={(v) => handleChange(heading.id, v)}
              mode={mode}
              placeholder="输入标题"
            />
          </h2>
        </AnimatedElement>
      )}
      {body && (
        <AnimatedElement element={body} animated={animated} index={1}>
          <p
            className="text-stone-500 leading-relaxed"
            style={body ? toInlineStyle(body.style) : undefined}
          >
            <InlineText
              value={(body.content as TextContent).text}
              onChange={(v) => handleChange(body.id, v)}
              mode={mode}
              placeholder="输入正文内容..."
              multiline
            />
          </p>
        </AnimatedElement>
      )}
    </div>
  )

  const imageBlock = (
    <div className="flex-1 relative overflow-hidden">
      {imageContent?.src ? (
        <img src={imageContent.src} alt={imageContent.alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-stone-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-stone-300">
            <ImageIcon size={48} />
            <span className="text-sm">添加图片</span>
          </div>
        </div>
      )}
      {imageContent?.caption && (
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {imageContent.caption}
        </div>
      )}
    </div>
  )

  return (
    <div
      className="w-full h-full flex"
      style={{ backgroundColor: slide.backgroundColor || '#FAFAF9' }}
    >
      {isImageLeft ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  )
}
