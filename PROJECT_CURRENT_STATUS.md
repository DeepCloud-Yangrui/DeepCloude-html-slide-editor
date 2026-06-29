# HTML Slide Editor — 项目当前状态报告

> 生成日期：2026-06-29  
> 当前阶段：P0.5 完成  
> 仓库：`https://github.com/DeepCloud-Yangrui/DeepCloude-html-slide-editor`

---

## 1. 当前项目定位

**HTML Slide Editor / HTML 幻灯片编辑器** — 一个用 HTML/CSS/React 动画承载的 Web 原生幻灯片编辑器。用户可以像编辑 PPT 一样编辑结构化幻灯片，底层数据是 JSON，支持导出为独立 HTML 文件和 JSON 文件。

**已完成定位校正**：所有用户可见文案已从"口播视频演示"改为 HTML Slide Editor 方向。口播内容字段已重定位为"演讲备注 / Speaker Notes"。

---

## 2. 当前已完成的 P0.5 内容

- ✅ 项目定位文案校正（首页、编辑器、演示模式、`<title>`、CLAUDE.md、bat 启动脚本）
- ✅ 类型模型收敛（`Presentation.slides: any[]` → `Slide[]`，`Slide.notes` 标记 deprecated）
- ✅ localStorage key 迁移（`narration-presentation-state` → `html-slide-editor-state`，显式复制旧 key 数据，保留旧 key 不删除）
- ✅ 首页"继续编辑"入口（读取 localStorage 显示项目标题和幻灯片数量）
- ✅ JSON 导出（编辑器 Toolbar → 下载 `.json` 文件，包含 `schemaVersion: "0.5.0"`）
- ✅ JSON 导入（首页 / 编辑器均支持，含 schema 校验、缺失字段默认值补齐、不认识的 element type 跳过不阻塞导入）
- ✅ 独立 HTML 导出雏形（静态渲染全部模板、内嵌 CSS 和翻页 JS、演讲备注 N 键切换、html 模板用 iframe sandbox="" 安全包裹）
- ✅ 工程规范命令（`typecheck` / `lint` / `format` / `build`）
- ✅ iframe sandbox 收紧（编辑器内 HTMLSlide 移除 allow-scripts）
- ✅ 不破坏现有 10 种模板和演示模式

---

## 3. 当前技术栈

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
| Lint | ESLint 8 + @typescript-eslint + react-hooks | ^8.57.0 |
| Format | Prettier | ^3.2.0 |

**未引入**：测试框架（Vitest/Jest）、HTML 消毒库（DOMPurify）、PDF/PPTX 导出库。

---

## 4. 当前路由

三条路由（`src/App.tsx`）：

| 路径 | 页面 | 用途 |
|------|------|------|
| `/` | `HomePage` | 首页：新建 / 继续编辑 / 导入 JSON / 导入 HTML |
| `/editor/:id` | `EditorPage` | 三栏编辑器 |
| `/present/:id` | `PresentationPage` | 全屏演示播放 |

无 404 路由、无路由守卫、无错误边界。

---

## 5. 当前核心目录结构

```
src/
├── types/          # 4 个文件：slide, template, animation, presentation
├── data/           # 2 个文件：templates（10 种）、animationPresets（5 个）
├── store/          # 2 个文件：useEditorStore（持久化）、usePresentationStore
├── hooks/          # 4 个文件：useKeyboard, useAutoPlay, useFullscreen, useSlideNavigation
├── animations/     # 2 个文件：variants, transitions
├── templates/      # 12 个文件：registry, TemplateRenderer, AnimatedElement, TitleSlide, BulletPointsSlide, ImageTextSlide, QuoteSlide, StatsSlide, TimelineSlide, ComparisonSlide, FullImageSlide, HTMLSlide, ContentSlide
├── components/
│   ├── editor/     # 9 个文件：EditorLayout, Toolbar, Sidebar, SlideList, SlideThumbnail, Canvas, PropertiesPanel, TemplatePicker, TemplateCard
│   ├── presentation/  # 6 个文件：PresentationLayout, PresentationView, AnimatedSlide, NavigationControls, ProgressBar, NarrationPanel
│   └── shared/     # 5 个文件：Button, IconButton, Modal, Tooltip, InlineText
├── pages/          # 3 个文件：HomePage, EditorPage, PresentationPage
└── utils/          # 6 个文件：id, storage, htmlImporter, exportJson, importJson, exportHtml
```

共 61 个源文件。

---

