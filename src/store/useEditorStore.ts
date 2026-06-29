import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Slide, SlideElement, PresentationSettings } from '@/types'
import { generateId } from '@/utils/id'
import { getTemplateById } from '@/data/templates'
import { getElementPreset } from '@/data/animationPresets'
import { normalizeElementStyle } from '@/utils/elementStyle'

// Debounce timer for text content and style undo snapshots
let _undoDebounceTimer: ReturnType<typeof setTimeout> | null = null

function createDefaultElement(type: string, overrides: Partial<SlideElement> = {}): SlideElement {
  const preset = getElementPreset('gentle', type)
  return {
    id: generateId(),
    type: type as SlideElement['type'],
    content: getDefaultContent(type),
    animation: {
      preset: preset.preset,
      delay: preset.delay,
      duration: preset.duration,
      easing: 'easeOut',
      staggerChildren: 0.1,
    },
    style: {},
    ...overrides,
  }
}

function getDefaultContent(type: string): any {
  switch (type) {
    case 'heading':
      return {
        text: '点击输入标题',
        variant: 'heading',
        alignment: 'center',
        size: '4xl',
        weight: 'bold',
      }
    case 'subheading':
      return {
        text: '点击输入副标题',
        variant: 'subheading',
        alignment: 'center',
        size: 'xl',
        weight: 'normal',
      }
    case 'body':
      return {
        text: '正文内容...',
        variant: 'body',
        alignment: 'left',
        size: 'md',
        weight: 'normal',
      }
    case 'caption':
      return {
        text: '注释说明',
        variant: 'caption',
        alignment: 'center',
        size: 'sm',
        weight: 'normal',
      }
    case 'icon-bullet':
      return { icon: 'Circle', title: '要点标题', description: '要点描述...' }
    case 'stat-card':
      return {
        value: '100',
        label: '指标',
        trend: 'up' as const,
        trendValue: '+20%',
        icon: 'TrendingUp',
        color: '#6366F1',
      }
    case 'timeline-node':
      return { date: '2024', title: '事件标题', description: '事件描述...', icon: 'Circle' }
    case 'comparison-row':
      return {
        label: '特性',
        leftValue: 'A',
        rightValue: 'B',
        leftDetail: '',
        rightDetail: '',
        leftIcon: 'Check',
        rightIcon: 'X',
      }
    case 'quote-block':
      return { quote: '引用内容...', author: '作者', role: '职位', style: 'decorative' as const }
    case 'image':
      return { src: '', alt: '', fit: 'cover' as const, caption: '', position: 'right' as const }
    case 'html-content':
      return { html: '<div class="slide"><p>HTML 内容</p></div>', css: '' }
    case 'callout':
      return { variant: 'info' as const, title: '提示标题', body: '提示内容...' }
    case 'tag-row':
      return { tags: ['标签1', '标签2'] }
    case 'gloss':
      return { items: [{ term: '术语', definition: '定义说明' }] }
    case 'footer-bar':
      return { progressPercent: 50, pageLabel: '01 / 10', keyHint: '← → 翻页' }
    default:
      return { text: '内容', variant: 'body', alignment: 'left', size: 'md', weight: 'normal' }
  }
}

function createDefaultSlide(order: number, templateId = 'title'): Slide {
  const template = getTemplateById(templateId)
  const elements = getDefaultElementsForTemplate(templateId)

  return {
    id: generateId(),
    templateId,
    title: '',
    subtitle: '',
    content: '',
    notes: '',
    elements,
    order,
    animationPreset: template?.defaultAnimationPreset ?? 'gentle',
    transitionType: 'fade',
    backgroundColor: '#FAFAF9',
    backgroundImage: null,
    duration: 0,
  }
}

