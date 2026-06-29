# HTML Slide Editor — 项目当前状态报告

> 生成日期：2026-06-29  
> 当前阶段：P2 完成（元素样式编辑基础版）  
> 建议版本标记：v0.7.0  
> 仓库：`https://github.com/DeepCloud-Yangrui/DeepCloude-html-slide-editor`

---

## 1. 当前项目定位

**HTML Slide Editor / HTML 幻灯片编辑器** — 一个用 HTML/CSS/React 动画承载的 Web 原生幻灯片编辑器。用户可以像编辑 PPT 一样编辑结构化幻灯片，底层数据是 JSON，支持导出为独立 HTML 文件和 JSON 文件。

**已完成定位校正**：所有用户可见文案已从"口播视频演示"改为 HTML Slide Editor 方向。口播内容字段已重定位为"演讲备注 / Speaker Notes"。

---

## 2. 当前已完成内容

### P0.5（项目定位校正与基础清债）
- ✅ 项目定位文案校正（首页、编辑器、演示模式、`<title>`、CLAUDE.md、bat 启动脚本）
- ✅ 类型模型收敛（`Presentation.slides: any[]` → `Slide[]`，`Slide.notes` 标记 deprecated）
- ✅ localStorage key 迁移（`narration-presentation-state` → `html-slide-editor-state`，显式复制旧 key 数据，保留旧 key 不删除）
- ✅ 首页"继续编辑"入口（读取 localStorage 显示项目标题和幻灯片数量）
- ✅ JSON 导出（编辑器 Toolbar → 下载 `.json` 文件，包含 `schemaVersion: "0.5.0"`）
- ✅ JSON 导入（首页 / 编辑器均支持，含 schema 校验、缺失字段默认值补齐、不认识的 element type 跳过不阻塞导入）
- ✅ 独立 HTML 导出雏形（静态渲染全部模板、内嵌 CSS 和翻页 JS、演讲备注 N 键切换、html 模板用 iframe sandbox="" 安全包裹）
- ✅ 工程规范命令（`typecheck` / `lint` / `format` / `build`）
- ✅ iframe sandbox 收紧（编辑器内 HTMLSlide 移除 allow-scripts）

### P1（编辑器基础安全感增强）
- ✅ 撤销 / 重做（Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y 键盘快捷键）
- ✅ 8 类结构性编辑操作 + 1 类文本内容防抖编辑操作纳入 undo
- ✅ 500ms 文本编辑防抖合并 undo 快照（连续输入不产生大量历史记录）
- ✅ 无效操作不污染 undo stack（deleteSlide 先验证 slideId 存在、duplicateSlide 先验证 index 等）
- ✅ undo/redo runtime 状态不进入 localStorage（`partialize` 排除 `_undoStack`、`_redoStack` 等）
- ✅ 删除 slide 前确认对话框（"确定要删除这张幻灯片吗？此操作可以撤销（Ctrl+Z）。"）
- ✅ JSON 导入前自动备份当前项目（HomePage 和 Toolbar 两处导入入口均已覆盖）
- ✅ 404 页面（`src/pages/NotFoundPage.tsx`，带返回首页和继续编辑按钮）
- ✅ React Error Boundary（`src/components/shared/ErrorBoundary.tsx`，class component，渲染错误时显示恢复 UI）
- ✅ lint warning 从 42 降到 25（清理 17 个低风险 warning，保留 25 个合理的 `no-explicit-any`）
- ✅ 不破坏现有 10 种模板和演示模式

### P2（元素样式编辑基础版）
- ✅ 新增 `ElementStyle` 类型（`src/types/style.ts`），`SlideElement.style` 从 `Record<string, string>` 收敛为 `ElementStyle`
- ✅ 新增样式安全 helper（`src/utils/elementStyle.ts`）：
  - `normalizeElementStyle()` — 白名单 + 逐字段校验，丢弃未知 key 和非法 value
  - `toInlineStyle()` — token 映射为 CSS 值，React 模板渲染用
  - `toInlineStyleString()` — HTML 导出用，逐字段硬编码输出，不遍历 `Object.entries`
- ✅ style 字段只允许安全 token / 安全颜色：
  - fontSize：sm / md / lg / xl / 2xl / 3xl / 4xl / 5xl
  - fontWeight：normal / medium / semibold / bold / extrabold
  - color / backgroundColor：#RGB 或 #RRGGBB
  - textAlign：left / center / right / justify
  - padding：none / sm / md / lg
  - borderRadius：none / sm / md / lg / full
