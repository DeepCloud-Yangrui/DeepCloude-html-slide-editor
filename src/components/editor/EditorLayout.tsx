import { useEffect } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import TopBar from './TopBar'
import SlideList from './SlideList'
import Canvas from './Canvas'
import InspectorPanel from './InspectorPanel'

export default function EditorLayout() {
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)

  // Global Ctrl+Z / Ctrl+Shift+Z keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        return
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  return (
    <div className="h-screen flex flex-col bg-stone-50">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <SlideList />
        <Canvas />
        <InspectorPanel />
      </div>
    </div>
  )
}