function getDefaultElementsForTemplate(templateId: string): SlideElement[] {
  switch (templateId) {
    case 'title':
      return [
        createDefaultElement('heading', {
          content: {
            text: '输入标题',
            variant: 'heading',
            alignment: 'center',
            size: '5xl',
            weight: 'extrabold',
          },
        }),
        createDefaultElement('subheading', {
          animation: { ...createDefaultElement('subheading').animation, delay: 0.2 },
          content: {
            text: '输入副标题',
            variant: 'subheading',
            alignment: 'center',
            size: 'xl',
            weight: 'normal',
          },
        }),
        createDefaultElement('caption', {
          animation: { ...createDefaultElement('caption').animation, delay: 0.5 },
          content: {
            text: '输入作者/日期信息',
            variant: 'caption',
            alignment: 'center',
            size: 'sm',
            weight: 'normal',
          },
        }),
      ]
    case 'bullets':
      return [
        createDefaultElement('heading', {
          content: {
            text: '要点标题',
            variant: 'heading',
            alignment: 'left',
            size: '3xl',
            weight: 'bold',
          },
        }),
        createDefaultElement('icon-bullet', {
          content: { icon: 'Zap', title: '第一个要点', description: '描述第一个要点的详细内容' },
        }),
        createDefaultElement('icon-bullet', {
          animation: { ...createDefaultElement('icon-bullet').animation, delay: 0.12 },
          content: { icon: 'Star', title: '第二个要点', description: '描述第二个要点的详细内容' },
        }),
        createDefaultElement('icon-bullet', {
          animation: { ...createDefaultElement('icon-bullet').animation, delay: 0.24 },
          content: { icon: 'Heart', title: '第三个要点', description: '描述第三个要点的详细内容' },
        }),
      ]
    case 'image-text':
      return [
        createDefaultElement('heading', {
          content: {
            text: '图文标题',
            variant: 'heading',
            alignment: 'left',
            size: '3xl',
            weight: 'bold',
          },
        }),
        createDefaultElement('image', {
          animation: { ...createDefaultElement('image').animation, delay: 0 },
          content: { src: '', alt: '图片描述', fit: 'cover', caption: '', position: 'left' },
        }),
        createDefaultElement('body', {
          animation: { ...createDefaultElement('body').animation, delay: 0.2 },
          content: {
            text: '这里是正文内容，配合图片进行说明...',
            variant: 'body',
            alignment: 'left',
            size: 'md',
            weight: 'normal',
          },
        }),
      ]
    case 'quote':
      return [
        createDefaultElement('quote-block', {
          content: {
            quote: '重要的引用金句放在这里',
            author: '作者姓名',
            role: '职位/出处',
            style: 'decorative',
          },
        }),
      ]
    case 'stats':
      return [
        createDefaultElement('heading', {
          content: {
            text: '数据概览',
            variant: 'heading',
            alignment: 'left',
            size: '3xl',
            weight: 'bold',
          },
        }),
        createDefaultElement('stat-card', {
          content: {
            value: '1,234',
            label: '用户数',
            trend: 'up',
            trendValue: '+12.5%',
            icon: 'Users',
            color: '#6366F1',
          },
        }),
        createDefaultElement('stat-card', {
          animation: { ...createDefaultElement('stat-card').animation, delay: 0.1 },
          content: {
            value: '98.5%',
            label: '满意度',
            trend: 'up',
            trendValue: '+2.1%',
            icon: 'Heart',
            color: '#EC4899',
          },
        }),
        createDefaultElement('stat-card', {
          animation: { ...createDefaultElement('stat-card').animation, delay: 0.2 },
          content: {
            value: '567',
            label: '订单数',
            trend: 'down',
            trendValue: '-3.2%',
            icon: 'ShoppingCart',
            color: '#F59E0B',
          },
        }),
        createDefaultElement('stat-card', {
          animation: { ...createDefaultElement('stat-card').animation, delay: 0.3 },
          content: {
            value: '$12K',
            label: '营收',
            trend: 'up',
            trendValue: '+8.7%',
            icon: 'DollarSign',
            color: '#10B981',
          },
        }),
      ]
    case 'timeline':
      return [
        createDefaultElement('heading', {
          content: {
            text: '发展历程',
            variant: 'heading',
            alignment: 'left',
            size: '3xl',
            weight: 'bold',
          },
        }),
        createDefaultElement('timeline-node', {
          content: {
            date: '2020',
            title: '创业起步',
            description: '公司成立，开始产品研发',
            icon: 'Rocket',
          },
        }),
        createDefaultElement('timeline-node', {
          animation: { ...createDefaultElement('timeline-node').animation, delay: 0.15 },
          content: {
            date: '2021',
            title: '产品发布',
            description: '第一版产品正式上线',
            icon: 'Package',
          },
        }),
        createDefaultElement('timeline-node', {
          animation: { ...createDefaultElement('timeline-node').animation, delay: 0.3 },
          content: {
            date: '2023',
            title: '快速增长',
            description: '用户突破百万，获新一轮融资',
            icon: 'TrendingUp',
          },
        }),
        createDefaultElement('timeline-node', {
          animation: { ...createDefaultElement('timeline-node').animation, delay: 0.45 },
          content: {
            date: '2025',
            title: '行业领先',
            description: '成为行业标杆企业',
            icon: 'Trophy',
          },
        }),
      ]
    case 'comparison':
      return [
        createDefaultElement('heading', {
          content: {
            text: '对比分析',
            variant: 'heading',
            alignment: 'center',
            size: '3xl',
            weight: 'bold',
          },
        }),
        createDefaultElement('comparison-row', {
          content: {
            label: '价格',
            leftValue: '免费',
            rightValue: '$99/月',
            leftDetail: '基础功能',
            rightDetail: '全部功能',
          },
        }),
        createDefaultElement('comparison-row', {
          animation: { ...createDefaultElement('comparison-row').animation, delay: 0.1 },
          content: {
            label: '速度',
            leftValue: '快',
            rightValue: '较慢',
            leftDetail: '轻量架构',
            rightDetail: '功能复杂',
            leftIcon: 'Zap',
            rightIcon: 'Clock',
          },
        }),
        createDefaultElement('comparison-row', {
          animation: { ...createDefaultElement('comparison-row').animation, delay: 0.2 },
          content: {
            label: '易用性',
            leftValue: '简单',
            rightValue: '复杂',
            leftDetail: '上手容易',
            rightDetail: '学习曲线陡峭',
            leftIcon: 'Check',
            rightIcon: 'AlertTriangle',
          },
        }),
      ]
    case 'full-image':
      return [
        createDefaultElement('image', {
          content: { src: '', alt: '背景图', fit: 'cover', caption: '', position: 'background' },
        }),
        createDefaultElement('heading', {
          content: {
            text: '图片标题',
            variant: 'heading',
            alignment: 'center',
            size: '4xl',
            weight: 'bold',
          },
          style: { color: '#FFFFFF' },
        }),
        createDefaultElement('subheading', {
          animation: { ...createDefaultElement('subheading').animation, delay: 0.2 },
          content: {
            text: '图片副标题或描述文字',
            variant: 'subheading',
            alignment: 'center',
            size: 'lg',
            weight: 'normal',
          },
          style: { color: '#D6D3D1' },
        }),
      ]
    case 'html':
      return [
        createDefaultElement('html-content', {
          content: { html: '<div class="slide"><p>HTML 内容</p></div>', css: '' },
          animation: {
            preset: 'fadeIn',
            delay: 0,
            duration: 0.5,
            easing: 'easeOut',
            staggerChildren: 0,
          },
        }),
      ]
    case 'content':
      return [
        createDefaultElement('heading', {
          content: {
            text: '内容标题',
            variant: 'heading',
            alignment: 'left',
            size: '3xl',
            weight: 'bold',
          },
        }),
        createDefaultElement('tag-row', { content: { tags: ['阶段一', '进行中'] } }),
        createDefaultElement('callout', {
          content: {
            variant: 'doing' as const,
            title: '已完成的工作',
            body: '描述已经完成的内容...',
          },
          animation: {
            preset: 'fadeInUp',
            delay: 0.1,
            duration: 0.5,
            easing: 'easeOut',
            staggerChildren: 0,
          },
        }),
        createDefaultElement('callout', {
          content: {
            variant: 'not-do' as const,
            title: '尚未完成的工作',
            body: '描述尚未完成的内容...',
          },
          animation: {
            preset: 'fadeInUp',
            delay: 0.2,
            duration: 0.5,
            easing: 'easeOut',
            staggerChildren: 0,
          },
        }),
        createDefaultElement('gloss', {
          content: {
            items: [
              { term: '术语A', definition: '定义说明' },
              { term: '术语B', definition: '定义说明' },
            ],
          },
          animation: {
            preset: 'fadeIn',
            delay: 0.4,
            duration: 0.5,
            easing: 'easeOut',
            staggerChildren: 0,
          },
        }),
      ]
    default:
      return [createDefaultElement('heading'), createDefaultElement('body')]
  }
}

