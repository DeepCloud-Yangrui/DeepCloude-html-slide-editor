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
  const zIndex = startLayout.zIndex
  const left0 = startLayout.x
  const top0 = startLayout.y
  const right0 = startLayout.x + startLayout.width
  const bottom0 = startLayout.y + startLayout.height

  let left = left0
  let right = right0
  let top = top0
  let bottom = bottom0

  switch (handle) {
    case 'right':
      right = Math.max(left0 + MIN_ELEMENT_WIDTH, Math.min(SLIDE_WIDTH, right0 + deltaX))
      break
    case 'bottom':
      bottom = Math.max(top0 + MIN_ELEMENT_HEIGHT, Math.min(SLIDE_HEIGHT, bottom0 + deltaY))
      break
    case 'bottom-right':
      right = Math.max(left0 + MIN_ELEMENT_WIDTH, Math.min(SLIDE_WIDTH, right0 + deltaX))
      bottom = Math.max(top0 + MIN_ELEMENT_HEIGHT, Math.min(SLIDE_HEIGHT, bottom0 + deltaY))
      break
    case 'left':
      left = Math.max(0, Math.min(right0 - MIN_ELEMENT_WIDTH, left0 + deltaX))
      break
    case 'top':
      top = Math.max(0, Math.min(bottom0 - MIN_ELEMENT_HEIGHT, top0 + deltaY))
      break
    case 'top-left':
      left = Math.max(0, Math.min(right0 - MIN_ELEMENT_WIDTH, left0 + deltaX))
      top = Math.max(0, Math.min(bottom0 - MIN_ELEMENT_HEIGHT, top0 + deltaY))
      break
    case 'top-right':
      right = Math.max(left0 + MIN_ELEMENT_WIDTH, Math.min(SLIDE_WIDTH, right0 + deltaX))
      top = Math.max(0, Math.min(bottom0 - MIN_ELEMENT_HEIGHT, top0 + deltaY))
      break
    case 'bottom-left':
      left = Math.max(0, Math.min(right0 - MIN_ELEMENT_WIDTH, left0 + deltaX))
      bottom = Math.max(top0 + MIN_ELEMENT_HEIGHT, Math.min(SLIDE_HEIGHT, bottom0 + deltaY))
      break
  }

  return { x: left, y: top, width: right - left, height: bottom - top, zIndex }
}
