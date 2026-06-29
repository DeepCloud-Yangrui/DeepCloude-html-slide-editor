import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Upload, Sparkles, FileJson, FolderOpen } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { generateId } from '@/utils/id'
import { parseHTMLSlides, readHTMLFile } from '@/utils/htmlImporter'
import { exportProjectToJSON } from '@/utils/exportJson'
import { hasSavedProject, getSavedProjectInfo } from '@/utils/storage'
import Button from '@/components/shared/Button'

export default function HomePage() {
  const navigate = useNavigate()
  const setPresentation = useEditorStore((s) => s.setPresentation)
  const importSlidesFromHTML = useEditorStore((s) => s.importSlidesFromHTML)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const savedProject = getSavedProjectInfo()

  function handleCreateNew() {
    const id = generateId()
    setPresentation(id, '未命名幻灯片')
    navigate(`/editor/${id}`)
  }

  function handleContinueEditing() {
    const id = useEditorStore.getState().presentationId
    if (id) {
      navigate(`/editor/${id}`)
    }
  }

  function handleImportHTML() {
    fileInputRef.current?.click()
  }

  function handleImportJSON() {
    jsonInputRef.current?.click()
  }

  async function handleHTMLFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const htmlString = await readHTMLFile(file)
      const importedSlides = parseHTMLSlides(htmlString)
      if (importedSlides.length === 0) {
        alert('未找到幻灯片（需要 .slide 或 [data-i] 元素）')
        return
      }

      const id = generateId()
      setPresentation(id, file.name.replace(/\.html?$/i, ''))
      importSlidesFromHTML(importedSlides)
      navigate(`/editor/${id}`)
    } catch (err) {
      console.error('Failed to import HTML:', err)
      alert('导入失败，请检查文件格式')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleJSONFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      setPresentation(id, result.data.project.title)
      const store = useEditorStore.getState()
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
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 glass-panel border-b border-stone-200/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-purple-500 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-stone-900">HTML Slide Editor</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h1 className="text-display-sm text-stone-900 mb-4">HTML 幻灯片编辑器</h1>
          <p className="text-xl text-stone-500 mb-10 max-w-md mx-auto">
            用 Web 原生方式创建、编辑、演示精美幻灯片
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateNew}
              className="gap-2 text-base px-8"
            >
              <Plus size={20} />
              新建 HTML Slide
            </Button>

            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleJSONFileChange}
            />
            <Button
              variant="secondary"
              size="lg"
              onClick={handleImportJSON}
              className="gap-2 text-base px-8"
            >
              <FileJson size={20} />
              导入 JSON 项目
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              className="hidden"
              onChange={handleHTMLFileChange}
            />
            <Button
              variant="secondary"
              size="lg"
              onClick={handleImportHTML}
              className="gap-2 text-base px-8"
            >
              <Upload size={20} />
              导入 HTML 幻灯片
            </Button>
          </div>
        </motion.div>

        {/* Continue editing */}
        {hasSavedProject() && savedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-10"
          >
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider text-center mb-3">
              继续编辑
            </p>
            <button
              onClick={handleContinueEditing}
              className="flex items-center gap-4 px-6 py-4 bg-white rounded-xl border border-stone-200
                         hover:border-brand hover:shadow-elevated transition-all duration-200 text-left
                         min-w-[320px]"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                <FolderOpen size={20} className="text-brand" />
              </div>
              <div>
                <div className="text-sm font-semibold text-stone-900">{savedProject.title}</div>
                <div className="text-xs text-stone-400 mt-0.5">
                  {savedProject.slideCount} 张幻灯片
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Feature hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-2xl"
        >
          {[
            { icon: '🎨', title: '10种精美模板', desc: '从标题页到HTML导入，覆盖各种场景' },
            { icon: '✨', title: '高级动画效果', desc: '弹性弹簧、错位入场、3D翻转等高级动画' },
            { icon: '📝', title: '演讲备注', desc: '每页独立备注，演示时按 N 键随时查看' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="text-center p-4"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <div className="text-sm font-semibold text-stone-900 mb-1">{feature.title}</div>
              <div className="text-xs text-stone-400">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-center text-xs text-stone-400">
        HTML Slide Editor · 让每一页都充满设计感
      </footer>
    </div>
  )
}
