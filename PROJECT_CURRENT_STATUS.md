# 口播视频演示编辑器 — 项目当前状态报告

> 生成日期：2026-06-29  
> 初版提交：`1f862fe init: 搭建学术幻灯片编辑器基础架构`  
> 仓库：`https://github.com/YangRUi0914/DeepCloude-html-slide-editor`

---

## 1. 项目一句话定位

**口播视频配套演示网站** — 一个 React SPA，用户可以按页选择模板、输入口播内容（旁白文本），然后通过 PPT 级别但更高级的 Framer Motion 动画全屏逐页展示。

---

## 2. 当前已实现功能

### 核心编辑能力
- ✅ 创建新演示文稿（首页 → 编辑器 → 画布）
- ✅ 添加 / 删除 / 复制幻灯片（`src/store/useEditorStore.ts` 的 5 个 slide CRUD action）
- ✅ 拖拽排序幻灯片（`src/components/editor/SlideList.tsx`，使用 `@dnd-kit`）
- ✅ 10 种模板可选（标题页、要点列表、图文混排、引用金句、数据仪表盘、时间线、对比页、全图页、HTML 幻灯片、通用内容页）
- ✅ 模板切换：选中幻灯片 → 打开模板选择器 → 点击模板卡即可切换（`src/components/editor/TemplatePicker.tsx`）
- ✅ 每页独立元素编辑（标题、正文、要点、数据卡片、时间节点、对比行、提示块、标签行、术语表、图片 URL）
- ✅ **画布内联编辑**：在画布上直接点击文字即可编辑，按 Enter/blur 保存，Esc 取消（`src/components/shared/InlineText.tsx`）
- ✅ 属性面板右键编辑（`src/components/editor/PropertiesPanel.tsx`）
- ✅ 口播内容输入（textarea，每页独立）

### 演示模式
- ✅ 全屏演示（`src/components/presentation/PresentationLayout.tsx`，Fullscreen API）
- ✅ 页面过渡动画：9 种（fade、slide-* 四个方向、zoom-in/out、flip-x/y、none）
- ✅ 元素入场动画：9 种（fadeIn、fadeInUp/Down/Left/Right、scaleIn、scaleInBounce、blurIn、rotateIn）
- ✅ 5 个动画预设组合（gentle / dramatic / stagger / smooth / reveal）
- ✅ 方向感知过渡（前进/后退动画方向镜像，`src/animations/variants.ts` 的 `getSlideVariant`）
- ✅ 键盘导航（← → ↑ ↓ Space Home End，`src/hooks/useKeyboard.ts`）
- ✅ 点击屏幕左右区域翻页
- ✅ 顶部进度条（`src/components/presentation/ProgressBar.tsx`，可点击跳转）
- ✅ 幻灯片计数显示
- ✅ 自动翻页（`src/hooks/useAutoPlay.ts`，可配置每页时间）
- ✅ 演示中查看口播脚本面板（`src/components/presentation/NarrationPanel.tsx`）

### 数据持久化
- ✅ Zustand `persist` 中间件，自动存入 `localStorage`（key: `"narration-presentation-state"`）
- ✅ 刷新页面恢复编辑状态

### HTML 导入
- ✅ 解析 HTML 文件，提取 `.slide` 或 `[data-i]` 元素（`src/utils/htmlImporter.ts`）
- ✅ 保留原始 CSS
- ✅ 导入后在编辑器中以 iframe 渲染（`src/templates/HTMLSlide.tsx`）
- ✅ HTML 源码/CSS 在属性面板可编辑

---

## 3. 当前没有实现但计划实现的功能

（以下全部为"未实现"）