- ✅ PropertiesPanel 增加元素样式编辑 UI（`StyleEditor` 子组件），支持字号、字重、文字颜色、文本对齐、背景色、内边距、圆角
- ✅ "重置样式"按钮（将 style 重置为 `{}`）
- ✅ `updateElement` 正式接入 undo/redo，style-only 更新使用 500ms debounce（避免颜色选择器产生大量 undo 历史）
- ✅ `_contentDebounceTimer` 重命名为 `_undoDebounceTimer`（统一服务文本编辑和样式编辑）
- ✅ JSON 导入时 `normalizeElementStyle(el.style)`，丢弃未知 key 和非法 value
- ✅ 9 个可视模板读取 `element.style`（html 模板不参与）
- ✅ HTML 导出支持 `element.style` 内联样式（复用 `toInlineStyleString()`，不使用 `Object.entries` 全量输出）
- ✅ iframe sandbox="" 安全逻辑保持不变，无 allow-scripts
- ✅ 不破坏现有 10 种模板和演示模式

---

## 3. 当前技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | ^18.3.0 |
| 语言 | TypeScript | ^5.5.0 |
| 构建 | Vite | ^5.4.0 |
| 动画 | Framer Motion | ^11.0.0 |
| 状态管理 | Zustand（含 persist + partialize） | ^4.5.0 |
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

四条路由（`src/App.tsx`）：

| 路径 | 页面 | 用途 |
|------|------|------|
| `/` | `HomePage` | 首页：新建 / 继续编辑 / 导入 JSON / 导入 HTML |
| `/editor/:id` | `EditorPage` | 三栏编辑器 |
| `/present/:id` | `PresentationPage` | 全屏演示播放 |
| `*` | `NotFoundPage` | 404 页面（P1 新增） |

已有 Error Boundary（`main.tsx` 包裹）。无路由守卫。

---

## 5. 当前核心目录结构

```
src/
├── types/          # 5 个文件：slide, template, animation, presentation, style（P2 新增）
├── data/           # 2 个文件：templates（10 种）、animationPresets（5 个）
├── store/          # 2 个文件：useEditorStore（持久化 + partialize）、usePresentationStore
├── hooks/          # 4 个文件：useKeyboard, useAutoPlay, useFullscreen, useSlideNavigation
├── animations/     # 2 个文件：variants, transitions
├── templates/      # 12 个文件：registry, TemplateRenderer, AnimatedElement, 10 个模板组件
├── components/
│   ├── editor/     # 9 个文件：EditorLayout, Toolbar, Sidebar, SlideList, SlideThumbnail, Canvas, PropertiesPanel, TemplatePicker, TemplateCard
│   ├── presentation/  # 6 个文件：PresentationLayout, PresentationView, AnimatedSlide, NavigationControls, ProgressBar, NarrationPanel
│   └── shared/     # 6 个文件：Button, IconButton, Modal, Tooltip, InlineText, ErrorBoundary（P1 新增）
├── pages/          # 4 个文件：HomePage, EditorPage, PresentationPage, NotFoundPage（P1 新增）
└── utils/          # 7 个文件：id, storage, htmlImporter, exportJson, importJson, exportHtml, elementStyle（P2 新增）
```

共 65 个源文件。

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

### Undo/Redo（P1 新增）
Store 内部维护 `_undoStack: Slide[][]` 和 `_redoStack: Slide[][]`（快照方式），最大 50 步。通过 `partialize` 排除出 localStorage 持久化。

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

动画系统 P0.5 和 P1 期间未做任何修改。

---

## 9. 当前 JSON 导入导出能力

### JSON 导出（`src/utils/exportJson.ts`）
- 入口：编辑器 Toolbar "导出 JSON" 按钮
- 导出完整项目数据（title、settings、slides）为 `.json` 文件
- 外层含 `schemaVersion: "0.5.0"` 和 `exportedAt`
- 不导出 UI runtime 状态
- 文件命名：`{项目标题}_{YYYY-MM-DD}.json`

### JSON 导入（`src/utils/importJson.ts`）
- 入口：首页"导入 JSON 项目"按钮 / 编辑器 Toolbar "打开 JSON" 按钮
- 导入前自动备份当前项目（P1 新增）
- 校验规则（宽松策略）：
  - `schemaVersion` 必须为 `0.5.x`
  - slides 数组允许为空
  - elements 数组允许为空
  - 不认识的 templateId → fallback 到 `'title'`
  - 不认识的 element type → 跳过该 element（`console.warn`），不阻塞导入
  - 缺失字段自动补默认值（duration→0, backgroundColor→#FAFAF9, transitionType→fade, animationPreset→gentle 等 8 个字段）
  - 拒绝含 `__proto__` / `constructor` / `prototype` 的原型污染数据