// ==================== Editor State ====================

interface EditorState {
  // Data
  presentationId: string
  title: string
  schemaVersion: string
  slides: Slide[]
  settings: PresentationSettings

  // UI State
  currentSlideId: string | null
  selectedElementId: string | null
  showTemplatePicker: boolean
  showPropertiesPanel: boolean

  // Undo/Redo
  _undoStack: Slide[][]
  _redoStack: Slide[][]
  _pendingUndoSnapshot: Slide[] | null
  _maxUndoSteps: number

  // Actions - Presentation
  setPresentation: (id: string, title: string) => void
  setTitle: (title: string) => void

  // Actions - Slides
  setCurrentSlide: (slideId: string) => void
  addSlide: (templateId?: string) => void
  importSlidesFromHTML: (
    slides: { title: string; html: string; css: string; index: number }[],
  ) => void
  importSlidesFromJSON: (project: { title: string; slides: Slide[]; settings?: any }) => void
  duplicateSlide: (slideId: string) => void
  deleteSlide: (slideId: string) => void
  moveSlide: (fromIndex: number, toIndex: number) => void

  // Actions - Slide Content
  updateSlideField: <K extends keyof Slide>(slideId: string, field: K, value: Slide[K]) => void
  changeSlideTemplate: (slideId: string, templateId: string) => void
  updateSlideAnimation: (slideId: string, preset: string) => void