- ❌ 撤销/重做（Toolbar 有按钮但从未连接 store，EditorLayout 未传 props）
- ❌ 导出为 PDF / PPTX / 图片
- ❌ 导出为独立 HTML 文件
- ❌ 导出为 JSON
- ❌ 首页"最近项目"列表
- ❌ 演示者视图（双屏：一屏演示、一屏看备注）
- ❌ 幻灯片内元素拖拽移动/缩放
- ❌ 元素样式编辑（字体、字号、颜色、对齐等）
- ❌ 图片上传（仅有 URL 输入）
- ❌ 视频/音频嵌入
- ❌ 模板自定义（用户无法创建新模板）
- ❌ 暗色模式
- ❌ 移动端响应式布局
- ❌ 多人协作
- ❌ 国际化（所有字符串硬编码中文）

---

## 4. 当前页面路由

| 路径 | 页面组件 | 用途 |
|------|----------|------|
| `/` | `src/pages/HomePage.tsx` | 首页：创建新文稿 / 导入 HTML |
| `/editor/:id` | `src/pages/EditorPage.tsx` | 编辑器：三栏布局 |
| `/present/:id` | `src/pages/PresentationPage.tsx` | 演示模式：全屏播放 |

**路由配置**：`src/App.tsx`，使用 React Router v6 `Routes`/`Route`。

**未实现**：404 页面、路由守卫、错误边界。

---

## 5. 当前主要技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | ^18.3.0 |
| 语言 | TypeScript | ^5.5.0 |
| 构建 | Vite | ^5.4.0 |
| 动画 | Framer Motion | ^11.0.0 |
| 状态管理 | Zustand（含 persist 中间件） | ^4.5.0 |
| 路由 | React Router DOM | ^6.26.0 |
| 样式 | Tailwind CSS | ^3.4.0 |
| 拖拽 | @dnd-kit/core + @dnd-kit/sortable | ^6.1.0 / ^8.0.0 |
| 图标 | Lucide React | ^0.400.0 |
| ID 生成 | nanoid | ^5.0.0 |

**未引入**：测试框架（Vitest/Jest）、Lint 工具（ESLint/Prettier）、HTML 消毒库（DOMPurify）、导出库。

---

## 6. 当前目录结构

