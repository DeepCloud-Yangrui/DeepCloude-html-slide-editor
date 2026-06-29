import { useEditorStore, useCurrentSlide } from '@/store/useEditorStore'
import { ANIMATION_PRESETS } from '@/data/animationPresets'
import type { TransitionType, SlideElement } from '@/types'

const TRANSITIONS: { value: TransitionType; label: string }[] = [
  { value: 'fade', label: '淡入淡出' },
  { value: 'slide-left', label: '左滑' },
  { value: 'slide-right', label: '右滑' },
  { value: 'slide-up', label: '上滑' },
  { value: 'slide-down', label: '下滑' },
  { value: 'zoom-in', label: '放大进入' },
  { value: 'zoom-out', label: '缩小进入' },
  { value: 'flip-x', label: 'X轴翻转' },
  { value: 'flip-y', label: 'Y轴翻转' },
]

function ElementEditor({ element }: { element: SlideElement }) {
  const currentSlide = useCurrentSlide()
  const updateElementContent = useEditorStore((s) => s.updateElementContent)
  const deleteElement = useEditorStore((s) => s.deleteElement)
  const setSelectedElement = useEditorStore((s) => s.setSelectedElement)

  if (!currentSlide) return null

  const content = element.content as Record<string, any>

  function update(field: string, value: string) {
    updateElementContent(currentSlide!.id, element.id, { [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-stone-900">
          {element.type === 'text' &&
            (content.variant === 'heading'
              ? '标题文本'
              : content.variant === 'subheading'
                ? '副标题文本'
                : content.variant === 'caption'
                  ? '注释文本'
                  : '正文文本')}
          {element.type === 'icon-bullet' && '要点'}
          {element.type === 'stat-card' && '数据卡片'}
          {element.type === 'timeline-node' && '时间节点'}
          {element.type === 'comparison-row' && '对比项'}
          {element.type === 'quote-block' && '引用'}
          {element.type === 'image' && '图片'}
          {element.type === 'html-content' && 'HTML 内容'}
          {element.type === 'callout' && '提示块'}
          {element.type === 'tag-row' && '标签行'}
          {element.type === 'gloss' && '术语表'}
          {element.type === 'footer-bar' && '底部栏'}
        </h4>
        <button
          onClick={() => {
            deleteElement(currentSlide.id, element.id)
            setSelectedElement(null)
          }}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          删除
        </button>
      </div>

      {/* Common editable fields */}
      {content.text !== undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">文字内容</label>
          <input
            type="text"
            value={content.text}
            onChange={(e) => update('text', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      )}

      {content.title !== undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">标题</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      )}

      {content.description !== undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">描述</label>
          <textarea
            value={content.description}
            onChange={(e) => update('description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
          />
        </div>
      )}

      {content.quote !== undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">引用文字</label>
          <textarea
            value={content.quote}
            onChange={(e) => update('quote', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
          />
        </div>
      )}

      {content.author !== undefined && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-500 mb-1">作者</label>
            <input
              type="text"
              value={content.author}
              onChange={(e) => update('author', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          {content.role !== undefined && (
            <div className="flex-1">
              <label className="block text-xs font-medium text-stone-500 mb-1">职位</label>
              <input
                type="text"
                value={content.role}
                onChange={(e) => update('role', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                           bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
          )}
        </div>
      )}

      {content.value !== undefined && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-500 mb-1">数值</label>
            <input
              type="text"
              value={content.value}
              onChange={(e) => update('value', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-500 mb-1">标签</label>
            <input
              type="text"
              value={content.label}
              onChange={(e) => update('label', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>
      )}

      {content.date !== undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">日期/时间</label>
          <input
            type="text"
            value={content.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      )}

      {content.leftValue !== undefined && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-500 mb-1">左侧</label>
            <input
              type="text"
              value={content.leftValue}
              onChange={(e) => update('leftValue', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-stone-500 mb-1">右侧</label>
            <input
              type="text"
              value={content.rightValue}
              onChange={(e) => update('rightValue', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
            />
          </div>
        </div>
      )}

      {content.src !== undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">图片 URL</label>
          <input
            type="text"
            value={content.src}
            onChange={(e) => update('src', e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      )}

      {content.html !== undefined && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              HTML 源码
            </label>
            <textarea
              value={content.html}
              onChange={(e) => update('html', e.target.value)}
              rows={10}
              spellCheck={false}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-stone-50 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                         resize-none font-mono leading-relaxed"
              style={{ fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
              CSS 样式
            </label>
            <textarea
              value={content.css}
              onChange={(e) => update('css', e.target.value)}
              rows={6}
              spellCheck={false}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-stone-50 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                         resize-none font-mono leading-relaxed"
              style={{ fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace' }}
            />
          </div>
        </div>
      )}

      {/* Callout editor */}
      {content.variant !== undefined &&
        content.title !== undefined &&
        content.body !== undefined &&
        content.quote === undefined && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">样式</label>
              <select
                value={content.variant}
                onChange={(e) => update('variant', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              >
                <option value="doing">✓ 已完成</option>
                <option value="not-do">✗ 未完成</option>
                <option value="info">ℹ 信息</option>
                <option value="warn">⚠ 警告</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">标题</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => update('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">内容</label>
              <textarea
                value={content.body}
                onChange={(e) => update('body', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
              />
            </div>
          </div>
        )}

      {/* Tag-row editor */}
      {content.tags !== undefined && content.body === undefined && (
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">标签（逗号分隔）</label>
          <input
            type="text"
            value={(content.tags as string[]).join(', ')}
            onChange={(e) => update('tags', e.target.value)}
            placeholder="标签1, 标签2, 标签3"
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                       bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
          <p className="text-xs text-stone-400 mt-1">用逗号分隔多个标签</p>
        </div>
      )}

      {/* Gloss editor */}
      {content.items !== undefined && !content.tags && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">
            术语表
          </label>
          {(content.items as { term: string; definition: string }[]).map(
            (item: { term: string; definition: string }, i: number) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item.term}
                  onChange={(e) => {
                    const newItems = [...(content.items as any[])]
                    newItems[i] = { ...newItems[i], term: e.target.value }
                    update('items', JSON.stringify(newItems))
                  }}
                  placeholder="术语"
                  className="flex-1 px-2 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700
                           bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
                <input
                  type="text"
                  value={item.definition}
                  onChange={(e) => {
                    const newItems = [...(content.items as any[])]
                    newItems[i] = { ...newItems[i], definition: e.target.value }
                    update('items', JSON.stringify(newItems))
                  }}
                  placeholder="定义"
                  className="flex-[2] px-2 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700
                           bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
            ),
          )}
        </div>
      )}
      {/* Style editor */}
      <StyleEditor element={element} currentSlideId={currentSlide.id} />
    </div>
  )
}

// ===== Style Editor =====

const TEXT_STYLE_TYPES = [
  'text',
  'icon-bullet',
  'callout',
  'quote-block',
  'timeline-node',
  'comparison-row',
]
const CONTAINER_STYLE_TYPES = ['stat-card', 'callout', 'icon-bullet']

const FONT_SIZE_OPTIONS = [
  { value: '', label: '默认' },
  { value: 'sm', label: 'sm (14px)' },
  { value: 'md', label: 'md (16px)' },
  { value: 'lg', label: 'lg (18px)' },
  { value: 'xl', label: 'xl (22px)' },
  { value: '2xl', label: '2xl (28px)' },
  { value: '3xl', label: '3xl (36px)' },
  { value: '4xl', label: '4xl (44px)' },
  { value: '5xl', label: '5xl (56px)' },
]

const FONT_WEIGHT_OPTIONS = [
  { value: '', label: '默认' },
  { value: 'normal', label: 'normal' },
  { value: 'medium', label: 'medium' },
  { value: 'semibold', label: 'semibold' },
  { value: 'bold', label: 'bold' },
  { value: 'extrabold', label: 'extrabold' },
]

const PADDING_OPTIONS = [
  { value: '', label: '默认' },
  { value: 'none', label: '无' },
  { value: 'sm', label: '小 (8px)' },
  { value: 'md', label: '中 (16px)' },
  { value: 'lg', label: '大 (24px)' },
]

const BORDER_RADIUS_OPTIONS = [
  { value: '', label: '默认' },
  { value: 'none', label: '无' },
  { value: 'sm', label: '小 (4px)' },
  { value: 'md', label: '中 (8px)' },
  { value: 'lg', label: '大 (12px)' },
  { value: 'full', label: '全圆角' },
]

const PRESET_COLORS = ['#1C1917', '#FFFFFF', '#6366F1', '#10B981', '#EF4444', '#F59E0B']

function StyleEditor({
  element,
  currentSlideId,
}: {
  element: SlideElement
  currentSlideId: string
}) {
  const updateElement = useEditorStore((s) => s.updateElement)
  const style = element.style || {}
  const showText = TEXT_STYLE_TYPES.includes(element.type)
  const showContainer = CONTAINER_STYLE_TYPES.includes(element.type)

  if (!showText && !showContainer) return null

  function updateStyle(patch: Record<string, string | undefined>) {
    const newStyle = { ...style }
    for (const [k, v] of Object.entries(patch)) {
      if (v === '' || v === undefined) {
        delete newStyle[k as keyof typeof newStyle]
      } else {
        ;(newStyle as Record<string, string>)[k] = v
      }
    }
    updateElement(currentSlideId, element.id, { style: newStyle })
  }

  function handleReset() {
    updateElement(currentSlideId, element.id, { style: {} })
  }

  return (
    <div className="border-t border-stone-100 pt-4 mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">样式</h4>
        <button
          onClick={handleReset}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          重置样式
        </button>
      </div>

      {showText && (
        <>
          {/* Font size */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">字体大小</label>
            <select
              value={style.fontSize || ''}
              onChange={(e) => updateStyle({ fontSize: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer"
            >
              {FONT_SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font weight */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">字重</label>
            <select
              value={style.fontWeight || ''}
              onChange={(e) => updateStyle({ fontWeight: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer"
            >
              {FONT_WEIGHT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">文字颜色</label>
            <div className="flex items-center gap-2 mb-1">
              <input
                type="color"
                value={style.color || '#1C1917'}
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="w-8 h-8 rounded border border-stone-200 cursor-pointer"
              />
              <span className="text-xs text-stone-400">{style.color || '默认'}</span>
            </div>
            <div className="flex gap-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateStyle({ color: c })}
                  className="w-5 h-5 rounded border border-stone-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Text align */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">文本对齐</label>
            <div className="flex gap-1">
              {[
                { value: '', label: '默认' },
                { value: 'left', label: '左' },
                { value: 'center', label: '中' },
                { value: 'right', label: '右' },
                { value: 'justify', label: '两端' },
              ].map((a) => (
                <button
                  key={a.value}
                  onClick={() => updateStyle({ textAlign: a.value })}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors
                    ${
                      (style.textAlign || '') === a.value
                        ? 'bg-brand-light border-brand text-brand font-medium'
                        : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                    }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showContainer && (
        <>
          {/* Background color */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">背景色</label>
            <div className="flex items-center gap-2 mb-1">
              <input
                type="color"
                value={style.backgroundColor || '#FFFFFF'}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded border border-stone-200 cursor-pointer"
              />
              <span className="text-xs text-stone-400">{style.backgroundColor || '默认'}</span>
            </div>
            <div className="flex gap-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateStyle({ backgroundColor: c })}
                  className="w-5 h-5 rounded border border-stone-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Padding */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">内边距</label>
            <select
              value={style.padding || ''}
              onChange={(e) => updateStyle({ padding: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer"
            >
              {PADDING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Border radius */}
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">圆角</label>
            <select
              value={style.borderRadius || ''}
              onChange={(e) => updateStyle({ borderRadius: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer"
            >
              {BORDER_RADIUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  )
}

export default function PropertiesPanel() {
  const showPropertiesPanel = useEditorStore((s) => s.showPropertiesPanel)
  const selectedElementId = useEditorStore((s) => s.selectedElementId)
  const currentSlide = useCurrentSlide()
  const updateSlideField = useEditorStore((s) => s.updateSlideField)
  const updateSlideAnimation = useEditorStore((s) => s.updateSlideAnimation)
  const toggleTemplatePicker = useEditorStore((s) => s.toggleTemplatePicker)

  if (!showPropertiesPanel || !currentSlide) return null

  const selectedElement = selectedElementId
    ? currentSlide.elements.find((e) => e.id === selectedElementId)
    : null

  return (
    <div className="w-72 flex-shrink-0 bg-surface border-l border-stone-200/60 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-stone-100">
        <h3 className="text-sm font-semibold text-stone-900">
          {selectedElement ? '元素属性' : '幻灯片属性'}
        </h3>
        {selectedElement && <p className="text-xs text-stone-400 mt-1">点击幻灯片元素进行编辑</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Element Editor */}
        {selectedElement && <ElementEditor element={selectedElement} />}

        {/* Slide-level settings (only when no element selected) */}
        {!selectedElement && (
          <>
            {/* Template change */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                模板
              </label>
              <button
                onClick={toggleTemplatePicker}
                className="w-full text-left px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                           hover:border-brand hover:text-brand transition-colors"
              >
                更换模板 →
              </button>
            </div>

            {/* Transition type */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                页面过渡
              </label>
              <select
                value={currentSlide.transitionType}
                onChange={(e) =>
                  updateSlideField(
                    currentSlide.id,
                    'transitionType',
                    e.target.value as TransitionType,
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                           bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                           transition-colors cursor-pointer"
              >
                {TRANSITIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Animation preset */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                动画风格
              </label>
              <div className="space-y-1.5">
                {ANIMATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => updateSlideAnimation(currentSlide.id, preset.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${
                        currentSlide.animationPreset === preset.id
                          ? 'bg-brand-light text-brand font-medium'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                  >
                    <div className="font-medium">{preset.nameZh}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                自动翻页时间
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={currentSlide.duration}
                  onChange={(e) =>
                    updateSlideField(currentSlide.id, 'duration', parseInt(e.target.value) || 0)
                  }
                  className="w-20 px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                             bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
                <span className="text-sm text-stone-400">秒 (0=手动)</span>
              </div>
            </div>

            {/* Background color */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                背景颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentSlide.backgroundColor}
                  onChange={(e) =>
                    updateSlideField(currentSlide.id, 'backgroundColor', e.target.value)
                  }
                  className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer"
                />
                <span className="text-sm text-stone-400">{currentSlide.backgroundColor}</span>
              </div>
            </div>

            {/* Narration content */}
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                演讲备注
              </label>
              <textarea
                value={currentSlide.content}
                onChange={(e) => updateSlideField(currentSlide.id, 'content', e.target.value)}
                placeholder="输入此页的演讲备注..."
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-700
                           bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                           resize-none transition-colors placeholder:text-stone-300"
              />
              <div className="text-xs text-stone-400 mt-1 text-right">
                {currentSlide.content.length} 字
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