  // Actions - Elements
  addElement: (slideId: string, type: string) => void
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void
  updateElementContent: (
    slideId: string,
    elementId: string,
    contentUpdates: Record<string, any>,
  ) => void
  deleteElement: (slideId: string, elementId: string) => void
  setSelectedElement: (elementId: string | null) => void

  // Actions - Settings
  updateSettings: (settings: Partial<PresentationSettings>) => void

  // Actions - UI
  toggleTemplatePicker: () => void
  togglePropertiesPanel: () => void

  // Actions - Undo/Redo
  _pushUndo: () => void
  _flushPendingUndo: () => void
  undo: () => void
  redo: () => void
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial data
      presentationId: '',
      title: '未命名幻灯片',
      schemaVersion: '0.5.0',
      slides: [createDefaultSlide(0, 'title')],
      settings: {
        autoPlay: false,
        autoPlayInterval: 5,
        defaultTransition: 'fade',
        showProgressBar: true,
        showNarrationPanel: false,
        aspectRatio: '16:9',
      },

      // UI State
      currentSlideId: null,
      selectedElementId: null,
      showTemplatePicker: false,
      showPropertiesPanel: true,

      // Undo/Redo
      _undoStack: [],
      _redoStack: [],
      _pendingUndoSnapshot: null,
      _maxUndoSteps: 50,

      // Presentation
      setPresentation: (id, title) =>
        set({
          presentationId: id,
          title,
          currentSlideId: get().slides[0]?.id ?? null,
        }),

      setTitle: (title) => set({ title }),

      // Slides
      setCurrentSlide: (slideId) => set({ currentSlideId: slideId, selectedElementId: null }),

      addSlide: (templateId = 'bullets') => {
        get()._pushUndo()
        const slides = get().slides
        const newSlide = createDefaultSlide(slides.length, templateId)
        set({ slides: [...slides, newSlide], currentSlideId: newSlide.id })
      },

      importSlidesFromHTML: (importedSlides) => {
        get()._pushUndo()
        const slides = get().slides
        const newSlides: Slide[] = [...slides]

        importedSlides.forEach(({ title, html, css }, i) => {
          const slide: Slide = {
            id: generateId(),
            templateId: 'html',
            title: title || `Slide ${i + 1}`,
            subtitle: '',
            content: '',
            notes: '',
            elements: [
              {
                id: generateId(),
                type: 'html-content',
                content: { html, css },
                animation: {
                  preset: 'fadeIn',
                  delay: 0,
                  duration: 0.5,
                  easing: 'easeOut',
                  staggerChildren: 0,
                },
                style: {},
              },
            ],
            order: slides.length + i,
            animationPreset: 'gentle',
            transitionType: 'fade',
            backgroundColor: '#FFFFFF',
            backgroundImage: null,
            duration: 0,
            htmlSource: html,
          }
          newSlides.push(slide)
        })

        set({ slides: newSlides, currentSlideId: newSlides[slides.length]?.id ?? null })
      },

      importSlidesFromJSON: (project) => {
        get()._pushUndo()
        set({
          title: project.title || '导入的幻灯片',
          slides: project.slides || [],
          settings: project.settings || get().settings,
          currentSlideId: project.slides?.[0]?.id ?? null,
          selectedElementId: null,
        })
      },

      duplicateSlide: (slideId) => {
        const slides = get().slides
        const index = slides.findIndex((s) => s.id === slideId)
        if (index === -1) return
        get()._pushUndo()
        const original = slides[index]
        const newSlide: Slide = {
          ...JSON.parse(JSON.stringify(original)),
          id: generateId(),
          order: slides.length,
          title: `${original.title} (副本)`,
        }
        const newSlides = [...slides]
        newSlides.splice(index + 1, 0, newSlide)
        set({ slides: newSlides, currentSlideId: newSlide.id })
      },