```
html-editor/
├── index.html                          # 入口 HTML，引入 Google Fonts
├── package.json                        # 依赖和脚本
├── vite.config.ts                      # Vite 配置 + @/ 路径别名
├── tailwind.config.ts                  # 设计令牌（颜色、阴影、字体）
├── postcss.config.js                   # PostCSS 配置
├── tsconfig.json                       # TypeScript 配置
├── .gitignore                          # 排除 node_modules 和 dist
├── CLAUDE.md                           # AI 开发指南
├── 启动编辑器.bat                       # Windows 一键启动脚本
│
├── public/
│   └── favicon.svg                     # 网站图标
│
└── src/
    ├── main.tsx                        # React 入口
    ├── App.tsx                         # 路由配置（3 条路由）
    ├── index.css                       # Tailwind 指令 + 全局样式
    ├── vite-env.d.ts
    │
    ├── types/                          # TypeScript 类型定义
    │   ├── index.ts                    # 统一导出
    │   ├── slide.ts                    # Slide / SlideElement / 12 种元素类型 / 过渡类型
    │   ├── template.ts                 # Template 元数据接口
    │   ├── presentation.ts             # Presentation / PresentationSettings
    │   └── animation.ts                # ElementPreset / AnimationVariant
    │
    ├── data/                           # 静态数据 / 目录
    │   ├── templates.ts                # 10 种模板定义
    │   └── animationPresets.ts         # 5 个动画预设配置
    │
    ├── store/                          # Zustand 状态管理
    │   ├── useEditorStore.ts           # 编辑器主 store（19 个 action，持久化）
    │   └── usePresentationStore.ts     # 演示模式运行时 store（8 个 action，不持久化）
    │
    ├── hooks/                          # 自定义 hooks
    │   ├── useKeyboard.ts              # 键盘快捷键
    │   ├── useAutoPlay.ts              # 自动翻页定时器
    │   ├── useFullscreen.ts            # Fullscreen API 封装
    │   └── useSlideNavigation.ts       # 幻灯片导航边界检查
    │
    ├── animations/                     # 动画系统
    │   ├── variants.ts                 # 10 种页面过渡 + 9 种元素入场 + Ken Burns + Stagger
    │   └── transitions.ts              # 过渡配置（弹簧、缓动曲线）
    │
    ├── templates/                      # 模板组件
    │   ├── registry.ts                 # 模板注册表（10 个模板 → 组件映射）
    │   ├── TemplateRenderer.tsx        # 模板调度器（按 templateId 渲染对应组件）
    │   ├── AnimatedElement.tsx         # 元素入场动画包装器
    │   ├── TitleSlide.tsx              # 标题页
    │   ├── BulletPointsSlide.tsx       # 要点列表
    │   ├── ImageTextSlide.tsx          # 图文混排
    │   ├── QuoteSlide.tsx              # 引用金句
    │   ├── StatsSlide.tsx              # 数据仪表盘
    │   ├── TimelineSlide.tsx           # 时间线
    │   ├── ComparisonSlide.tsx         # 对比页
    │   ├── FullImageSlide.tsx          # 全图页
    │   ├── HTMLSlide.tsx               # HTML 导入幻灯片（iframe 渲染）
    │   └── ContentSlide.tsx            # 通用内容页（callout/tag/gloss/footer-bar）
    │
    ├── components/
    │   ├── editor/                     # 编辑器 UI 组件
    │   │   ├── EditorLayout.tsx        # 三栏布局外壳
    │   │   ├── Toolbar.tsx             # 顶部工具栏
    │   │   ├── Sidebar.tsx             # 左侧边栏（包 SlideList）
    │   │   ├── SlideList.tsx           # 幻灯片列表（拖拽排序）
    │   │   ├── SlideThumbnail.tsx      # 幻灯片缩略图卡片
    │   │   ├── Canvas.tsx              # 中央画布（16:9 预览）
    │   │   ├── PropertiesPanel.tsx     # 右侧属性面板（slide/element 编辑）
    │   │   ├── TemplatePicker.tsx      # 模板选择器弹窗
    │   │   └── TemplateCard.tsx        # 模板卡片
    │   │
    │   ├── presentation/               # 演示模式 UI 组件
    │   │   ├── PresentationLayout.tsx  # 全屏外壳
    │   │   ├── PresentationView.tsx    # 演示播放引擎（AnimatePresence）
    │   │   ├── AnimatedSlide.tsx       # 单张动画幻灯片
    │   │   ├── NavigationControls.tsx  # 导航按钮 + 页码
    │   │   ├── ProgressBar.tsx         # 顶部进度条
    │   │   └── NarrationPanel.tsx      # 口播内容侧边面板
    │   │
    │   └── shared/                     # 共享 UI 组件
    │       ├── Button.tsx              # 按钮（primary/secondary/ghost/danger）
    │       ├── IconButton.tsx          # 图标按钮（含 tooltip）
    │       ├── Modal.tsx               # 模态框（Framer Motion 动画）
    │       ├── Tooltip.tsx             # 悬浮提示
    │       └── InlineText.tsx          # 内联可编辑文本组件
    │
    ├── pages/                          # 页面级组件
    │   ├── HomePage.tsx                # 首页
    │   ├── EditorPage.tsx              # 编辑器页面
    │   └── PresentationPage.tsx        # 演示页面
    │
    └── utils/                          # 工具函数
        ├── id.ts                       # nanoid 封装
        ├── storage.ts                  # localStorage 读写
        └── htmlImporter.ts             # HTML 导入解析器
```

**说明**：项目没有 `src/app`、`src/lib`、`src/components` 以外的顶层目录。核心逻辑分布在 `store/`、`templates/`、`components/`、`types/`。

---

## 7. 当前核心数据模型

