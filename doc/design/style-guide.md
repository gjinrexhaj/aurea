# Aurea: CSS Style Guide & Design System

## Overview & Principles

Aurea is a precise geometric construction workbench. Its visual system reflects mathematical clarity, structural elegance, and architectural minimalism.

- **Precision & Geometry**: Crisp 1px borders, subtle opacity layering, and consistent 3px/5px border radii.
- **Dual-Theme Support**: Seamless, high-contrast light and dark mode palettes designed specifically for complex geometric CAD-like workflows.
- **Functional Typography**: Triple-font stack pairing display headings (`Space Grotesk`), clean interface body text (`IBM Plex Sans`), and tabular code/coordinates (`IBM Plex Mono`).
- **Predictable Token Hierarchy**: CSS custom properties scoped for editor panels (`--editor-*`), landing experience (`--landing-page-*`), and documentation pages (`--*`).

---

## Typography

Aurea uses three Google Fonts: **Space Grotesk** for display headings, **IBM Plex Sans** for body and interface UI, and **IBM Plex Mono** for code, coordinates, buttons, and tabular data.

### Font Stack

| Role          | Font Family                                       | Weights       | Token / Usage                                                                                       |
| :------------ | :------------------------------------------------ | :------------ | :-------------------------------------------------------------------------------------------------- |
| **Display**   | `'Space Grotesk', sans-serif`                     | 500, 600, 700 | `--editor-font-display` — Page titles, section headings, dialog titles, stat numbers, window titles |
| **Body / UI** | `'IBM Plex Sans', sans-serif`                     | 400, 500, 600 | `--editor-font-body` — Interface labels, descriptive text, modal copy, form controls                |
| **Monospace** | `'IBM Plex Mono', monospace`                      | 400, 500, 600 | `--editor-font-mono` — Toolbar buttons, tab items, logs, coordinate inputs, badges, code            |
| **Button**    | `'IBM Plex Sans', sans-serif` / `'IBM Plex Mono'` | 500, 600      | `--editor-font-button` — UI action buttons and controls                                             |

### Font Hierarchy & Scale

| Style / Level                | Size                         | Weight    | Line Height | Letter Spacing                | Font Family          |
| :--------------------------- | :--------------------------- | :-------- | :---------- | :---------------------------- | :------------------- |
| **Display Heading (H1)**     | `clamp(2.4rem, 5vw, 3.6rem)` | 700       | 1.05        | `-0.01em`                     | Space Grotesk        |
| **Section Heading (H2)**     | `clamp(1.6rem, 3vw, 2.2rem)` | 600       | 1.10        | `-0.01em`                     | Space Grotesk        |
| **Panel / Subsection (H3)**  | `17px` / `1.1rem`            | 600       | 1.25        | normal                        | Space Grotesk        |
| **Dialog / Card Title**      | `14px`–`15px`                | 600       | 1.25        | normal                        | Space Grotesk        |
| **Lead / Subtitle**          | `17px`                       | 400       | 1.55        | normal                        | IBM Plex Sans        |
| **Base Body Text**           | `16px` (1rem)                | 400       | 1.55        | normal                        | IBM Plex Sans        |
| **Small Body / Description** | `14.5px` (0.906rem)          | 400       | 1.50        | normal                        | IBM Plex Sans        |
| **UI Form / Dialog Text**    | `0.85rem`–`0.95rem`          | 400 / 500 | 1.45        | normal                        | IBM Plex Sans        |
| **Navigation / Tab Links**   | `12px`                       | 500 / 600 | 1.00        | `0.06em` (uppercase)          | IBM Plex Mono        |
| **Button (Standard / CTA)**  | `13px`                       | 600       | 1.00        | `0.06em` (uppercase)          | IBM Plex Mono        |
| **Toolbar / Tool Button**    | `0.75rem` (12px)             | 500       | 1.10        | `0.03em`–`0.04em` (uppercase) | IBM Plex Mono        |
| **Console & Code Blocks**    | `0.85rem`                    | 400 / 500 | 1.45        | normal                        | IBM Plex Mono        |
| **Inline Code**              | `0.75rem`                    | 400 / 500 | 1.00        | `0.04em`                      | IBM Plex Mono        |
| **Badge / Radius Pill**      | `0.72rem`                    | 600       | 1.00        | normal                        | IBM Plex Mono        |
| **Eyebrow / Metadata**       | `12px`                       | 400 / 500 | 1.00        | `0.14em` (uppercase)          | IBM Plex Mono        |
| **Micro Text / Timestamp**   | `11px` (0.68–0.72rem)        | 400       | 1.20        | normal                        | IBM Plex Mono / Sans |