      deleteSlide: (slideId) => {
        const slides = get().slides
        if (slides.length <= 1) return
        const deletedIndex = slides.findIndex((s) => s.id === slideId)
        if (deletedIndex === -1) return
        get()._pushUndo()
        const newSlides = slides.filter((s) => s.id !== slideId).map((s, i) => ({ ...s, order: i }))
        const newCurrentId =
          get().currentSlideId === slideId
            ? (newSlides[Math.min(deletedIndex, newSlides.length - 1)]?.id ?? null)
            : get().currentSlideId
        set({ slides: newSlides, currentSlideId: newCurrentId })
      },

      moveSlide: (fromIndex, toIndex) => {
        const slides = get().slides
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return
        if (fromIndex >= slides.length || toIndex >= slides.length) return
        get()._pushUndo()
        const newSlides = [...slides]
        const [removed] = newSlides.splice(fromIndex, 1)
        newSlides.splice(toIndex, 0, removed)
        set({ slides: newSlides.map((s, i) => ({ ...s, order: i })) })
      },

      // Slide Content
      updateSlideField: (slideId, field, value) => {
        // Don't push undo for speaker notes (content field) changes
        if (field !== 'content') {
          get()._pushUndo()
        }
        set({
          slides: get().slides.map((s) => (s.id === slideId ? { ...s, [field]: value } : s)),
        })
      },

      changeSlideTemplate: (slideId, templateId) => {
        const template = getTemplateById(templateId)
        if (!template) return
        const slide = get().slides.find((s) => s.id === slideId)
        if (!slide || slide.templateId === templateId) return
        get()._pushUndo()
        set({
          slides: get().slides.map((s) =>
            s.id === slideId
              ? {
                  ...s,
                  templateId,
                  animationPreset: template?.defaultAnimationPreset ?? s.animationPreset,
                  elements: getDefaultElementsForTemplate(templateId),
                }
              : s,
          ),
        })
      },

      updateSlideAnimation: (slideId, preset) =>
        set({
          slides: get().slides.map((s) =>
            s.id === slideId ? { ...s, animationPreset: preset } : s,
          ),
        }),

      // Elements
      addElement: (slideId, type) => {
        if (!get().slides.some((s) => s.id === slideId)) return
        get()._pushUndo()
        set({
          slides: get().slides.map((s) =>
            s.id === slideId ? { ...s, elements: [...s.elements, createDefaultElement(type)] } : s,
          ),
        })
      },

      updateElement: (slideId, elementId, updates) => {
        // 1. Verify slide exists
        const slide = get().slides.find((s) => s.id === slideId)
        if (!slide) return

        // 2. Verify element exists
        const element = slide.elements.find((e) => e.id === elementId)
        if (!element) return

        // 3. Verify updates is not empty
        if (Object.keys(updates).length === 0) return

        // 4. If updating style, normalize and compare
        if ('style' in updates) {
          const normalized = normalizeElementStyle(updates.style)
          if (JSON.stringify(normalized) === JSON.stringify(normalizeElementStyle(element.style))) {
            return // same style, no undo pollution
          }
          updates = { ...updates, style: normalized }
        }

        // 5. style-only updates use 500ms debounce
        if ('style' in updates && Object.keys(updates).length === 1) {
          if (!get()._pendingUndoSnapshot) {
            set({ _pendingUndoSnapshot: JSON.parse(JSON.stringify(get().slides)) })
          }
          if (_undoDebounceTimer) clearTimeout(_undoDebounceTimer)
          _undoDebounceTimer = setTimeout(() => get()._flushPendingUndo(), 500)
        } else {
          get()._pushUndo()
        }

        // 6. Execute update
        set({
          slides: get().slides.map((s) =>
            s.id === slideId
              ? {
                  ...s,
                  elements: s.elements.map((e) => (e.id === elementId ? { ...e, ...updates } : e)),
                }
              : s,
          ),
        })
      },

