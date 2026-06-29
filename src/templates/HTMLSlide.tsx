import { useRef } from 'react'
import type { TemplateComponentProps } from './registry'
import type { HTMLContent } from '@/types'

export default function HTMLSlide({ slide, mode }: TemplateComponentProps) {
  const containerRef = useRef<HTMLIFrameElement>(null)

  const htmlElement = slide.elements.find((e) => e.type === 'html-content')
  const content = htmlElement?.content as HTMLContent | undefined
  const css = content?.css ?? ''
  const html = content?.html ?? '<div class="slide"><p>Empty HTML slide</p></div>'

  // Build a complete mini-document
  const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* Reset for iframe */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    ${css}
    /* Override slide positioning for editor/preview */
    .slide {
      position: relative !important;
      display: flex !important;
      width: 100% !important;
      height: 100% !important;
      inset: auto !important;
      border-radius: 0 !important;
      border: none !important;
      box-shadow: none !important;
      overflow-y: auto !important;
      padding: 32px 44px 28px !important;
    }
    .slide.on { display: flex !important; }
    /* Hide footer bar in editor context (too small) */
    .footer-bar { display: none !important; }
  </style>
</head>
<body>${html}</body>
</html>`

  return (
    <div className="w-full h-full relative overflow-hidden bg-white">
      <iframe
        ref={containerRef}
        srcDoc={fullHTML}
        className="w-full h-full border-none"
        sandbox=""
        title={slide.title || 'HTML Slide'}
        style={{ pointerEvents: mode === 'presentation' ? 'none' : 'auto' }}
      />
    </div>
  )
}
