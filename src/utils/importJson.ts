import { getTemplateById } from '@/data/templates'
import { normalizeElementStyle } from '@/utils/elementStyle'

// Known element types from the type system
const KNOWN_ELEMENT_TYPES = [
  'text',
  'image',
  'stat-card',
  'timeline-node',
  'comparison-row',
  'quote-block',
  'icon-bullet',
  'html-content',
  'callout',
  'tag-row',
  'gloss',
  'footer-bar',
]

interface ValidationResult {
  ok: true
  data: {
    schemaVersion: string
    project: {
      title: string
      settings: any
      slides: any[]
    }
  }
}

interface ValidationError {
  ok: false
  error: string
}

export function validateAndParseProject(raw: unknown): ValidationResult | ValidationError {
  // 1. Top-level type check
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'JSON 数据格式不正确：期望一个对象' }
  }

  // Use any to avoid TS narrowing issues with discriminant unions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root: any = raw

  // 2. Anti-prototype-pollution check
  if ('__proto__' in root || 'constructor' in root || 'prototype' in root) {
    return { ok: false, error: 'JSON 数据包含不安全字段' }
  }

  // 3. schemaVersion
  if (!root.schemaVersion || typeof root.schemaVersion !== 'string') {
    return { ok: false, error: '缺少 schemaVersion 字段' }
  }
  if (!root.schemaVersion.startsWith('0.5.')) {
    return { ok: false, error: `不支持的 schema 版本：${root.schemaVersion}，仅支持 0.5.x` }
  }

  // 4. project object
  if (!root.project || typeof root.project !== 'object' || Array.isArray(root.project)) {
    return { ok: false, error: '缺少 project 字段或格式不正确' }
  }

  const project = root.project

  // 5. title
  if (typeof project.title !== 'string') {
    project.title = '导入的幻灯片' // fallback
  }

  // 6. slides array
  if (!Array.isArray(project.slides)) {
    return { ok: false, error: 'slides 字段必须是数组' }
  }
  if (project.slides.length === 0) {
    // Allow empty — user can add slides later
    console.warn('Imported project has no slides')
  }

  // 7. Validate each slide
  for (let i = 0; i < project.slides.length; i++) {
    const slide = project.slides[i]
    if (!slide || typeof slide !== 'object') {
      return { ok: false, error: `第 ${i + 1} 张幻灯片格式不正确` }
    }
    if (typeof slide.id !== 'string') {
      return { ok: false, error: `第 ${i + 1} 张幻灯片缺少 id` }
    }
    if (typeof slide.templateId !== 'string') {
      return { ok: false, error: `第 ${i + 1} 张幻灯片缺少 templateId` }
    }
    // Validate templateId exists or fallback to 'title'
    if (!getTemplateById(slide.templateId)) {
      slide.templateId = 'title'
    }
    if (!Array.isArray(slide.elements)) {
      return { ok: false, error: `第 ${i + 1} 张幻灯片缺少 elements 数组` }
    }
    // Allow empty elements — user can add elements later

    // 8. Validate each element; skip unknown types instead of failing
    const validElements: any[] = []
    for (let j = 0; j < slide.elements.length; j++) {
      const el = slide.elements[j]
      if (!el || typeof el !== 'object') {
        console.warn(`Skipping invalid element at slide ${i + 1}, position ${j + 1}`)
        continue
      }
      if (typeof el.id !== 'string' || typeof el.type !== 'string') {
        console.warn(`Skipping element without id/type at slide ${i + 1}, position ${j + 1}`)
        continue
      }
      if (!KNOWN_ELEMENT_TYPES.includes(el.type)) {
        console.warn(
          `Skipping unknown element type "${el.type}" at slide ${i + 1}, position ${j + 1}`,
        )
        continue
      }
      if (!el.content || typeof el.content !== 'object') {
        el.content = {}
      }
      // Normalize style on import — discard unknown keys and invalid values
      el.style = normalizeElementStyle(el.style)
      validElements.push(el)
    }
    slide.elements = validElements

    // 9. Fill missing slide fields with defaults
    if (typeof slide.duration !== 'number') slide.duration = 0
    if (typeof slide.backgroundColor !== 'string') slide.backgroundColor = '#FAFAF9'
    if (!slide.backgroundImage && slide.backgroundImage !== null) slide.backgroundImage = null
    if (typeof slide.transitionType !== 'string') slide.transitionType = 'fade'
    if (typeof slide.animationPreset !== 'string') slide.animationPreset = 'gentle'
    if (typeof slide.title !== 'string') slide.title = ''
    if (typeof slide.subtitle !== 'string') slide.subtitle = ''
    if (typeof slide.content !== 'string') slide.content = ''
    if (typeof slide.order !== 'number') slide.order = i
  }

  return { ok: true, data: root as ValidationResult['data'] }
}
