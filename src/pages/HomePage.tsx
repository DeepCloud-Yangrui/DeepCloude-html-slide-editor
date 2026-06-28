import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Upload, Sparkles } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { generateId } from '@/utils/id'
import { parseHTMLSlides, readHTMLFile } from '@/utils/htmlImporter'
import Button from '@/components/shared/Button'

export default function HomePage() {
  const navigate = useNavigate()
  const setPresentation = useEditorStore((s) => s.setPresentation)
  const importSlidesFromHTML = useEditorStore((s) => s.importSlidesFromHTML)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleCreateNew() {
    const id = generateId()
    setPresentation(id, '未命名演示文稿')
    navigate(`/editor/${id}`)
  }

  async function handleImport() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
          <span className="text-lg font-bold text-stone-900">口播演示</span>
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
          <h1 className="text-display-sm text-stone-900 mb-4">
            口播视频演示
          </h1>
          <p className="text-xl text-stone-500 mb-10 max-w-md mx-auto">
            选择精美模板，输入口播内容，用高级动画效果呈现你的演示文稿
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateNew}
              className="gap-2 text-base px-8"
            >
              <Plus size={20} />
              创建新演示文稿
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="secondary"
              size="lg"
              onClick={handleImport}
              className="gap-2 text-base px-8"
            >
              <Upload size={20} />
              导入 HTML 幻灯片
            </Button>
          </div>
        </motion.div>

        {/* Feature hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-2xl"
        >
          {[
            { icon: '🎨', title: '9种精美模板', desc: '从标题页到HTML导入，覆盖各种场景' },
            { icon: '✨', title: '高级动画效果', desc: '弹性弹簧、错位入场、3D翻转等高级动画' },
            { icon: '📝', title: '口播内容管理', desc: '每页独立口播内容，演示时可随时查看' },
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
        口播视频演示工具 - 让每一页都充满设计感
      </footer>
    </div>
  )
}