## 6. 当前数据模型

### Slide（幻灯片）
```typescript
Slide {
  id, templateId, title, subtitle,
  content: string,            // 演讲备注 / Speaker Notes
  notes?: string,             // @deprecated，已合并到 content
  elements: SlideElement[],   // 结构化内容块
  order: number,
  animationPreset: string,    // gentle | dramatic | stagger | smooth | reveal
  transitionType: TransitionType,  // fade | slide-* | zoom-* | flip-* | none
  backgroundColor, backgroundImage,
  duration: number,           // 0 = 手动翻页
  htmlSource?: string,        // HTML 导入时的原始 HTML（仅 html 模板）
}
```

### SlideElement（元素）
```typescript
SlideElement {
  id, type, content, animation, style
}
```

12 种元素类型：`text`, `image`, `stat-card`, `timeline-node`, `comparison-row`, `quote-block`, `icon-bullet`, `html-content`, `callout`, `tag-row`, `gloss`, `footer-bar`

### schemaVersion
仅在导出 JSON 的外层结构中：`{ "schemaVersion": "0.5.0", "project": {...} }`。不进入内部 store 类型。

---

## 7. 当前模板系统

Registry 模式（`src/templates/registry.ts`），10 个模板：

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

添加新模板需四步：创建组件 → 注册 → 添加元数据 → 添加默认元素。用户无法通过 UI 创建模板。

---

## 8. 当前动画系统

Framer Motion v11，两层架构：
- **页面过渡**：10 种 variant，`AnimatePresence mode="wait"`，方向感知（前进/后退镜像）
- **元素入场**：9 种 variant，通过 `AnimatedElement` 包装器 + stagger 容器
- **5 个动画预设**：gentle / dramatic / stagger / smooth / reveal
- **特殊效果**：Ken Burns（缓慢缩放）、弹簧物理弹性

动画系统 P0.5 期间未做任何修改。

---

## 9. 当前 JSON 导入导出能力

### JSON 导出（`src/utils/exportJson.ts`）
- 入口：编辑器 Toolbar "导出 JSON" 按钮
- 导出完整项目数据（title、settings、slides）为 `.json` 文件
- 外层含 `schemaVersion: "0.5.0"` 和 `exportedAt`
- 不导出 UI runtime 状态（currentSlideId、selectedElementId 等）
- 文件命名：`{项目标题}_{YYYY-MM-DD}.json`

### JSON 导入（`src/utils/importJson.ts`）
- 入口：首页"导入 JSON 项目"按钮 / 编辑器 Toolbar "打开 JSON" 按钮
- 校验规则（宽松策略）：
  - `schemaVersion` 必须为 `0.5.x`
  - slides 数组允许为空
  - elements 数组允许为空
  - 不认识的 templateId → fallback 到 `'title'`
  - 不认识的 element type → 跳过该 element（`console.warn`），不阻塞导入
  - 缺失字段自动补默认值（duration→0, backgroundColor→#FAFAF9, transitionType→fade, animationPreset→gentle 等 8 个字段）
  - 拒绝含 `__proto__` / `constructor` / `prototype` 的原型污染数据
- 导入后生成新 presentationId，不覆盖当前项目

---

## 10. 当前独立 HTML 导出能力和限制

### 能力（`src/utils/exportHtml.ts`）
- ✅ 导出为单一自包含 `.html` 文件，零外部依赖
- ✅ 所有 10 种模板的静态渲染（从 elements 提取内容生成 HTML）
- ✅ 内嵌 CSS（排版、颜色、间距、卡片、callout）
- ✅ 内嵌 JS 翻页逻辑：`← →` 翻页、点击左右半屏翻页、`Home/End` 跳首尾、`F` 全屏、`N` 显示/隐藏演讲备注
- ✅ 顶部进度条 + 页数指示器
- ✅ 16:9 容器布局
- ✅ 所有用户文本 `escapeHtml()` 转义
- ✅ HTML 模板（templateId='html'）用 `<iframe sandbox="" srcdoc="...">` 包裹，禁止脚本执行
- ✅ 无 HTML 内容的 html 模板 fallback 为静态占位提示

### 明确限制
- ❌ 不保留 Framer Motion 动画（静态渲染）
- ❌ 不保留页面过渡动画
- ❌ 不保留元素入场动画
- ❌ html 模板内的 CSS 可能不完全兼容（sandbox iframe 隔离）
- ⚠️ 第一版追求"可独立打开、可翻页、布局不崩"，不追求完整视觉还原

