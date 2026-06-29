import type { CSSProperties } from 'react'
import type { ElementLayout } from '@/types'
import {
  SLIDE_WIDTH,
  SLIDE_HEIGHT,
  MIN_ELEMENT_WIDTH,
  MIN_ELEMENT_HEIGHT,
  MIN_Z_INDEX,
  MAX_Z_INDEX,
} from '@/types/layout'

export type ResizeHandle =
  'top-left' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left'

export function normalizeElementLayout(input: unknown): ElementLayout | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined

  const raw = input as Record<string, unknown>
  if (
    typeof raw.x !== 'number' ||
    typeof raw.y !== 'number' ||
    typeof raw.width !== 'number' ||
    typeof raw.height !== 'number'
  ) {
    return undefined
  }
  if (!isFinite(raw.x) || !isFinite(raw.y) || !isFinite(raw.width) || !isFinite(raw.height)) {
    return undefined
  }

  let x = Math.max(0, raw.x)
  let y = Math.max(0, raw.y)
  const width = Math.max(MIN_ELEMENT_WIDTH, Math.min(SLIDE_WIDTH, raw.width))
  const height = Math.max(MIN_ELEMENT_HEIGHT, Math.min(SLIDE_HEIGHT, raw.height))

  if (x + width > SLIDE_WIDTH) x = SLIDE_WIDTH - width
  if (y + height > SLIDE_HEIGHT) y = SLIDE_HEIGHT - height

  const zIndex =
    typeof raw.zIndex === 'number' && isFinite(raw.zIndex)
      ? Math.max(MIN_Z_INDEX, Math.min(MAX_Z_INDEX, Math.round(raw.zIndex)))
      : 0

  return { x, y, width, height, zIndex }
}

export function toLayoutStyle(layout: ElementLayout | undefined): CSSProperties {
  const normalized = normalizeElementLayout(layout)
  if (!normalized) return {}
  return {
    position: 'absolute',
    left: `${normalized.x}px`,
    top: `${normalized.y}px`,
    width: `${normalized.width}px`,
    height: `${normalized.height}px`,
    zIndex: normalized.zIndex,
  }
}

export function applyResizeDelta(
  startLayout: ElementLayout,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
): ElementLayout {
  let { x, y, width, height, zIndex } = startLayout

  switch (handle) {
    case 'right':
      width += deltaX
      break
    case 'bottom':
      height += deltaY
      break
    case 'bottom-right':
      width += deltaX
      height += deltaY
      break
    case 'left':
      x += deltaX
      width -= deltaX
      break
    case 'top':
      y += deltaY
      height -= deltaY
      break
    case 'top-left':
      x += deltaX
      y += deltaY
      width -= deltaX
      height -= deltaY
      break
    case 'top-right':
      y += deltaY
      width += deltaX
      height -= deltaY
      break
    case 'bottom-left':
      x += deltaX
      width -= deltaX
      height += deltaY
      break
  }

  width = Math.max(MIN_ELEMENT_WIDTH, Math.min(SLIDE_WIDTH, width))
  height = Math.max(MIN_ELEMENT_HEIGHT, Math.min(SLIDE_HEIGHT, height))
  if (x < 0) x = 0
  if (y < 0) y = 0
  if (x + width > SLIDE_WIDTH) x = SLIDE_WIDTH - width
  if (y + height > SLIDE_HEIGHT) y = SLIDE_HEIGHT - height

  return { x, y, width, height, zIndex }
}