### Global Font Properties

- **Base font size**: `16px`
- **Base line height**: `1.55`
- **Text rendering**: `optimizeLegibility`
- **Font smoothing**: `-webkit-font-smoothing: antialiased`
- **Box sizing**: `border-box` applied to all elements

---

## Colors & Theme Tokens

Aurea features a dual-theme architecture (Light Mode and Dark Mode). All theme-dependent styles consume CSS custom properties defined on the root or app container (`.app` and `.app.app-dark`).

### Theme Token Mapping (Light vs Dark)

| Custom Property            | Light Mode Value         | Dark Mode Value (`.app-dark`) | Description & Semantic Usage                               |
| :------------------------- | :----------------------- | :---------------------------- | :--------------------------------------------------------- |
| `--editor-bg`              | `#ffffff`                | `#15181e`                     | Base app background, canvas outer, outer layout            |
| `--editor-bg-raised`       | `#ffffff`                | `#1d222b`                     | Raised panel surfaces, cards, tabs, modal surfaces         |
| `--editor-bg-sunken`       | `#ffffff`                | `#11141a`                     | Sunken canvas viewport, deeply recessed wells              |
| `--editor-border`          | `rgba(58, 58, 58, 0.18)` | `rgba(208, 216, 233, 0.22)`   | Primary element borders (panels, dialogs, buttons)         |
| `--editor-border-soft`     | `rgba(58, 58, 58, 0.10)` | `rgba(208, 216, 233, 0.12)`   | Subtle splitters, swatch borders, list dividers            |
| `--editor-ink`             | `#000000`                | `#eef2fb`                     | Primary text, titles, high-contrast values                 |
| `--editor-ink-dim`         | `#3a3a3a`                | `#c2cce0`                     | Secondary text, descriptions, inactive tab labels          |
| `--editor-ink-faint`       | `#707070`                | `#92a1bc`                     | Muted labels, timestamps, placeholder text, units          |
| `--editor-accent`          | `#017dd3`                | `#63b3ff`                     | Primary interactive accent (active states, links, CTAs)    |
| `--editor-accent-soft`     | `#c7e8ff`                | `rgba(99, 179, 255, 0.25)`    | Soft accent tint (badges, hover backgrounds, active pills) |
| `--editor-tab-selected-bg` | `#eef6ff`                | `rgba(99, 179, 255, 0.16)`    | Selected tab container background                          |

### Interaction & Surface States

| State / Pattern            | Light Mode Value                   | Dark Mode Value                       | Usage                                              |
| :------------------------- | :--------------------------------- | :------------------------------------ | :------------------------------------------------- |
| **Text Selection**         | `background: #017dd3; color: #fff` | `background: #63b3ff; color: #11141a` | Text highlight selection                           |
| **Focus Visible Outline**  | `2px solid #017dd3; offset: 3px`   | `2px solid #63b3ff; offset: 3px`      | Accessible keyboard focus indicator                |
| **Interactive Hover Tint** | `rgba(1, 125, 211, 0.04)`          | `rgba(99, 179, 255, 0.12)`            | Button, swatch, and link hover fill                |
| **Highlight Card Tint**    | `rgba(1, 125, 211, 0.03)`          | `rgba(99, 179, 255, 0.12)`            | Master sections, file export card, special notices |
| **Highlight Card Border**  | `rgba(1, 125, 211, 0.18)`          | `rgba(99, 179, 255, 0.42)`            | Accent-bordered highlighted cards                  |
| **Window Header Drag Bar** | `rgba(1, 125, 211, 0.06)`          | `rgba(99, 179, 255, 0.14)`            | Window shell draggable title bar                   |
| **Window Resize Handles**  | `rgba(1, 125, 211, 0.16)`          | `rgba(99, 179, 255, 0.35)`            | Corner drag grips (border `rgba(1,125,211,0.28)`)  |
| **Tabset Header Fill**     | `rgba(255, 255, 255, 0.92)`        | `rgba(21, 24, 30, 0.96)`              | FlexLayout docked tab header row                   |
| **Modal Backdrop**         | `rgba(0, 0, 0, 0.18)`              | `rgba(0, 0, 0, 0.55)`                 | Dialog modal dimming backdrop                      |
| **Splitter Hover**         | `var(--editor-accent-soft)`        | `rgba(99, 179, 255, 0.25)`            | FlexLayout pane resize splitter hover              |