---

## 11. 当前 localStorage key 迁移情况

- **新 key**：`html-slide-editor-state`
- **旧 key**：`narration-presentation-state`（保留不删除，作为备份）
- **迁移方式**：`src/main.tsx` 中 React 渲染之前同步执行 `migrateStorageKey()`
- **迁移逻辑**：如果新 key 无数据且旧 key 有数据 → 复制旧 key 完整内容到新 key
- **失败处理**：try-catch 包裹，迁移失败 fallback 到空初始状态，不导致崩溃
- **首页"继续编辑"**：读取新 key 数据，显示项目标题 + 幻灯片数量，点击进入编辑器

---

## 12. 当前工程命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | tsc 类型检查 + Vite 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run typecheck` | 仅 TypeScript 类型检查 |
| `npm run lint` | ESLint 检查（过渡期不强制零 warning） |
| `npm run lint:fix` | ESLint 自动修复 |
| `npm run format` | Prettier 格式检查 |
| `npm run format:fix` | Prettier 自动格式化 |

---

## 13. 当前 lint warning 数量

**0 errors, 42 warnings**（P0.5 过渡策略：不强制零 warning）

主要 warning 来源：
- `@typescript-eslint/no-explicit-any`（约 20 个，来自 useFullscreen、PropertiesPanel、模板组件、importJson 等）
- 未使用变量（约 10 个，PropertiesPanel 中未使用的类型 import 等）
- `react-hooks/exhaustive-deps`（约 3 个）
- `@typescript-eslint/no-unused-vars`（约 9 个）

P1 阶段计划逐步收紧。

---

## 14. 当前还没做的功能

以下全部为 **未实现**：

- ❌ 撤销/重做（Toolbar 有按钮但未连接 store）
- ❌ 元素样式编辑（字体、颜色、大小、对齐选择器）
- ❌ 元素拖拽移动/缩放（自由画布）
- ❌ PDF 导出
- ❌ PPTX 导出
- ❌ 图片导出
- ❌ 图片本地上传（仅 URL 输入）
- ❌ 视频/音频嵌入
- ❌ 多项目管理（当前单项目）
- ❌ 演示者视图（双屏）
- ❌ 编辑器内动画预览（仅全屏演示有动画）
- ❌ 用户自定义模板
- ❌ 暗色模式
- ❌ 移动端响应式布局
- ❌ AI 生成幻灯片
- ❌ 多人协作
- ❌ 404 页面 / 错误边界
- ❌ 测试框架（零测试）
- ❌ HTML 消毒（DOMPurify 未引入，但 iframe sandbox 已收紧）
- ❌ 国际化（字符串硬编码中文）

---

## 15. 当前最近 6 个 commit

```
3c6635b 修好 P0.5 的导入校验和 HTML 导出安全细节
cedd543 补齐 typecheck/lint/format 工程规范命令，配置 ESLint 和 Prettier，修复 iframe 安全沙箱
3902c12 增加 JSON 导出导入功能：导出完整项目为 .json，从 .json 导入含 schema 校验
ea5b7f3 迁移 localStorage key 到 html-slide-editor-state，兼容旧数据；首页增加继续编辑入口和 JSON 导入按钮
8c90468 收敛类型模型：修正 Presentation.slides any[] 类型为 Slide[]，新增 schemaVersion 字段
b97cefe 校正项目定位：把所有用户可见文案从"口播视频演示"改为"HTML Slide Editor"
```

---

## 16. 下一阶段建议（P1 候选）

按优先级排序：

1. **撤销/重做** — 在 `useEditorStore` 中实现命令历史栈，连接 Toolbar 按钮。这是编辑器基本体验的缺失。
2. **元素样式编辑** — PropertiesPanel 增加字体、颜色、字号、对齐选择器，让用户可调整元素视觉样式。
3. **HTML 消毒** — 引入 DOMPurify，在 HTML 导入时对内容消毒。当前 iframe sandbox 收紧已降低风险，但不是根治。
4. **演示者视图** — 双屏支持：一台显示幻灯片、一台显示演讲备注和计时器。
5. **多项目管理** — 首页支持多个项目的列表、重命名、删除。
6. **PDF 导出** — 引入 html2canvas + jspdf 或类似方案。
7. **收紧 lint** — 在 P1 末尾启用 `--max-warnings 0`。
8. **引入 Vitest** — 建立测试基础设施，为核心 store 和工具函数编写测试。