### Slide（幻灯片）— `src/types/slide.ts`
```
Slide {
  id, templateId, title, subtitle, content, notes,
  elements: SlideElement[],   // 核心结构化内容
  order: number,
  animationPreset: string,    // 引用 animationPresets 中的 preset ID
  transitionType: TransitionType,  // 'fade' | 'slide-left' | ... | 'none'
  backgroundColor: string,
  backgroundImage: string | null,
  duration: number,           // 自动翻页秒数，0=手动
  htmlSource?: string,        // HTML 导入时保存的原始 HTML
}
```

### SlideElement（元素）— `src/types/slide.ts`
```
SlideElement {
  id: string,
  type: SlideElementType,     // 12 种之一
  content: SlideElementContent,  // 按 type 区分的联合类型
  animation: ElementAnimationConfig,  // preset, delay, duration, easing, staggerChildren
  style: Record<string, string>,
}
```

### SlideElementType（12 种）— `src/types/slide.ts`
```
'text' | 'image' | 'stat-card' | 'timeline-node' | 'comparison-row'
| 'quote-block' | 'icon-bullet' | 'html-content' | 'callout'
| 'tag-row' | 'gloss' | 'footer-bar'
```

每种类型对应各自独立的 Content 接口（如 `TextContent`、`StatCardContent`、`CalloutContent` 等）。

### Template（模板元数据）— `src/types/template.ts`
```
Template {
  id, name, nameZh, description, descriptionZh,
  category: 'opening' | 'content' | 'visual' | 'data' | 'comparison' | 'closing',
  icon: string,               // Lucide 图标名
  previewColors: string[],    // 预览卡片渐变色
  defaultAnimationPreset: string,
}
```

### Animation Preset — `src/types/animation.ts`
```
ElementPreset = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight'
               | 'scaleIn' | 'scaleInBounce' | 'blurIn' | 'rotateIn'
TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down'
               | 'zoom-in' | 'zoom-out' | 'flip-x' | 'flip-y' | 'none'
```

### Presentation（顶层文稿）— `src/types/presentation.ts`
```
Presentation {
  id, title, description,
  slides: any[],           // 类型较松散
  settings: PresentationSettings,
  createdAt, updatedAt,
}
```

---

## 8. 当前编辑器页面长什么样

### 左侧有什么（`src/components/editor/Sidebar.tsx` + `SlideList.tsx`）
- **幻灯片缩略图列表**：每张幻灯片显示为一个小卡片（16:9 比例，含微小模板预览和序号）
- **拖拽排序**：缩略图可通过 `@dnd-kit` 拖拽重排
- **悬停操作**：鼠标悬停显示复制/删除按钮，左上角出现拖拽手柄
- **"添加幻灯片"按钮**：底部虚线边框按钮（固定创建 `bullets` 模板）
- **当前选中态**：indigo 色 2px 环形高亮

### 中间有什么（`src/components/editor/Canvas.tsx`）
- **16:9 画布**：居中显示，最大宽度 960px，带 `slide-shadow` 阴影
- **实时预览**：当前选中幻灯片通过 `TemplateRenderer` 渲染
- **内联编辑**：点击文字元素直接在画布上编辑
- **悬停效果**：鼠标悬停画布阴影加深

### 右侧有什么（`src/components/editor/PropertiesPanel.tsx`）
- **面板宽度**：288px（`w-72`），可折叠（顶部工具栏切换按钮）
- **幻灯片属性**（未选中元素时）：模板切换按钮、过渡类型下拉框、动画预设选择、自动翻页时间、背景颜色、口播内容 textarea
- **元素属性**（选中元素时）：元素类型标签 + 删除按钮，按元素类型显示对应字段编辑器（如文本→input、引用→多字段、HTML→代码编辑器等）

### 支持切换 slide
✅ 点击左侧缩略图切换、拖拽排序

### 支持编辑内容
✅ 画布内联编辑（`InlineText`）+ 属性面板编辑（`PropertiesPanel`）