      updateElementContent: (slideId, elementId, contentUpdates) => {
        // Debounced undo: save snapshot once, then debounce subsequent calls
        if (!get()._pendingUndoSnapshot) {
          set({ _pendingUndoSnapshot: JSON.parse(JSON.stringify(get().slides)) })
        }
        // Clear existing timer, set new 500ms timer to flush
        if (_undoDebounceTimer) clearTimeout(_undoDebounceTimer)
        _undoDebounceTimer = setTimeout(() => {
          get()._flushPendingUndo()
        }, 500)

        set({
          slides: get().slides.map((s) =>
            s.id === slideId
              ? {
                  ...s,
                  elements: s.elements.map((e) =>
                    e.id === elementId
                      ? { ...e, content: { ...(e.content as any), ...contentUpdates } }
                      : e,
                  ),
                }
              : s,
          ),
        })
      },

      deleteElement: (slideId, elementId) => {
        const slide = get().slides.find((s) => s.id === slideId)
        if (!slide || !slide.elements.some((e) => e.id === elementId)) return
        get()._pushUndo()
        set({
          slides: get().slides.map((s) =>
            s.id === slideId ? { ...s, elements: s.elements.filter((e) => e.id !== elementId) } : s,
          ),
          selectedElementId: get().selectedElementId === elementId ? null : get().selectedElementId,
        })
      },

      setSelectedElement: (elementId) => set({ selectedElementId: elementId }),

      // Settings
      updateSettings: (newSettings) => set({ settings: { ...get().settings, ...newSettings } }),

      // UI
      toggleTemplatePicker: () => set({ showTemplatePicker: !get().showTemplatePicker }),
      togglePropertiesPanel: () => set({ showPropertiesPanel: !get().showPropertiesPanel }),

      // ===== Undo/Redo =====
      _pushUndo: () => {
        const { _undoStack, _maxUndoSteps, slides } = get()
        const snapshot = JSON.parse(JSON.stringify(slides)) as Slide[]
        const newStack = [..._undoStack, snapshot]
        if (newStack.length > _maxUndoSteps) newStack.shift()
        set({ _undoStack: newStack, _redoStack: [], _pendingUndoSnapshot: null })
      },

      _flushPendingUndo: () => {
        const { _pendingUndoSnapshot } = get()
        if (!_pendingUndoSnapshot) return
        const { _undoStack, _maxUndoSteps } = get()
        const newStack = [..._undoStack, _pendingUndoSnapshot]
        if (newStack.length > _maxUndoSteps) newStack.shift()
        set({ _undoStack: newStack, _redoStack: [], _pendingUndoSnapshot: null })
      },

      undo: () => {
        // 1. Flush any pending content-editing snapshot first
        get()._flushPendingUndo()
        // 2. Re-read latest state AFTER flush
        const state = get()
        const { _undoStack, slides } = state
        if (_undoStack.length === 0) return
        const prevSlides = _undoStack[_undoStack.length - 1]
        const currentSnapshot = JSON.parse(JSON.stringify(slides)) as Slide[]
        const newUndoStack = _undoStack.slice(0, -1)
        const newCurrentId = prevSlides.find((s) => s.id === state.currentSlideId)
          ? state.currentSlideId
          : (prevSlides[0]?.id ?? null)
        set({
          slides: prevSlides,
          _undoStack: newUndoStack,
          _redoStack: [...state._redoStack, currentSnapshot],
          currentSlideId: newCurrentId,
          selectedElementId: null,
        })
      },

      redo: () => {
        // Clear any pending snapshot — redo should start from a clean base
        get()._flushPendingUndo()
        const state = get()
        const { _redoStack, slides } = state
        if (_redoStack.length === 0) return
        const nextSlides = _redoStack[_redoStack.length - 1]
        const currentSnapshot = JSON.parse(JSON.stringify(slides)) as Slide[]
        const newRedoStack = _redoStack.slice(0, -1)
        const newCurrentId = nextSlides.find((s) => s.id === state.currentSlideId)
          ? state.currentSlideId
          : (nextSlides[0]?.id ?? null)
        set({
          slides: nextSlides,
          _redoStack: newRedoStack,
          _undoStack: [...state._undoStack, currentSnapshot],
          currentSlideId: newCurrentId,
          selectedElementId: null,
        })
      },
    }),
    {
      name: 'html-slide-editor-state',
      partialize: (state) => ({
        presentationId: state.presentationId,
        title: state.title,
        schemaVersion: state.schemaVersion,
        slides: state.slides,
        settings: state.settings,
        currentSlideId: state.currentSlideId,
      }),
    },
  ),
)

// Helper: get current slide
export function useCurrentSlide() {
  const store = useEditorStore()
  return store.slides.find((s) => s.id === store.currentSlideId) ?? null
}