### Canvas Geometry & Layer Colors

Aurea separates geometric figures into two distinct visual layers: **Graphite** (construction geometry) and **Ink** (final rendered geometry), alongside axes and infinite auxiliary lines.

| Geometric Entity   | Layer                   | Light Mode RGBA / Hex                | Dark Mode RGBA / Hex                 | Notes                          |
| :----------------- | :---------------------- | :----------------------------------- | :----------------------------------- | :----------------------------- |
| **Point**          | Graphite (Construction) | `rgba(150, 150, 150, 1)` (`#969696`) | `rgba(95, 95, 95, 1)` (`#5f5f5f`)    | Auxiliary construction point   |
| **Point**          | Ink (Final)             | `rgba(0, 0, 0, 1)` (`#000000`)       | `rgba(255, 255, 255, 1)` (`#ffffff`) | Primary inked point            |
| **Circle**         | Graphite (Construction) | `rgba(211, 211, 211, 1)` (`#d3d3d3`) | `rgba(95, 95, 95, 1)` (`#5f5f5f`)    | Auxiliary construction circle  |
| **Circle**         | Ink (Final)             | `rgba(0, 0, 0, 1)` (`#000000`)       | `rgba(255, 255, 255, 1)` (`#ffffff`) | Primary inked circle stroke    |
| **Line**           | Graphite (Construction) | `rgba(211, 211, 211, 1)` (`#d3d3d3`) | `rgba(95, 95, 95, 1)` (`#5f5f5f`)    | Auxiliary construction segment |
| **Line**           | Ink (Final)             | `rgba(0, 0, 0, 1)` (`#000000`)       | `rgba(255, 255, 255, 1)` (`#ffffff`) | Primary inked line segment     |
| **Axes**           | Canvas Background       | `rgba(204, 204, 204, 1)` (`#cccccc`) | `rgba(75, 75, 75, 1)` (`#4b4b4b`)    | Coordinate X/Y reference axes  |
| **Infinite Lines** | Auxiliary Ray/Line      | `rgba(211, 211, 211, 1)` (`#d3d3d3`) | `rgba(95, 95, 95, 1)` (`#5f5f5f`)    | Unbounded infinite guide lines |

### Landing Page Palette (`--landing-page-*`)

The landing page provides marketing and conceptual introductions with scoped tokens matching the core design system:

| Custom Property                    | Value                    | Role                                      |
| :--------------------------------- | :----------------------- | :---------------------------------------- |
| `--landing-page-bg`                | `#ffffff`                | Background base                           |
| `--landing-page-bg-raised`         | `#ffffff`                | Card surfaces                             |
| `--landing-page-bg-sunken`         | `#ffffff`                | Well surfaces                             |
| `--landing-page-ink`               | `#000000`                | Display headings & primary copy           |
| `--landing-page-ink-dim`           | `#3a3a3a`                | Body copy & section descriptions          |
| `--landing-page-ink-faint`         | `#707070`                | Eyebrow labels & captions                 |
| `--landing-page-construction`      | `#017dd3`                | Primary accent, CTAs, focus outlines      |
| `--landing-page-construction-soft` | `#c7e8ff`                | Soft pill backgrounds, active state fills |
| `--landing-page-border`            | `rgba(58, 58, 58, 0.18)` | Standard card/section borders             |
| `--landing-page-border-soft`       | `rgba(58, 58, 58, 0.10)` | Subtle dividers and grid card borders     |
| `--landing-page-grid-line`         | `rgba(58, 58, 58, 0.06)` | 28px background blueprint grid lines      |

### Log Level & Status Colors

