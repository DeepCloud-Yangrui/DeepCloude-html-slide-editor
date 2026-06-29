import type { CSSProperties } from 'react'
import type { ElementStyle } from '@/types'

// ===== 白名单 =====
const ALLOWED_KEYS = [
  'fontSize',
  'fontWeight',
  'color',
  'textAlign',
  'backgroundColor',
  'padding',
  'borderRadius',
] as const

const FONT_SIZE_VALUES = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']
const FONT_WEIGHT_VALUES = ['normal', 'medium', 'semibold', 'bold', 'extrabold']
const TEXT_ALIGN_VALUES = ['left', 'center', 'right', 'justify']
const PADDING_VALUES = ['none', 'sm', 'md', 'lg']
const BORDER_RADIUS_VALUES = ['none', 'sm', 'md', 'lg', 'full']
const COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

// ===== Token → CSS mapping =====
const FONT_SIZE_MAP: Record<string, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '22px',
  '2xl': '28px',
  '3xl': '36px',
  '4xl': '44px',
  '5xl': '56px',
}

const FONT_WEIGHT_MAP: Record<string, string> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}

const PADDING_MAP: Record<string, string> = {
  none: '0',
  sm: '8px',
  md: '16px',
  lg: '24px',
}

const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '999px',
}

// ===== Validation =====

function isValidFieldValue(key: string, value: string): boolean {
  switch (key) {
    case 'fontSize':
      return FONT_SIZE_VALUES.includes(value)
    case 'fontWeight':
      return FONT_WEIGHT_VALUES.includes(value)
    case 'textAlign':
      return TEXT_ALIGN_VALUES.includes(value)
    case 'padding':
      return PADDING_VALUES.includes(value)
    case 'borderRadius':
      return BORDER_RADIUS_VALUES.includes(value)
    case 'color':
    case 'backgroundColor':
      return COLOR_PATTERN.test(value)
    default:
      return false
  }
}

// ===== 1. normalizeElementStyle — 白名单 + 逐字段校验 =====

export function normalizeElementStyle(input: unknown): ElementStyle {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {}
  const raw = input as Record<string, unknown>
  const style: ElementStyle = {}
  for (const key of ALLOWED_KEYS) {
    const val = raw[key]
    if (typeof val === 'string' && isValidFieldValue(key, val)) {
      ;(style as Record<string, string>)[key] = val
    }
  }
  return style
}

// ===== 2. toInlineStyle — React 渲染用 CSSProperties =====

export function toInlineStyle(style: ElementStyle | undefined): CSSProperties {
  const safeStyle = normalizeElementStyle(style)
  const css: CSSProperties = {}
  if (safeStyle.fontSize) css.fontSize = FONT_SIZE_MAP[safeStyle.fontSize] ?? safeStyle.fontSize
  if (safeStyle.fontWeight)
    css.fontWeight = FONT_WEIGHT_MAP[safeStyle.fontWeight] ?? safeStyle.fontWeight
  if (safeStyle.color) css.color = safeStyle.color
  if (safeStyle.textAlign) css.textAlign = safeStyle.textAlign as CSSProperties['textAlign']
  if (safeStyle.backgroundColor) css.backgroundColor = safeStyle.backgroundColor
  if (safeStyle.padding) css.padding = PADDING_MAP[safeStyle.padding] ?? safeStyle.padding
  if (safeStyle.borderRadius)
    css.borderRadius = BORDER_RADIUS_MAP[safeStyle.borderRadius] ?? safeStyle.borderRadius
  return css
}

// ===== 3. toInlineStyleString — HTML 导出用，逐字段硬编码，不遍历 =====

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function toInlineStyleString(style: ElementStyle | undefined): string {
  const safeStyle = normalizeElementStyle(style)
  const parts: string[] = []

  if (safeStyle.fontSize) {
    parts.push(`font-size:${escapeHtml(FONT_SIZE_MAP[safeStyle.fontSize] ?? safeStyle.fontSize)}`)
  }
  if (safeStyle.fontWeight) {
    parts.push(
      `font-weight:${escapeHtml(FONT_WEIGHT_MAP[safeStyle.fontWeight] ?? safeStyle.fontWeight)}`,
    )
  }
  if (safeStyle.color) {
    parts.push(`color:${escapeHtml(safeStyle.color)}`)
  }
  if (safeStyle.textAlign) {
    parts.push(`text-align:${escapeHtml(safeStyle.textAlign)}`)
  }
  if (safeStyle.backgroundColor) {
    parts.push(`background-color:${escapeHtml(safeStyle.backgroundColor)}`)
  }
  if (safeStyle.padding) {
    parts.push(`padding:${escapeHtml(PADDING_MAP[safeStyle.padding] ?? safeStyle.padding)}`)
  }
  if (safeStyle.borderRadius) {
    parts.push(
      `border-radius:${escapeHtml(BORDER_RADIUS_MAP[safeStyle.borderRadius] ?? safeStyle.borderRadius)}`,
    )
  }

  return parts.join(';')
}
