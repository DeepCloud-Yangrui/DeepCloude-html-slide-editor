import { useState, useCallback, useRef } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { toLayoutStyle, applyResizeDelta } from '@/utils/elementLayout'
import type { ResizeHandle } from '@/utils/elementLayout'
import type { ElementLayout } from '@/types'

const HANDLE_SIZE = 8

interface HandleDef {
  handle: ResizeHandle
  left?: string
  top?: string
  right?: string
  bottom?: string
  cursor: string
}

const HANDLES: HandleDef[] = [
  {
    handle: 'top-left',
    left: `-${HANDLE_SIZE / 2}px`,
    top: `-${HANDLE_SIZE / 2}px`,
    cursor: 'nwse-resize',
  },
  { handle: 'top', left: '50%', top: `-${HANDLE_SIZE / 2}px`, cursor: 'ns-resize' },
  {
    handle: 'top-right',
    right: `-${HANDLE_SIZE / 2}px`,
    top: `-${HANDLE_SIZE / 2}px`,
    cursor: 'nesw-resize',
  },
  { handle: 'right', right: `-${HANDLE_SIZE / 2}px`, top: '50%', cursor: 'ew-resize' },
  {
    handle: 'bottom-right',
    right: `-${HANDLE_SIZE / 2}px`,
    bottom: `-${HANDLE_SIZE / 2}px`,
    cursor: 'nwse-resize',
  },
  { handle: 'bottom', left: '50%', bottom: `-${HANDLE_SIZE / 2}px`, cursor: 'ns-resize' },
  {
    handle: 'bottom-left',
    left: `-${HANDLE_SIZE / 2}px`,
    bottom: `-${HANDLE_SIZE / 2}px`,
    cursor: 'nesw-resize',
  },
  { handle: 'left', left: `-${HANDLE_SIZE / 2}px`, top: '50%', cursor: 'ew-resize' },
]

interface SelectionOverlayProps {
  canvasRef: React.RefObject<HTMLDivElement>
}

export default function SelectionOverlay({ canvasRef }: SelectionOverlayProps) {
  const selectedElementId = useEditorStore((s) => s.selectedElementId)
  const slides = useEditorStore((s) => s.slides)
  const currentSlideId = useEditorStore((s) => s.currentSlideId)
  const updateElementLayout = useEditorStore((s) => s.updateElementLayout)

  const [resizing, setResizing] = useState<{
    handle: ResizeHandle
    startX: number
    startY: number
    startLayout: ElementLayout
    slideId: string
  } | null>(null)

  if (!selectedElementId || !currentSlideId) return null

  const slideId = currentSlideId
  const currentSlide = slides.find((s) => s.id === slideId)
  if (!currentSlide) return null

  const element = currentSlide.elements.find((e) => e.id === selectedElementId)
  if (!element || !element.layout) return null

  const layout = element.layout

  function handlePointerDown(e: React.PointerEvent, handle: ResizeHandle) {
    e.stopPropagation()
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    setResizing({
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startLayout: { ...layout },
      slideId,
    })
  }

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing) return
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const scaleX = 960 / rect.width
      const scaleY = 540 / rect.height
      const deltaX = (e.clientX - resizing.startX) * scaleX
      const deltaY = (e.clientY - resizing.startY) * scaleY
      const nextLayout = applyResizeDelta(resizing.startLayout, resizing.handle, deltaX, deltaY)
      updateElementLayout(resizing.slideId, selectedElementId, nextLayout)
    },
    [resizing, canvasRef, selectedElementId, updateElementLayout],
  )

  function endResize(e: React.PointerEvent) {
    if (!resizing) return
    const el = e.currentTarget as HTMLElement
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId)
    }
    setResizing(null)
  }

  return (
    <>
      {/* Selection border */}
      <div
        style={{
          ...toLayoutStyle(layout),
          pointerEvents: 'none',
          zIndex: 1000,
          border: '2px solid #6366F1',
          borderRadius: '2px',
          position: 'absolute',
        }}
      />

      {/* Resize handles */}
      {HANDLES.map((h) => (
        <div
          key={h.handle}
          style={{
            position: 'absolute',
            left: h.left,
            top: h.top,
            ...(h.right !== undefined ? { right: h.right } : {}),
            ...(h.bottom !== undefined ? { bottom: h.bottom } : {}),
            width: `${HANDLE_SIZE}px`,
            height: `${HANDLE_SIZE}px`,
            backgroundColor: '#6366F1',
            border: '1.5px solid #fff',
            borderRadius: '1px',
            cursor: h.cursor,
            zIndex: 1001,
          }}
          onPointerDown={(e) => handlePointerDown(e, h.handle)}
          onPointerMove={handlePointerMove}
          onPointerUp={endResize}
          onPointerCancel={endResize}
        />
      ))}
    </>
  )
}