Used across the Console panel, status bars, and manual alerts:

| Level / Status     | Text Color                                      | Soft Background             | Border / Accent             | Usage                                     |
| :----------------- | :---------------------------------------------- | :-------------------------- | :-------------------------- | :---------------------------------------- |
| **Log / Default**  | `var(--editor-ink-dim)` (`#3a3a3a` / `#c2cce0`) | `transparent`               | `var(--editor-border-soft)` | Standard diagnostic log messages          |
| **Info**           | `var(--editor-accent)` (`#017dd3` / `#63b3ff`)  | `var(--editor-accent-soft)` | `var(--editor-accent)`      | Informational logs, info callout banners  |
| **Warn / Warning** | `#b7791f` (Amber)                               | `#fff3cd` (Amber tint)      | `#b7791f`                   | Warnings, non-fatal operational cautions  |
| **Error / Danger** | `#c53030` / message `#9b2c2c` (Red)             | `rgba(197, 48, 48, 0.10)`   | `#c53030`                   | Execution failures, syntax errors, alerts |

---

## Spacing, Sizing & Radii Scale

Aurea adheres strictly to an 8px base rhythm with 3px/5px corner radiuses and subtle elevation shadows.

### Border Radius Tokens

| Token                 | Value   | Target UI Elements                                                                  |
| :-------------------- | :------ | :---------------------------------------------------------------------------------- |
| `--editor-radius-s`   | `3px`   | Small buttons, text inputs, swatches, stepper controls, preset chips, code tags     |
| `--editor-radius-m`   | `5px`   | Panels, card containers, dialog modals, floating window shells, tabs, alert banners |
| **Pill (Full Round)** | `999px` | Badges, radius counter pills, status indicators                                     |

### Spacing Scale

| Value           | Usage Context                                                                             |
| :-------------- | :---------------------------------------------------------------------------------------- |
| **2px / 3px**   | Inline tag padding, stepper inner button padding, segmented target gap                    |
| **4px**         | Button vertical padding (toolbar/footer), history list item vertical spacing, preset gap  |
| **6px / 8px**   | Base grid unit, toolbar button padding (`4px 8px`), toggle gaps, section inner gaps       |
| **10px**        | Panel section inner padding (`10px`), layout gap between cards, swatch gap                |
| **12px**        | Window shell padding, modal padding, navigation tab horizontal padding, modal element gap |
| **14px**        | Sticky navigation vertical padding (`14px 32px`), card text padding                       |
| **16px**        | Code block padding (`16px`), alert banner padding, grid gap                               |
| **20px**        | Card padding, gallery gap, manual container paragraph bottom margin                       |
| **24px**        | Modal container backdrop padding, manual sidebar padding                                  |
| **32px**        | Section horizontal padding, page container wrap margin                                    |
| **40px / 60px** | Manual content container padding (`40px 60px`)                                            |
| **56px**        | Landing page hero and history two-column grid gaps                                        |
| **96px**        | Major landing page vertical section padding                                               |

### Elevation & Box Shadows

| Level / Surface              | Shadow Value (Light Mode)           | Shadow Value (Dark Mode)             | Purpose                                     |
| :--------------------------- | :---------------------------------- | :----------------------------------- | :------------------------------------------ |
| **Panel / Card Surface**     | `0 1px 3px rgba(0, 0, 0, 0.06)`     | `0 1px 4px rgba(0, 0, 0, 0.24)`      | Subtle lift for docked panels and cards     |
| **Floating Window Shell**    | `0 2px 10px rgba(0, 0, 0, 0.10)`    | `0 4px 16px rgba(0, 0, 0, 0.40)`     | Absolute-positioned floating tool windows   |
| **Canvas Floating Tool**     | `0 2px 6px rgba(0, 0, 0, 0.16)`     | `0 2px 8px rgba(0, 0, 0, 0.32)`      | Floating canvas buttons (e.g. Reset Camera) |
| **Active Button Glow**       | `0 1px 3px rgba(1, 125, 211, 0.18)` | `0 1px 4px rgba(99, 179, 255, 0.30)` | Active tool button state                    |
| **Modal / Dialog Elevation** | `0 12px 32px rgba(0, 0, 0, 0.16)`   | `0 16px 40px rgba(0, 0, 0, 0.60)`    | Center-staged confirm & color dialogs       |

