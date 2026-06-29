import { useRef } from 'react'
import {
  Play,
  Undo2,
  Redo2,
  PanelRightOpen,
  PanelRightClose,
  Download,
  FileDown,
  FileJson,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '@/store/useEditorStore'
import { exportProjectToJSON } from '@/utils/exportJson'
import { generateId } from '@/utils/id'
import IconButton from '@/components/shared/IconButton'
import Button from '@/components/shared/Button'

export default function Toolbar() {
  const navigate = useNavigate()
  const title = useEditorStore((s) => s.title)
  const setTitle = useEditorStore((s) => s.setTitle)
  const presentationId = useEditorStore((s) => s.presentationId)
  const showPropertiesPanel = useEditorStore((s) => s.showPropertiesPanel)
  const togglePropertiesPanel = useEditorStore((s) => s.togglePropertiesPanel)
  const canUndo = useEditorStore((s) => s._undoStack.length > 0)
  const canRedo = useEditorStore((s) => s._redoStack.length > 0)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const jsonInputRef = useRef<HTMLInputElement>(null)

  const handlePresent = () => {
    if (presentationId) {
      navigate(`/present/${presentationId}`)
    }
  }

  const handleExportJSON = () => {
    const state = useEditorStore.getState()
    exportProjectToJSON(state.title, state.settings, state.slides)
  }

  const handleExportHTML = () => {
    // HTML export — will be wired in Step 6
    import('@/utils/exportHtml').then(({ exportProjectToHTML }) => {
      const state = useEditorStore.getState()
      exportProjectToHTML(state.title, state.settings, state.slides)
    })
  }

  const handleOpenJSON = () => {
    jsonInputRef.current?.click()
  }

  const handleJSONFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Auto-backup current project before importing
      const currentState = useEditorStore.getState()
      if (currentState.slides.length > 0) {
        try {
          exportProjectToJSON(currentState.title, currentState.settings, currentState.slides)
        } catch {
          // Backup failure should not block import
        }
      }

      const text = await file.text()
      const data = JSON.parse(text)
      const { validateAndParseProject } = await import('@/utils/importJson')
      const result = validateAndParseProject(data)

      if (!result.ok) {
        alert('导入失败：' + result.error)
        return
      }

      const id = generateId()
      const store = useEditorStore.getState()
      store.setPresentation(id, result.data.project.title)
      if (store.importSlidesFromJSON) {
        store.importSlidesFromJSON(result.data.project)
      }
      navigate(`/editor/${id}`)
    } catch (err) {
      console.error('Failed to import JSON:', err)
      alert('导入失败，请检查文件是否为有效的 JSON 格式')
    }

    if (jsonInputRef.current) {
      jsonInputRef.current.value = ''
    }
  }

  return (
    <div className="h-14 glass-panel border-b border-stone-200/60 flex items-center justify-between px-4 flex-shrink-0">
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-base font-semibold text-stone-900 bg-transparent border-none outline-none
                     focus:bg-stone-50 rounded-lg px-2 py-1 w-56 transition-colors placeholder:text-stone-400"
          placeholder="未命名幻灯片"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <IconButton tooltip="撤销 (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
          <Undo2 size={18} />
        </IconButton>
        <IconButton tooltip="重做 (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}>
          <Redo2 size={18} />
        </IconButton>

        <div className="w-px h-6 bg-stone-200 mx-1" />

        <IconButton
          tooltip={showPropertiesPanel ? '隐藏属性面板' : '显示属性面板'}
          onClick={togglePropertiesPanel}
        >
          {showPropertiesPanel ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </IconButton>

        <div className="w-px h-6 bg-stone-200 mx-1" />

        <IconButton tooltip="导出 JSON" onClick={handleExportJSON}>
          <Download size={18} />
        </IconButton>

        <IconButton tooltip="导出 HTML" onClick={handleExportHTML}>
          <FileDown size={18} />
        </IconButton>

        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleJSONFileChange}
        />
        <IconButton tooltip="打开 JSON" onClick={handleOpenJSON}>
          <FileJson size={18} />
        </IconButton>

        <Button variant="primary" size="md" onClick={handlePresent} className="gap-2">
          <Play size={16} />
          演示
        </Button>
      </div>
    </div>
  )
}
