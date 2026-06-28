# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (HMR on localhost:5173)
npm run build     # Type-check (tsc -b) then production build
npm run preview   # Preview production build locally
npx tsc --noEmit  # Type-check only, no emit
```

## Architecture

This is a **narration-video presentation tool** (口播视频演示) — a React SPA where users compose slides from templates, input narration text, then present fullscreen with Framer Motion animations.

### Two-store design (Zustand)

- **`useEditorStore`** (`src/store/useEditorStore.ts`) — persisted to localStorage via Zustand `persist` middleware. Holds all slide data, element CRUD, UI state. This is the single source of truth.
- **`usePresentationStore`** (`src/store/usePresentationStore.ts`) — ephemeral runtime store. Initialized from editor slides when entering presentation mode, discarded on exit. Tracks `currentIndex`, `direction` (1 forward / -1 backward), `isPlaying`.

The two are deliberately separate: presentation mutations never affect saved editor state.

### Slide data model

A `Slide` contains structured `elements[]` (each with a `type` and typed `content`), plus metadata: `templateId`, `transitionType`, `animationPreset`, `backgroundColor`, `duration`, `content` (narration text). Template components read their content by finding specific element types — e.g., `TitleSlide` looks for elements with `content.variant === 'heading'` and `'subheading'`.

### Template system (registry pattern)

`src/templates/registry.ts` — maps template ID strings to React components via a plain object. `TemplateRenderer` (the dispatch layer) calls `getTemplateComponent(slide.templateId)` and renders the result.

To add a template: (1) create the component in `src/templates/`, (2) register it in `registry.ts`, (3) add metadata to `src/data/templates.ts`, (4) add default elements to `getDefaultElementsForTemplate()` in the editor store.

All template components accept `TemplateComponentProps`: `slide`, `mode` (`'editor' | 'presentation'`), `animated` (boolean), and optional callbacks.

### Animation system (two levels)

- **Slide transitions** — applied in `PresentationView` via Framer Motion `AnimatePresence mode="wait"`. Each slide gets variants from `getSlideVariant()` which is direction-aware (reverses enter/exit when navigating backwards). Defined in `src/animations/variants.ts`.
- **Element entrances** — applied inside template components via `AnimatedElement` wrapper. Respects per-element `animation.delay`, `animation.duration`, and `animation.preset` (mapped to named variants in `elementEntrance`).

Animation presets (gentle/dramatic/stagger/smooth/reveal) bundle a default transition type + per-element-type animation configs. Defined in `src/data/animationPresets.ts`.

### Routing

Three routes via React Router v6:
- `/` — `HomePage` (landing, create new)
- `/editor/:id` — `EditorPage` → `EditorLayout` (three-column: sidebar + canvas + properties panel)
- `/present/:id` — `PresentationPage` → `PresentationLayout` (fullscreen, enters Fullscreen API on mount)

### Editor layout

Three resizable columns: **Sidebar** (w-56, slide list with `@dnd-kit` drag-to-reorder) → **Canvas** (flex-1, centered 16:9 slide frame with shadow) → **PropertiesPanel** (w-72, slide-level settings or element-level editor depending on selection).

### Design tokens

Defined in `tailwind.config.ts`. Custom colors: `surface` (warm paper `#FAFAF9`), `brand` (indigo `#6366F1`). Custom shadows: `slide`, `slide-hover`, `card`, `elevated`. Fonts: Inter + Noto Sans SC (sans), Noto Serif SC (serif). Path alias `@/` → `src/`.
