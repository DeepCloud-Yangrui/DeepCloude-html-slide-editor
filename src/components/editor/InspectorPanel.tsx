import { useState } from 'react'
import { FileText, Grid3X3, Settings, LayoutTemplate } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { TEMPLATES } from '@/data/templates'
import ContentPanel from './ContentPanel'

type Tab = 'content' | 'templates' | 'settings'

const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: 'content', label: '内容', icon: FileText },
  { key: 'templates', label: '模板', icon: Grid3X3 },
  { key: 'settings', label: '设置', icon: Settings },
]

export default function InspectorPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('content')

  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-stone-200/60 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-stone-200/60 flex-shrink-0">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors
                ${
                  activeTab === tab.key
                    ? 'text-brand border-b-2 border-brand'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'content' && <ContentPanel />}
        {activeTab === 'templates' && <TemplatePanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
}

function TemplatePanel() {
  const slides = useEditorStore((s) => s.slides)
  const currentSlideId = useEditorStore((s) => s.currentSlideId)
  const changeSlideTemplate = useEditorStore((s) => s.changeSlideTemplate)
  const currentSlide = slides.find((s) => s.id === currentSlideId)

  if (!currentSlide) {
    return <div className="p-6 text-center text-sm text-stone-400">请先创建或选择一张页面</div>
  }

  return (
    <div className="p-3">
      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 px-1">
        模板
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => {
          const isActive = currentSlide.templateId === t.id
          return (
            <button
              key={t.id}
              onClick={() => changeSlideTemplate(currentSlide.id, t.id)}
              className={`group text-left rounded-xl overflow-hidden border transition-all duration-200
                ${
                  isActive
                    ? 'border-brand ring-1 ring-brand/30'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
                }`}
            >
              {/* Preview gradient */}
              <div
                className="h-14 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${t.previewColors[0]}, ${t.previewColors[1]})`,
                }}
              >
                <LayoutTemplate
                  size={18}
                  className={`${isActive ? 'text-white' : 'text-white/60'}`}
                />
              </div>
              {/* Info */}
              <div className="p-2">
                <div className="text-xs font-semibold text-stone-800 truncate">{t.nameZh}</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5">
                  {t.id.replace('-', ' ')}
                </div>
                <div className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-tight">
                  {t.descriptionZh}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SettingsPanel() {
  const title = useEditorStore((s) => s.title)

  return (
    <div className="p-4 space-y-5">
      <div>
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          演示信息
        </h3>
        <div className="text-sm text-stone-700">标题：{title || '未命名'}</div>
        <div className="text-xs text-stone-400 mt-1">16:9 / 1280×720</div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          快捷键
        </h3>
        <div className="space-y-1.5 text-xs text-stone-500">
          <div>
            <kbd className="px-1 py-0.5 bg-stone-100 rounded text-stone-600">Ctrl+Z</kbd> 撤销
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-stone-100 rounded text-stone-600">Ctrl+Shift+Z</kbd> 重做
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-stone-100 rounded text-stone-600">→</kbd> 演示翻页
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-stone-100 rounded text-stone-600">Esc</kbd> 退出演示
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">导出</h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          使用顶部栏的导出按钮导出 JSON 或独立 HTML 文件。
        </p>
      </div>
    </div>
  )
}
