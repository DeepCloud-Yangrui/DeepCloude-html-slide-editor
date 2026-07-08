// Independent HTML export
import type { Slide, PresentationSettings } from '@/types'
import { toInlineStyleString } from '@/utils/elementStyle'
import { normalizeElementLayout } from '@/utils/elementLayout'

function combinedAttr(el: {
  style?: Record<string, string>
  layout?: Record<string, number>
}): string {
  const layout = normalizeElementLayout(el.layout)
  const styleStr = toInlineStyleString(el.style)
  if (!layout && !styleStr) return ''
  if (!layout) return ` style="${styleStr}"`
  const parts = [
    `position:absolute`,
    `left:${layout.x}px`,
    `top:${layout.y}px`,
    `width:${layout.width}px`,
    `height:${layout.height}px`,
    `z-index:${layout.zIndex}`,
  ]
  if (styleStr) parts.push(styleStr)
  return ` style="${parts.join(';')}"`
}

export function exportProjectToHTML(
  title: string,
  settings: PresentationSettings,
  slides: Slide[],
): void {
  // Stub: will be fully implemented in Step 6
  const html = buildBasicHTML(title, slides)

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const safeTitle = title.replace(/[<>:"/\\|?*]/g, '_').slice(0, 100) || 'slides'
  const date = new Date().toISOString().slice(0, 10)
  const filename = `${safeTitle}_${date}.html`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildBasicHTML(title: string, slides: Slide[]): string {
  const slidesHTML = slides
    .map(
      (slide, i) => `
  <div class="slide" id="slide-${i}" style="display:${i === 0 ? 'flex' : 'none'}">
    ${slide.elements
      .map((el: any) => {
        const c = el.content
        // HTML content: render in sandboxed iframe, no allow-scripts
        if (el.type === 'html-content' && c.html) {
          return `<iframe sandbox="" srcdoc="${escapeHtml(c.html)}" style="width:100%;height:100%;border:none;border-radius:4px;"></iframe>`
        }
        if (el.type === 'html-content' && !c.html) {
          return `<div class="element" style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;">HTML 幻灯片（静态快照）</div>`
        }
        if (c.text)
          return `<div class="text-block"${combinedAttr(el)}><${c.variant === 'heading' ? 'h2' : 'p'}>${escapeHtml(c.text)}</${c.variant === 'heading' ? 'h2' : 'p'}></div>`
        if (c.title && c.description)
          return `<div class="bullet"${combinedAttr(el)}><strong>${escapeHtml(c.title)}</strong><p>${escapeHtml(c.description)}</p></div>`
        if (c.quote)
          return `<blockquote${combinedAttr(el)}>${escapeHtml(c.quote)}<footer>— ${escapeHtml(c.author || '')}</footer></blockquote>`
        // stat-card
        if (c.value && c.label)
          return `<div class="stat-card"${combinedAttr(el)}><div class="stat-value">${escapeHtml(c.value)}</div><div class="stat-label">${escapeHtml(c.label)}</div></div>`
        return `<div class="element"${combinedAttr(el)}>${escapeHtml(JSON.stringify(c))}</div>`
      })
      .join('\n    ')}
    ${slide.content ? `<div class="speaker-notes"><strong>备注：</strong>${escapeHtml(slide.content)}</div>` : ''}
  </div>`,
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, "Microsoft YaHei", "PingFang SC", sans-serif;
    background: #1c1917; color: #1c1917; display: flex;
    align-items: center; justify-content: center; height: 100vh; overflow: hidden;
  }
  #stage { width: 92vw; max-width: 1060px; height: 88vh; max-height: 640px; position: relative; background: #fff; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,.3); }
  .slide {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    padding: 40px 52px 32px; overflow-y: auto; border-radius: 8px;
  }
  .slide h2 { font-size: 28px; margin-bottom: 20px; }
  .slide p { font-size: 17px; line-height: 1.8; color: #444; }
  .bullet { margin-bottom: 12px; }
  .bullet strong { display: block; font-size: 18px; margin-bottom: 4px; }
  .bullet p { font-size: 15px; color: #666; }
  blockquote { font-size: 24px; font-style: italic; margin: auto; text-align: center; }
  blockquote footer { font-size: 16px; font-style: normal; color: #999; margin-top: 12px; }
  .stat-card { background: #fff; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; }
  .stat-value { font-size: 28px; font-weight: 800; color: #1c1917; margin-bottom: 4px; }
  .stat-label { font-size: 14px; color: #78716c; }
  .speaker-notes { display: none; margin-top: auto; padding-top: 10px; border-top: 1px solid #eee; font-size: 13px; color: #999; }
  .speaker-notes.visible { display: block; }
  .progress { position: absolute; top: 0; left: 0; right: 0; display: flex; gap: 2px; padding: 4px; z-index: 10; }
  .progress button { flex: 1; height: 3px; border-radius: 2px; border: none; background: rgba(0,0,0,.08); cursor: pointer; }
  .progress button.filled { background: #6366f1; }
  .counter { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); font-size: 13px; color: #999; }
</style>
</head>
<body>
<div id="stage">
  <div class="progress">${slides.map((_, i) => `<button id="prog-${i}" class="${i === 0 ? 'filled' : ''}" onclick="go(${i})"></button>`).join('')}</div>
  ${slidesHTML}
  <div class="counter" id="counter">1 / ${slides.length}</div>
</div>
<script>
  var total = ${slides.length}, idx = 0, notesVisible = false;
  function show(n) {
    if (n < 0) n = 0; if (n >= total) n = total - 1;
    document.querySelectorAll('.slide').forEach(function(s,i){ s.style.display = i===n ? 'flex' : 'none'; });
    document.querySelectorAll('.progress button').forEach(function(b,i){ b.className = i<=n ? 'filled' : ''; });
    document.getElementById('counter').textContent = (n+1) + ' / ' + total;
    idx = n;
  }
  function go(n) { show(n); }
  document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); show(idx + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show(idx - 1); }
    else if (e.key === 'Home') { e.preventDefault(); show(0); }
    else if (e.key === 'End') { e.preventDefault(); show(total - 1); }
    else if (e.key === 'n' || e.key === 'N') {
      notesVisible = !notesVisible;
      document.querySelectorAll('.speaker-notes').forEach(function(s){ s.classList.toggle('visible', notesVisible); });
    }
    else if (e.key === 'f' || e.key === 'F') {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else { document.getElementById('stage').requestFullscreen(); }
    }
  });
  document.getElementById('stage').addEventListener('click', function(e){
    go(e.clientX < this.getBoundingClientRect().left + this.offsetWidth * 0.3 ? idx - 1 : idx + 1);
  });
</script>
</body>
</html>`
}