### Custom Scrollbars

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Firefox Fallback */
@supports not selector(::-webkit-scrollbar) {
  * {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 rgba(0, 0, 0, 0.05);
  }
}
```

In dark mode, scrollbar thumbs blend smoothly against dark surfaces:

- Track: `rgba(255, 255, 255, 0.04)`
- Thumb: `#3a4454` (Hover: `#505c70`)

---

## UI Components & Design Patterns

### 1. Buttons

Aurea defines standard variants for landing/manual layouts and compact variants for workspace panels.

| Button Type                | Typography                                    | Padding                | Border & Radius                                     | Visual Style                                                                               |
| :------------------------- | :-------------------------------------------- | :--------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **Primary CTA**            | IBM Plex Mono, 13px, 600, uppercase, `0.06em` | `12px 20px`            | `1px solid var(--editor-accent)`, radius `3px`      | Background `var(--editor-accent)`, text `#ffffff`                                          |
| **Default / Secondary**    | IBM Plex Mono, 13px, 600, uppercase, `0.06em` | `12px 20px`            | `1px solid var(--editor-border)`, radius `3px`      | Background `var(--editor-bg)`, text `var(--editor-ink)`                                    |
| **Ghost / Tertiary**       | IBM Plex Mono, 0.75rem, uppercase             | `4px 8px`              | `none`, radius `3px`                                | Background `transparent`, text `var(--editor-ink-dim)`, hover accent                       |
| **Toolbar Tool Button**    | IBM Plex Mono, 0.75rem, uppercase, `0.03em`   | `4px 8px`              | `1px solid var(--editor-border)`, radius `3px`      | Background `var(--editor-bg-raised)`, text `var(--editor-ink)`                             |
| **Active Tool Button**     | IBM Plex Mono, 0.75rem, uppercase, `0.03em`   | `4px 8px`              | `1px solid var(--editor-accent)`, radius `3px`      | Background `var(--editor-accent)`, text `#ffffff`, shadow `0 1px 3px rgba(1,125,211,0.18)` |
| **Panel Action / Reset**   | IBM Plex Mono, 0.75rem, uppercase, `0.04em`   | `4px 8px` / full width | `1px solid var(--editor-border)`, radius `3px`      | Background `var(--editor-bg-raised)`, hover border & text accent                           |
| **Radius Stepper Button**  | IBM Plex Mono, 0.75rem, bold                  | `3px 6px`              | `none` (inside container)                           | Background `rgba(1,125,211,0.04)`, hover `rgba(1,125,211,0.08)`                            |
| **Preset Chip**            | IBM Plex Mono, 0.75rem                        | `1px 5px`              | `1px solid var(--editor-border-soft)`, radius `3px` | Background `var(--editor-bg)`, active fill `var(--editor-accent)` + white text             |
| **Theme Toggle Button**    | IBM Plex Mono, 12px, 500, uppercase, `0.06em` | `6px 10px`             | `1px solid var(--editor-border)`, radius `3px`      | Active state uses accent text & border with `rgba(1,125,211,0.08)` fill                    |
| **Canvas Floating Button** | IBM Plex Mono, 0.68rem, uppercase, `0.04em`   | `7px 10px`             | `1px solid var(--editor-border)`, radius `3px`      | Position absolute `(12px, 12px)`, shadow `0 2px 6px rgba(0,0,0,0.16)`                      |

### 2. Form Inputs & Controls

- **Text & Search Input**:
  - Height / Padding: `10px 12px` (standard) or `7px 8px` (dialogs)
  - Typography: `IBM Plex Mono` / `IBM Plex Sans` `0.9rem`
  - Border: `1px solid var(--editor-border)`, radius `3px`
  - Focus state: `outline: 2px solid var(--editor-accent); outline-offset: 3px;`
- **Radius Stepper Input Group**:
  - Container: `border: 1px solid var(--editor-border); border-radius: 3px; overflow: hidden;`
  - Number input: `width: 44px; border: none; text-align: center; font-size: 0.75rem;`
  - Steppers: `+` / `-` buttons on either side with hover accent.
