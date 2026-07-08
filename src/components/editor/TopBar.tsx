import { Play, Undo2, Redo2, Download, FileDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '@/store/useEditorStore'
import { exportProjectToJSON } from '@/utils/exportJson'
import { useCurrentSlide } from '@/store/useEditorStore'
import IconButton from '@/components/shared/IconButton'
import Button from '@/components/shared/Button'

export default function TopBar() {
  const navigate = useNavigate()
  const title = useEditorStore((s) => s.title)
  const setTitle = useEditorStore((s) => s.setTitle)
  const presentationId = useEditorStore((s) => s.presentationId)
  const slides = useEditorStore((s) => s.slides)
  const currentSlide = useCurrentSlide()
  const canUndo = useEditorStore((s) => s._undoStack.length > 0)
  const canRedo = useEditorStore((s) => s._redoStack.length > 0)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const slidesCount = slides.length
  const currentIdx = currentSlide ? slides.findIndex((s) => s.id === currentSlide.id) + 1 : 0

  const handlePresent = () => {
    if (presentationId) navigate(`/present/${presentationId}`)
  }

  const handleExportJSON = () => {
    const state = useEditorStore.getState()
    exportProjectToJSON(state.title, state.settings, state.slides)
  }

  const handleExportHTML = () => {
    import('@/utils/exportHtml').then(({ exportProjectToHTML }) => {
      const state = useEditorStore.getState()
      exportProjectToHTML(state.title, state.settings, state.slides)
    })
  }

  return (
    <div className="h-12 flex items-center justify-between px-5 border-b border-stone-200/60 bg-white flex-shrink-0">
      {/* Left: project title */}
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm font-semibold text-stone-800 bg-transparent border-none outline-none
                     focus:bg-stone-50 rounded-lg px-2 py-1 w-44 transition-colors placeholder:text-stone-400"
          placeholder="未命名幻灯片"
        />
      </div>

      {/* Center: page info */}
      <div className="hidden sm:flex items-center gap-3 text-xs text-stone-400">
        <span>
          Page {currentIdx} / {slidesCount}
        </span>
        <span className="w-px h-3 bg-stone-200" />
        <span>16:9</span>
        <span className="w-px h-3 bg-stone-200" />
        <span>1280×720</span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        <IconButton tooltip="撤销 (Ctrl+Z)" size="sm" onClick={undo} disabled={!canUndo}>
          <Undo2 size={16} />
        </IconButton>
        <IconButton tooltip="重做 (Ctrl+Shift+Z)" size="sm" onClick={redo} disabled={!canRedo}>
          <Redo2 size={16} />
        </IconButton>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        <IconButton tooltip="导出 JSON" size="sm" onClick={handleExportJSON}>
          <Download size={16} />
        </IconButton>
        <IconButton tooltip="导出 HTML" size="sm" onClick={handleExportHTML}>
          <FileDown size={16} />
        </IconButton>

        <Button variant="primary" size="sm" onClick={handlePresent} className="gap-1.5 ml-2">
          <Play size={14} />
          播放
        </Button>
      </div>
    </div>
  )
}