### 支持模板选择
✅ 属性面板"更换模板"按钮 → `TemplatePicker` 弹窗（4 列网格）→ 点击卡片即时切换

### 支持动画预览
⚠️ 编辑器模式下不播放动画（`animated={false}`）。仅演示模式（全屏播放）才能看到动画效果。编辑器内无动画预览按钮。

---

## 9. 当前模板系统是否存在

**存在**。采用 **Registry 模式**。

### 模板注册表：`src/templates/registry.ts`
- 一个 `Record<string, ComponentType<TemplateComponentProps>>` 对象
- 手动注册了 10 个模板 ID 到组件的映射
- `getTemplateComponent(templateId)` 查找组件，未找到时回退到 `TitleSlide`
- 添加新模板需要：创建组件 → 在 `registry.ts` 注册 → 在 `data/templates.ts` 添加元数据 → 在 `useEditorStore.ts` 添加默认元素

### 10 个已注册模板

| ID | 组件 | 中文名 |
|----|------|--------|
| `title` | TitleSlide | 标题页 |
| `bullets` | BulletPointsSlide | 要点列表 |
| `image-text` | ImageTextSlide | 图文混排 |
| `quote` | QuoteSlide | 引用金句 |
| `stats` | StatsSlide | 数据仪表盘 |
| `timeline` | TimelineSlide | 时间线 |
| `comparison` | ComparisonSlide | 对比页 |
| `full-image` | FullImageSlide | 全图页 |
| `html` | HTMLSlide | HTML 幻灯片 |
| `content` | ContentSlide | 通用内容页 |

### 模板元数据：`src/data/templates.ts`
- `TEMPLATES` 数组包含每个模板的名称、分类、图标、预览颜色、默认动画预设等信息
- `getTemplateById(id)` 查找函数

### 状态
- ⚠️ 模板是写死在代码中的，用户无法通过 UI 创建或自定义模板

---

## 10. 当前动画系统是否存在

**存在**。

### 动画库
- **Framer Motion v11**（`framer-motion`）

### 两层动画架构
1. **页面过渡**（Slide Transition）：`src/animations/variants.ts` 的 `slideTransitions`
   - 9 种过渡 + 1 个 "none"（共 10 个 variant 定义）
   - `PresentationView.tsx` 使用 `AnimatePresence mode="wait"` 包裹 `AnimatedSlide`
   - 方向感知：`getSlideVariant(type, direction)` 在后退时交换 enter/exit

2. **元素入场**（Element Entrance）：`src/animations/variants.ts` 的 `elementEntrance`
   - 9 种入场效果
   - 通过 `AnimatedElement` 包装器应用
   - 支持延迟、持续时间、缓动曲线配置
   - `staggerContainer` 实现错位级联入场
   - 特殊效果：`kenBurns`（缓慢缩放）、`typewriterChar`（字符逐字显现）

### 动画预设：`src/data/animationPresets.ts`
- 5 个预设组合：gentle / dramatic / stagger / smooth / reveal
- 每个预设定义：页面过渡类型 + 按元素类型映射的入场动画 + 错位延迟

### 过渡配置：`src/animations/transitions.ts`
- `smoothSpring`、`gentleTween`、`bouncySpring`、`slowReveal`、`slideTransitionConfig`

---

## 11. 当前状态管理方式

### 是否用了 Zustand
✅ 是。两个独立 store：

1. **`useEditorStore`**（`src/store/useEditorStore.ts`）
   - 使用 `zustand/middleware` 的 `persist` 中间件
   - 19 个 action，管理所有幻灯片数据 + UI 状态
   - 包含工厂函数：`createDefaultElement`、`createDefaultSlide`、`getDefaultElementsForTemplate`

2. **`usePresentationStore`**（`src/store/usePresentationStore.ts`）
   - 不使用 persist
   - 8 个 action，管理演示播放时的索引、方向、播放状态
   - 进入演示模式时从编辑器 store 复制 slides