- **Range Slider**:
  - `accent-color: var(--editor-accent);`
  - Smooth slider track across panel width.
- **Toggle / Checkbox Item**:
  - Container label: `display: flex; gap: 8px–10px; padding: 6px 8px; border: 1px solid var(--editor-border-soft); border-radius: 5px;`
  - Checkbox element: `accent-color: var(--editor-accent);`
  - Hover highlight: `background: rgba(1, 125, 211, 0.03); border-color: var(--editor-accent-soft);`
- **Master Toggle Label**:
  - Enlarged check box (`transform: scale(1.15)`), padding `8px 10px`, accent border `rgba(1, 125, 211, 0.18)` (or `rgba(99, 179, 255, 0.42)` in dark mode).

### 3. Surface Cards & Panels

- **Standard Section Card (`.snap-section`, `.file-section`, `.colors-section`)**:
  - Background: `var(--editor-bg-raised)`
  - Border: `1px solid var(--editor-border)`
  - Border radius: `5px` (`--editor-radius-m`)
  - Padding: `10px`
  - Box shadow: `0 1px 3px rgba(0, 0, 0, 0.06)`
  - Header: `Space Grotesk`, `13px`–`14px`, `font-weight: 600`, color `var(--editor-ink)`
- **Highlight Card / Master Section (`.snap-master-section`, `.file-export-card`)**:
  - Light mode: `background: rgba(1, 125, 211, 0.03); border-color: rgba(1, 125, 211, 0.18);`
  - Dark mode: `background: rgba(99, 179, 255, 0.12); border-color: rgba(99, 179, 255, 0.42);`
- **Color Swatch Card (`.color-swatch`)**:
  - Layout: Vertical stack, `padding: 8px; gap: 8px;`
  - Border: `1px solid var(--editor-border-soft); border-radius: 3px;`
  - Swatch Preview Box: `height: 22px; border: 1px solid var(--editor-border-soft); border-radius: 3px;`
  - Label: `0.82rem`, weight 500 (`var(--editor-ink)`); Value: `0.72rem`, mono (`var(--editor-ink-faint)`).
- **Stat Metric Grid (`.file-stat-grid`)**:
  - Grid: `grid-template-columns: repeat(3, 1fr); gap: 8px;`
  - Value: `Space Grotesk`, `1.1rem`, weight 600 (`var(--editor-ink)`)
  - Label: `0.72rem`, color `var(--editor-ink-faint)`.
- **Document / Code Viewer (`.file-document-content`)**:
  - Height: `220px` (min `120px`, `resize: vertical;`)
  - Typography: `IBM Plex Mono`, `0.7rem`, `line-height: 1.45; white-space: pre-wrap;`
  - Floating pill: Autoscroll toggle positioned at bottom-right `(8px, 8px)`.

### 4. Windows, Modals & Docking Layout

- **FlexLayout Tabset**:
  - Tab Button: `IBM Plex Mono`, `12px`, uppercase, `letter-spacing: 0.06em; padding: 8px 14px;`
  - Unselected: color `var(--editor-ink-dim)`; Selected: color `var(--editor-accent)`, bottom border `2px solid var(--editor-accent)`, bg `var(--editor-tab-selected-bg)`.
  - Tabset header: `rgba(255, 255, 255, 0.92)` (Light) / `rgba(21, 24, 30, 0.96)` (Dark).
  - Splitter bar: `var(--editor-border-soft)`, expands/highlights to `var(--editor-accent-soft)` on hover.
- **Floating Window Shell (`.window-shell`)**:
  - Position: `absolute; z-index: 1000; padding: 12px; gap: 10px;`
  - Surface: `background: rgba(255, 255, 255, 0.96); border: 1px solid var(--editor-border); border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);`
  - Header: `margin: -4px -4px 0; padding: 3px 5px; background: rgba(1, 125, 211, 0.06); border: 1px solid rgba(1, 125, 211, 0.12); border-radius: 3px;`
  - Title: `Space Grotesk`, `13px`, weight 600.
  - Collapse Button: `IBM Plex Mono`, `10px`, uppercase.
  - Resize Grips: 4 corners, `14px x 14px`, `background: rgba(1, 125, 211, 0.16); border: 1px solid rgba(1, 125, 211, 0.28); border-radius: 3px;`
