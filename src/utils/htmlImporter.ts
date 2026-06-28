export interface ImportedSlide {
  title: string
  html: string
  css: string
  index: number
}

export function parseHTMLSlides(htmlString: string): ImportedSlide[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  // Extract all <style> tags for the global CSS
  const styleTags = doc.querySelectorAll('style')
  let globalCSS = ''
  styleTags.forEach((tag) => {
    globalCSS += tag.textContent ?? ''
  })

  // Find all slide divs
  const slideDivs = doc.querySelectorAll('.slide')
  if (slideDivs.length === 0) {
    // Try data-i attribute as fallback
    const dataSlides = doc.querySelectorAll('[data-i]')
    if (dataSlides.length > 0) {
      return Array.from(dataSlides).map((el, i) => ({
        title: extractTitle(el as HTMLElement) || `Slide ${i + 1}`,
        html: el.outerHTML,
        css: globalCSS,
        index: i,
      }))
    }
    return []
  }

  return Array.from(slideDivs).map((slide, i) => ({
    title: extractTitle(slide as HTMLElement) || `Slide ${i + 1}`,
    html: slide.outerHTML,
    css: globalCSS,
    index: i,
  }))
}

function extractTitle(el: HTMLElement): string | null {
  // Try h1 first
  const h1 = el.querySelector('h1')
  if (h1?.textContent) return h1.textContent.trim().slice(0, 50)

  // Try h2
  const h2 = el.querySelector('h2')
  if (h2?.textContent) return h2.textContent.trim().slice(0, 50)

  // Try .big or .kicker
  const big = el.querySelector('.big')
  if (big?.textContent) return big.textContent.trim().slice(0, 50)

  const kicker = el.querySelector('.kicker')
  if (kicker?.textContent) return kicker.textContent.trim().slice(0, 50)

  return null
}

export function readHTMLFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export function buildSlideHTML(slideHTML: string, globalCSS: string): string {
  return `
<!DOCTYPE html>
<html>
<head><style>${globalCSS}</style></head>
<body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;width:100%;height:100%;overflow:hidden;">
  ${slideHTML}
</body>
</html>`
}