### 是否支持本地保存
✅ 是。编辑器 store 自动持久化到 `localStorage`（key: `"narration-presentation-state"`）

### 是否支持刷新恢复
✅ 是。Zustand persist 中间件在 store 初始化时自动从 `localStorage` hydrate

### 未实现
- ❌ 多次撤销/重做历史栈（Toolbar 有按钮但 `EditorLayout` 没有传 `onUndo`/`onRedo` props）

---

## 12. 当前导出能力

| 导出格式 | 状态 |
|----------|------|
| 导出为 JSON | ❌ 未实现（但 `localStorage` 中有完整 JSON） |
| 导出为 HTML | ❌ 未实现 |
| 导出为 PDF | ❌ 未实现 |
| 导出为 PPTX | ❌ 未实现 |
| 导出为图片 | ❌ 未实现 |
| HTML 导入 | ✅ 已实现（`src/utils/htmlImporter.ts`） |

---

## 13. 当前 UI 风格描述

- **整体风格**：温暖浅色主题，类似 Notion/Linear 的现代简约风格
- **背景色**：`#FAFAF9`（石色 50，暖白纸色）
- **品牌色**：indigo `#6366F1`，hover 态 `#4F46E5`
- **字体**：Inter（英文/数字）+ Noto Sans SC（中文），标题使用 extrabold 字重
- **圆角**：`rounded-xl`（12px）为主
- **阴影系统**：4 级阴影（slide / slide-hover / card / elevated）
- **编辑器布局**：三栏（左 224px + 中 flex-1 + 右 288px），顶部 56px 工具栏
- **玻璃态面板**：`glass-panel` 类（白色 80% 不透明 + backdrop-blur-xl）
- **微观交互**：hover 时背景色/阴影过渡、active 时缩放 `scale-[0.98]`、按钮 200ms transition
- **暗色模式**：❌ 未实现

---

## 14. 当前已知问题和未完成点

### 功能缺失
1. **撤销/重做未连接**：`Toolbar.tsx` 接收 `onUndo`/`onRedo`/`canUndo`/`canRedo` props，但 `EditorLayout` 未传递，按钮永久禁用
2. **添加幻灯片固定 `bullets` 模板**：`SlideList.tsx` 的 `addSlide('bullets')` 硬编码，未让用户选择模板
3. **未导入 HTML 消毒库**：导入的 HTML 通过 `dangerouslySetInnerHTML`/iframe `srcDoc` 直接渲染，存在 XSS 风险
4. **无 PDF/HTML/JSON 导出**
5. **首页无最近项目列表**：用户无法从首页继续之前的工作
6. **无 404 页面**：未知路由不显示任何错误提示
7. **无错误边界**
8. **元素级别无样式编辑**：字体、颜色、大小、对齐等均不可调
9. **元素不能拖拽移动/缩放**：编辑器中元素位置完全由模板决定
10. **图片仅支持 URL**：无本地上传，无拖入图片
11. **编辑器内无动画预览**：只有进入全屏演示才能看到动画
12. **演示模式无退出按钮**：只能按 Esc
13. **演示者视图未实现**：无双屏支持
14. **无测试**：零测试文件，无测试框架依赖
15. **无 Lint/Format**：无 ESLint/Prettier 配置
16. **移动端未适配**：所有尺寸固定，移动端布局基本不可用

### 代码质量
- `PropertiesPanel.tsx` 的元素类型检测基于内容字段启发式（如 `content.variant !== undefined`），不够稳健
- `ContentSlide.tsx` 中 `gloss.items` 和 `tag-row.tags` 编辑用 `JSON.stringify` 传值，较脆弱
- `Presentation` 类型中 `slides: any[]` 应该有更具体的类型

---

## 15. 当前运行方式