- **Modal Dialog (`.confirm-dialog`, `.color-modal`, `.file-dialog`)**:
  - Backdrop: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.18); z-index: 2000; padding: 24px;`
  - Shell: `width: min(360px, calc(100vw - 48px)); padding: 12px; gap: 12px; border-radius: 5px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);`
  - Title: `Space Grotesk`, `15px`, weight 600.
  - Actions: Right-aligned button group (Cancel / Close vs Confirm / Save / Reset).

---

## Layout & Blueprint Grid Systems

### Editor Viewport Shell

```css
.app {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--editor-bg);
  color: var(--editor-ink);
}
```

### Blueprint Grid Patterns

1. **Hero & Canvas Reference Grid**:
   - `background-size: 20px 20px;`
   - Gradient lines: `rgba(1, 125, 211, 0.12)` (Light) or `rgba(99, 179, 255, 0.18)` (Dark)
2. **Page Background Blueprint Grid**:
   - `background-size: 28px 28px;`
   - Gradient lines: `rgba(58, 58, 58, 0.06)` (Light) or `rgba(208, 216, 233, 0.07)` (Dark)

### Navigation Bar

- Sticky header with `position: sticky; top: 0; z-index: 100; backdrop-filter: blur(8px);`
- Background: `rgba(255, 255, 255, 0.92)` (Light) / `rgba(21, 24, 30, 0.94)` (Dark)
- Border bottom: `1px solid var(--editor-border)`
- Padding: `14px 32px`
- Links: `IBM Plex Mono`, `12px`, uppercase, `0.06em` letter-spacing, with `2px` solid underline on active/hover.

### Responsive Breakpoints

| Breakpoint             | Target Screen                    | Adjustments                                               |
| :--------------------- | :------------------------------- | :-------------------------------------------------------- |
| **`max-width: 940px`** | Small Desktop / Tablet Landscape | Hero columns adjust ratio                                 |
| **`max-width: 860px`** | Tablet Portrait                  | 3-column instrument cards stack to single column          |
| **`max-width: 780px`** | Narrow Tablet                    | Gallery grid shifts from 3 columns to 2 columns           |
| **`max-width: 640px`** | Mobile Large                     | Wrap padding reduces from 32px to 20px                    |
| **`max-width: 540px`** | Mobile Portrait                  | Gallery shifts to 1 column, button groups wrap vertically |

---

## Motion, Accessibility & Dark Mode Guidelines

### Motion Scale

| Name                      | Duration | Easing          | Context                                                        |
| :------------------------ | :------- | :-------------- | :------------------------------------------------------------- |
| **`landingPageDraw`**     | `1.1s`   | `ease forwards` | SVG geometry stroke dasharray construction                     |
| **`landingPageFadeIn`**   | `0.6s`   | `ease forwards` | Hero content entry                                             |
| **Component Transitions** | `0.15s`  | `ease`          | Button, swatch, link color, background, and border transitions |
| **Fast Feedback**         | `0.10s`  | `ease`          | Preset buttons active switch                                   |

### Motion Accessibility (`prefers-reduced-motion`)

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Dark Mode Implementation Guidelines

1. **Avoid Pure Black Canvas in Sunken Areas**: Sunken canvas viewport uses `#11141a`, while raised surfaces use `#1d222b` to establish true depth and elevation.
2. **Accessible Contrast Ratios**:
   - High-contrast text (`--editor-ink`: `#eef2fb`) achieves > 14:1 contrast against `#15181e`.
   - Secondary text (`--editor-ink-dim`: `#c2cce0`) achieves > 9:1 contrast.
   - Faint text (`--editor-ink-faint`: `#92a1bc`) achieves > 4.5:1 WCAG AA contrast.
   - Accent blue (`--editor-accent`: `#63b3ff`) achieves > 7:1 contrast on dark surfaces.
3. **Tinted Alpha Borders**: Use `rgba(208, 216, 233, 0.22)` for dark mode borders rather than opaque grays, allowing background luminance to naturally soften edges.
4. **Interactive Accents**: Active selection and hover fills scale up their alpha channel in dark mode (from 3–4% to 12–16%) to preserve visibility against dark backdrops.