- 导入后生成新 presentationId，不覆盖当前项目路由

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
- ✅ P2 新增：`element.style` 内联样式输出（复用 `toInlineStyleString()`，不支持未知 key）
- ✅ P2 新增：stat-card 类型导出支持

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
- **partialize（P1 新增）**：仅持久化 `presentationId`, `title`, `schemaVersion`, `slides`, `settings`, `currentSlideId`。undo/redo 栈和弹窗状态不进入 localStorage
- **首页"继续编辑"**：读取新 key 数据，显示项目标题 + 幻灯片数量，点击进入编辑器

---

## 12. 当前撤销/重做能力（P1 新增）

- 键盘快捷键：Ctrl+Z（撤销）/ Ctrl+Shift+Z 或 Ctrl+Y（重做）
- Toolbar 按钮已连接 store，栈空时禁用
- 纳入 undo 的操作：
  - 结构性编辑：addSlide、deleteSlide、duplicateSlide、moveSlide、changeSlideTemplate、updateSlideField（非 content 字段）、addElement、deleteElement
  - 文本内容编辑：updateElementContent（500ms 防抖合并快照）
  - 样式编辑：updateElement（style-only 更新使用 500ms debounce，P2 新增）
- `_undoDebounceTimer` 统一服务文本编辑和样式编辑（P2 重命名）
- 最大历史步数：50
- 无效操作不污染 undo stack：各 action 先验证操作有效性再 push 快照
- 刷新页面后 undo/redo 栈清空（不持久化）

---

## 13. 当前工程命令

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

## 14. 当前工程命令验证结果

| 命令 | 结果 |
|------|------|
| `npm run typecheck` | ✅ 零错误 |
| `npm run lint` | ✅ 0 errors, 25 warnings |
| `npm run format` | ✅ 通过 |
| `npm run build` | ✅ 通过 |

---

## 15. 当前 lint warning 数量

**0 errors, 25 warnings**（P1 从 42 降到 25）

剩余 25 个 warning 全部为 `@typescript-eslint/no-explicit-any`，分布在：
- `useFullscreen.ts`（10 个，浏览器 fullscreen API 类型兼容，合理）
- `PropertiesPanel.tsx`（3 个，动态 content 字段访问，合理）
- `useEditorStore.ts`（4 个，`getDefaultContent` 返回 any 是设计选择）
- 模板组件 `getIcon`（4 个，lucide-react 动态导入）
- `importJson.ts`（2 个，JSON 校验需要 any）
- 其他（2 个）

P2 阶段计划逐步收紧。

---

## 16. 当前还没做的功能

以下全部为 **未实现**：

- ❌ 自由拖拽 / 缩放（自由画布）
- ❌ 图层面板
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
- ❌ 测试框架（零测试）
- ❌ HTML 消毒（DOMPurify 未引入，但 iframe sandbox 已收紧）
- ❌ 国际化（字符串硬编码中文）
- ❌ lint 仍有 25 warnings（全部 `no-explicit-any`）

---

## 17. 当前最近 commit（P2 相关）

```
58bc6fd HTML 导出支持 element.style 内联样式
e949f96 补齐可视模板中遗漏的 element.style 渲染点
faff511 所有可视模板支持 element.style 渲染，样式变更接入 undo
cdec80e 修复 P2 样式相关文件的格式问题
b3d4182 补齐样式面板的 4xl 和 5xl 字号选项
ad6d899 PropertiesPanel 增加元素样式编辑 UI
e7f0162 修正样式 helper 的颜色校验和防御式规范化
3841faa 定义 ElementStyle 类型和样式安全 helper
```

---

## 18. 下一阶段建议（P3 候选）

**P3 建议做"自由画布与元素布局基础版"**，不要直接跳 PDF/PPTX 或 AI：

1. **自由画布编辑器** — 元素位置 x/y、宽高、拖拽移动、缩放、基础图层顺序、selected element 边框与控制点
2. **HTML 消毒** — 引入 DOMPurify，在 HTML 导入时对内容消毒
3. **多项目管理** — 首页支持多个项目的列表、重命名、删除
4. **演示者视图** — 双屏支持：一台显示幻灯片、一台显示演讲备注和计时器
5. **PDF 导出** — 引入 html2canvas + jspdf 或类似方案
6. **收紧 lint** — 逐步清理 `no-explicit-any`，最终启用 `--max-warnings 0`
7. **引入 Vitest** — 建立测试基础设施，为核心 store 和工具函数编写测试

P3 暂时不包含：PDF/PPTX、AI、多人协作、复杂主题系统。
