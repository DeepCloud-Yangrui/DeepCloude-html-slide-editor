import { Play, Undo2, Redo2, PanelRightOpen, PanelRightClose } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '@/store/useEditorStore'
import IconButton from '@/components/shared/IconButton'
import Button from '@/components/shared/Button'

interface ToolbarProps {
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export default function Toolbar({ onUndo, onRedo, canUndo, canRedo }: ToolbarProps) {
  const navigate = useNavigate()
  const title = useEditorStore((s) => s.title)
  const setTitle = useEditorStore((s) => s.setTitle)
  const presentationId = useEditorStore((s) => s.presentationId)
  const showPropertiesPanel = useEditorStore((s) => s.showPropertiesPanel)
  const togglePropertiesPanel = useEditorStore((s) => s.togglePropertiesPanel)

  const handlePresent = () => {
    if (presentationId) {
      navigate(`/present/${presentationId}`)
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
          placeholder="未命名演示文稿"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <IconButton
          tooltip="撤销"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 size={18} />
        </IconButton>
        <IconButton
          tooltip="重做"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 size={18} />
        </IconButton>

        <div className="w-px h-6 bg-stone-200 mx-1" />

        <IconButton
          tooltip={showPropertiesPanel ? '隐藏属性面板' : '显示属性面板'}
          onClick={togglePropertiesPanel}
        >
          {showPropertiesPanel ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </IconButton>

        <Button
          variant="primary"
          size="md"
          onClick={handlePresent}
          className="gap-2"
        >
          <Play size={16} />
          演示
        </Button>
      </div>
    </div>
  )
}