```bash
# 安装依赖
npm install

# 启动开发服务器（自动打开浏览器）
npm run dev
# 或双击 Windows 批处理文件
启动编辑器.bat

# 类型检查（不产出文件）
npx tsc --noEmit

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

**未实现的命令**：
- ❌ `npm test` — 无测试脚本
- ❌ `npm run lint` — 无 lint 脚本

---

## 16. 最近一次构建结果

**`npm run build` 执行结果**（2026-06-29）：

```
✓ 1936 modules transformed.
✓ built in 2.88s

dist/index.html                 0.84 kB │ gzip: 0.47 kB
dist/assets/index-DrR4y_aM.css 30.07 kB │ gzip: 5.82 kB
dist/assets/index-vLtLF4ST.js 1140.96 kB │ gzip: 256.60 kB

(!) Some chunks are larger than 500 kB after minification.
```

- TypeScript 类型检查通过（`tsc --noEmit` 零错误）
- JS bundle 较大（1.14 MB 未压缩 / 257 KB gzip），主要是 Framer Motion 和 Lucide React
- 无 lint 结果（未配置）

---

## 17. 最需要优先改进的 5 个问题（按优先级排序）

### 优先级 1：编辑器内元素内容编辑体验不足
**问题**：虽然已有 `InlineText` 实现内联编辑，但所有样式（字体、颜色、大小、对齐）均不可调。用户无法改变标题字号、要点颜色，或调整文本对齐。属性面板仅提供原始字段值编辑，无任何视觉样式控件。  
**影响**：用户导入现有 HTML slide 后，无法在编辑器内可视化地调整样式。  
**建议**：`PropertiesPanel` 中为 `text` 元素增加字号、字重、颜色、对齐等选择器。

### 优先级 2：撤销/重做功能缺失
**问题**：`Toolbar` 的撤销/重做按钮已渲染但从未连接。`EditorLayout` 未向 `Toolbar` 传递 `onUndo`/`onRedo` props，store 中也没有历史栈。一次误操作（如误删幻灯片、误改模板）无法恢复。  
**影响**：编辑器缺乏基本的编辑安全感。  
**建议**：在 `useEditorStore` 中实现命令历史栈（past/future 数组），或使用 `zustand/middleware` 的 `temporal` 中间件。`EditorLayout` 传递 `onUndo`/`onRedo` 给 `Toolbar`。

### 优先级 3：导出功能完全缺失
**问题**：用户花了时间编辑的幻灯片无法导出为任何格式。当前幻灯片数据仅存在于 `localStorage` 中。  
**影响**：编辑器成了"数据孤岛"——内容进得来（HTML 导入），出不去。  
**建议**：优先实现 JSON 导出（数据已在 store 中，只需 `JSON.stringify` + download），然后是独立 HTML 导出（将 slides 拼接为一个带翻页 JS 的 HTML 文件）。

### 优先级 4：HTML 导入缺少安全处理
**问题**：导入的 HTML 直接注入 iframe（`srcDoc`），未经过任何消毒处理（无 DOMPurify 等库）。`src/utils/htmlImporter.ts` 不做任何内容过滤。  
**影响**：导入恶意 HTML 文件可能导致 XSS 攻击。  
**建议**：引入 `DOMPurify` 对导入的 HTML 进行消毒后再渲染。

### 优先级 5：首页缺少"继续编辑"入口
**问题**：用户刷新页面或重新打开浏览器后，`localStorage` 中的数据还在，但首页没有任何入口可以回到之前的项目。用户必须记住 URL 或通过浏览器历史记录回去。  
**影响**：用户可能以为数据丢失了。  
**建议**：首页从 `localStorage` 读取所有已保存的 presentation，显示为列表，点击即可继续编辑。

---

## 附录：文件统计

- 源文件总数：53 个 TypeScript/TSX 文件（不含 node_modules、dist）
- 模板组件：12 个（10 个模板 + 1 个 AnimatedElement + 1 个 TemplateRenderer）
- 编辑器组件：9 个
- 演示组件：6 个
- 共享组件：5 个
- Store：2 个
- Hooks：4 个
- Types：4 个
- Data：2 个
- Utils：3 个
