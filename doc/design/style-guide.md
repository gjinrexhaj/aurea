# Aurea: CSS Style Guide & Design System

> **Source of truth.** If the code and this document disagree, the code is the
> bug. Every value in this guide is verified against `src/`.
> Last reconciled: CSS audit remediation pass.

## Overview & Principles

Aurea is a precise geometric construction workbench. Its visual system reflects mathematical clarity, structural elegance, and architectural minimalism.

- **Precision & Geometry**: Crisp 1px borders, subtle opacity layering, and consistent 3px/5px border radii.
- **Dual-Theme Support**: Seamless, high-contrast light and dark mode palettes designed specifically for complex geometric CAD-like workflows.
- **Functional Typography**: Triple-font stack pairing display headings (`Space Grotesk`), clean interface body text (`IBM Plex Sans`), and tabular code/coordinates (`IBM Plex Mono`).
- **Predictable Token Hierarchy**: Two tiers.
  - `--editor-*` — the editor shell's theme palette (surfaces, ink, accent, radii, fonts), declared on `.app`.
  - `--ui-*` — **theme-agnostic semantic tokens** (hover fills, status colours, elevation, scrollbar chrome, selection) declared on `:root` and flipped by any `.app-dark` ancestor. Component CSS must consume these, not literal `rgba()` values.

### CSS Architecture

| Layer             | File(s)                                               | Owns                                                                           |
| :---------------- | :---------------------------------------------------- | :----------------------------------------------------------------------------- |
| **Tokens + base** | `src/global.css`                                      | `--ui-*` tokens, reset, selection, focus ring, scrollbars, reduced motion      |
| **Page shell**    | `EditorPage.css`, `ManualPage.css`, `LandingPage.css` | Page-scoped palettes (`--editor-*`, `--landing-page-*`) and page layout        |
| **Component**     | `src/ui/*.css`                                        | One stylesheet per component, consuming tokens                                 |
| **Shared set**    | `src/ui/Dialog.css`                                   | The one chrome shared by ≥2 components (dialog backdrop/shell/actions/buttons) |

Fonts are loaded **once** from `index.html` via `<link>` + `preconnect`. No CSS file may `@import` a webfont. See [Guardrails](#css-pitfalls--guardrails) §1.

---

## Typography

Aurea uses three Google Fonts: **Space Grotesk** for display headings, **IBM Plex Sans** for body and interface UI, and **IBM Plex Mono** for code, coordinates, buttons, and tabular data.

### Loaded Weights — the hard ceiling

| Family          | Loaded weights | Max usable | Note                                           |
| :-------------- | :------------- | :--------- | :--------------------------------------------- |
| `Space Grotesk` | 500, 600, 700  | **700**    | Display headings only                          |
| `IBM Plex Sans` | 400, 500, 600  | **600**    | `font-weight: bold` (700) is **not available** |
| `IBM Plex Mono` | 400, 500, 600  | **600**    | `font-weight: bold` (700) is **not available** |

Requesting `700` from a Plex family makes the browser **synthetically faux-bold** the 600 face, which renders heavier and blurrier than a real 700. Use `600`.

### Font Stack

| Role          | Font Family                                       | Weights       | Token / Usage                                                                                       |
| :------------ | :------------------------------------------------ | :------------ | :-------------------------------------------------------------------------------------------------- |
| **Display**   | `'Space Grotesk', sans-serif`                     | 500, 600, 700 | `--editor-font-display` — Page titles, section headings, dialog titles, stat numbers, window titles |
| **Body / UI** | `'IBM Plex Sans', sans-serif`                     | 400, 500, 600 | `--editor-font-body` — Interface labels, descriptive text, modal copy, form controls                |
| **Monospace** | `'IBM Plex Mono', monospace`                      | 400, 500, 600 | `--editor-font-mono` — Toolbar buttons, tab items, logs, coordinate inputs, badges, code            |
| **Button**    | `'IBM Plex Sans', sans-serif` / `'IBM Plex Mono'` | 500, 600      | `--editor-font-button` — UI action buttons and controls                                             |

> `--editor-font-button` currently resolves to `'IBM Plex Sans'`. The button token exists so this can change in one place; **no component may hard-code a button font** — every button in `src/ui/` uses `var(--editor-font-mono, …)` because all Aurea buttons are mono-uppercase.

### Font Hierarchy & Scale

Sizes are **exact**. The px column is authoritative; `rem` entries are the values written in CSS (`1rem` = `16px`).

| Style / Level                                          | CSS Value                    | ≈ px      | Weight    | Line Height | Letter Spacing                | Font Family          |
| :----------------------------------------------------- | :--------------------------- | :-------- | :-------- | :---------- | :---------------------------- | :------------------- |
| **Display Heading (H1)**                               | `clamp(2.4rem, 5vw, 3.6rem)` | 38.4–57.6 | 700       | 1.05        | `-0.01em`                     | Space Grotesk        |
| **Section Heading (H2)**                               | `clamp(1.6rem, 3vw, 2.2rem)` | 25.6–35.2 | 600       | 1.10        | `-0.01em`                     | Space Grotesk        |
| **Landing Final-CTA (H2)**                             | `clamp(1.8rem, 4vw, 2.6rem)` | 28.8–41.6 | 600       | 1.10        | `-0.01em`                     | Space Grotesk        |
| **Panel / Subsection (H3)**                            | `17px` / `1.0625rem`         | 17        | 600       | 1.25        | normal                        | Space Grotesk        |
| **Dialog / Card Title**                                | `15px` / `0.9375rem`         | 15        | 600       | 1.25        | normal                        | Space Grotesk        |
| **Section Card Header**                                | `14px` / `0.875rem`          | 14        | 600       | 1.25        | normal                        | Space Grotesk        |
| **Small Display (window/panel)**                       | `13px` / `0.8125rem`         | 13        | 600       | 1.25        | normal                        | Space Grotesk / Mono |
| **Lead / Subtitle**                                    | `17px` / `1.0625rem`         | 17        | 400       | 1.55        | normal                        | IBM Plex Sans        |
| **Base Body Text**                                     | `16px` / `1rem`              | 16        | 400       | 1.55        | normal                        | IBM Plex Sans        |
| **Small Body / Description**                           | `0.90625rem`                 | 14.5      | 400       | 1.50        | normal                        | IBM Plex Sans        |
| **Manual Nav Link / Alert Body**                       | `0.95rem`                    | 15.2      | 400/500   | 1.50        | normal                        | IBM Plex Sans / Mono |
| **Manual Sidebar / Input**                             | `0.9rem`                     | 14.4      | 400/500   | 1.50        | normal                        | IBM Plex Sans / Mono |
| **Panel Body / Console / Code**                        | `0.85rem`                    | 13.6      | 400/500   | 1.45        | normal                        | IBM Plex Mono        |
| **Compact UI (buttons, tabs, inline code, list rows)** | `0.75rem` / `12px`           | 12        | 500/600   | 1.10/1.00   | `0.02em`–`0.06em` (uppercase) | IBM Plex Mono        |
| **Navigation / Tab Links**                             | `12px`                       | 12        | 500 / 600 | 1.00        | `0.06em` (uppercase)          | IBM Plex Mono        |
| **Button (Standard / CTA)**                            | `13px`                       | 13        | 600       | 1.00        | `0.06em` (uppercase)          | IBM Plex Mono        |
| **Inline Code**                                        | `0.75rem`                    | 12        | 400 / 500 | 1.00        | `0.04em`                      | IBM Plex Mono        |
| **Badge / Pill / Stat Label**                          | `0.72rem`                    | 11.5      | 600       | 1.00        | normal                        | IBM Plex Mono        |
| **Eyebrow / Metadata**                                 | `12px`                       | 12        | 400 / 500 | 1.00        | `0.14em` (uppercase)          | IBM Plex Mono        |
| **Micro Text / Timestamp**                             | `11px` / `0.7rem`            | 11.2      | 400       | 1.20        | normal / `0.04em` (uppercase) | IBM Plex Mono        |

**11px is the floor.** Nothing ships below it. (`10px` window-collapse labels were retired.)

### Global Font Properties

- **Base font size**: `16px`
- **Base line height**: `1.55`
- **Text rendering**: `optimizeLegibility`
- **Font smoothing**: `-webkit-font-smoothing: antialiased`
- **Box sizing**: `border-box` applied to `*`, `*::before`, `*::after` (declared once in `global.css`; component files must not re-declare it)
- **Base font weight**: `400`. Never set `font-weight` on a container and expect it to cascade into controls — every control declares its own.

---

## Colors & Theme Tokens

Aurea features a dual-theme architecture (Light Mode and Dark Mode). Theme switching is **class-driven**:

| Activator                    | Used by                              |
| :--------------------------- | :----------------------------------- |
| `.app.app-dark`              | Editor page (`.app` wrapper)         |
| `body.app-dark`              | Document-level toggle (manual page)  |
| `.manual-container.app-dark` | Container-level toggle (manual page) |

Any one of them activates the **dark `--ui-*` token set** and `color-scheme: dark`.

### Theme Token Mapping (`--editor-*`, declared on `.app`)

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

### Shared Semantic Tokens (`--ui-*`, declared on `:root`)

These are **theme-aware on purpose**: each has a light and a dark value, so component CSS never needs an `.app.app-dark { … }` twin rule for colour.

| Token                        | Light Mode                  | Dark Mode                   | Usage                                                 |
| :--------------------------- | :-------------------------- | :-------------------------- | :---------------------------------------------------- |
| `--ui-hover-tint`            | `rgba(1, 125, 211, 0.04)`   | `rgba(99, 179, 255, 0.12)`  | Button / link / chip hover fill                       |
| `--ui-hover-tint-soft`       | `rgba(1, 125, 211, 0.03)`   | `rgba(99, 179, 255, 0.12)`  | Swatch / list-row / toggle-label hover fill           |
| `--ui-hover-tint-strong`     | `rgba(1, 125, 211, 0.08)`   | `rgba(99, 179, 255, 0.16)`  | "On" state fill for segmented / toggle buttons        |
| `--ui-accent-fill`           | `rgba(1, 125, 211, 0.04)`   | `rgba(99, 179, 255, 0.14)`  | Resting fill of a soft accent button (confirm, reset) |
| `--ui-accent-fill-hover`     | `rgba(1, 125, 211, 0.08)`   | `rgba(99, 179, 255, 0.22)`  | Hover fill of a soft accent button                    |
| `--ui-accent-border`         | `rgba(1, 125, 211, 0.22)`   | `rgba(99, 179, 255, 0.35)`  | Accent-tinted button border (save, export, segmented) |
| `--ui-card-tint`             | `rgba(1, 125, 211, 0.03)`   | `rgba(99, 179, 255, 0.12)`  | Highlighted card fill (master section, export card)   |
| `--ui-card-border`           | `rgba(1, 125, 211, 0.18)`   | `rgba(99, 179, 255, 0.42)`  | Highlighted card border                               |
| `--ui-header-tint`           | `rgba(1, 125, 211, 0.06)`   | `rgba(99, 179, 255, 0.14)`  | Window drag-bar fill / "prior history" row fill       |
| `--ui-header-border`         | `rgba(1, 125, 211, 0.12)`   | `rgba(99, 179, 255, 0.28)`  | Window drag-bar border                                |
| `--ui-grip-fill`             | `rgba(1, 125, 211, 0.16)`   | `rgba(99, 179, 255, 0.35)`  | Window resize grip fill                               |
| `--ui-grip-border`           | `rgba(1, 125, 211, 0.28)`   | `rgba(99, 179, 255, 0.55)`  | Window resize grip border                             |
| `--ui-grid-line`             | `rgba(1, 125, 211, 0.12)`   | `rgba(99, 179, 255, 0.18)`  | 20px hero/canvas blueprint grid lines                 |
| `--ui-accent-hover`          | `#1a8fe8`                   | `#7cc0ff`                   | Solid accent hover fill                               |
| **`--ui-on-accent`**         | **`#ffffff`**               | **`#11141a`**               | **Text/ink placed ON a solid accent fill**            |
| `--ui-header-glass`          | `rgba(255, 255, 255, 0.92)` | `rgba(21, 24, 30, 0.96)`    | Sticky nav + FlexLayout tabset header fill            |
| `--ui-surface-glass`         | `rgba(255, 255, 255, 0.96)` | `rgba(29, 34, 43, 0.96)`    | Floating window shell fill                            |
| `--ui-backdrop`              | `rgba(0, 0, 0, 0.18)`       | `rgba(0, 0, 0, 0.55)`       | Modal backdrop dimming                                |
| `--ui-overlay-fill`          | `rgba(0, 0, 0, 0.55)`       | `rgba(0, 0, 0, 0.55)`       | Inverse chip fill (canvas history indicator)          |
| `--ui-overlay-ink`           | `#ffffff`                   | `#ffffff`                   | Inverse chip ink (canvas history indicator)           |
| `--ui-scrollbar-track`       | `rgba(0, 0, 0, 0.05)`       | `rgba(255, 255, 255, 0.04)` | Scrollbar track                                       |
| `--ui-scrollbar-thumb`       | `#cbd5e0`                   | `#3a4454`                   | Scrollbar thumb                                       |
| `--ui-scrollbar-thumb-hover` | `#a0aec0`                   | `#505c70`                   | Scrollbar thumb hover                                 |
| `--ui-selection-bg`          | `#017dd3`                   | `#63b3ff`                   | Text selection background                             |
| `--ui-selection-fg`          | `#ffffff`                   | `#11141a`                   | Text selection ink                                    |

#### `--ui-on-accent` — the one rule people get wrong

The accent **inverts luminance between themes**: `#017dd3` (dark) in light mode, `#63b3ff` (light) in dark mode. White text on it therefore scores:

| Theme | Fill      | Hard-coded `#ffffff` text    | Ratio      | WCAG AA                   |
| :---- | :-------- | :--------------------------- | :--------- | :------------------------ |
| Light | `#017dd3` | `#ffffff`                    | 4.30:1     | ⚠️ marginal (needs 4.5:1) |
| Dark  | `#63b3ff` | `#ffffff`                    | **2.23:1** | ❌ **fails**              |
| Dark  | `#63b3ff` | `#11141a` (`--ui-on-accent`) | **9.2:1**  | ✅ passes                 |

**Rule:** any element that sets `background: var(--editor-accent)` / `var(--accent)` as a _solid fill_ must set `color: var(--ui-on-accent)`. Never `#ffffff`.

The light-mode 4.30:1 is a known, documented deviation: the accent is a saturated brand hue used for 12px uppercase labels, and darkening it would break the palette. Revisit if an audit requires strict AA.

### `color-scheme`

`global.css` sets `color-scheme: light` on `:root` and `color-scheme: dark` on any `.app-dark` activator. This is what makes **native** chrome follow the theme: checkboxes, `<select>` dropdowns, `<input type=number>` spinners, default scrollbar and form autofill. Without it, dark mode renders light native controls on a dark surface.

### Interaction & Surface States

| State / Pattern            | Token                                         | Usage                                                             |
| :------------------------- | :-------------------------------------------- | :---------------------------------------------------------------- |
| **Text Selection**         | `--ui-selection-bg` / `--ui-selection-fg`     | Text highlight selection                                          |
| **Focus Visible Outline**  | `2px solid var(--editor-accent); offset: 3px` | Accessible keyboard focus indicator                               |
| **Interactive Hover Tint** | `--ui-hover-tint`                             | Button, swatch, and link hover fill                               |
| **Highlight Card Tint**    | `--ui-card-tint`                              | Master sections, file export card, special notices                |
| **Highlight Card Border**  | `--ui-card-border`                            | Accent-bordered highlighted cards                                 |
| **Window Header Drag Bar** | `--ui-header-tint` / `--ui-header-border`     | Window shell draggable title bar                                  |
| **Window Resize Handles**  | `--ui-grip-fill` / `--ui-grip-border`         | Corner drag grips                                                 |
| **Tabset Header Fill**     | `--ui-header-glass`                           | FlexLayout docked tab header row                                  |
| **Modal Backdrop**         | `--ui-backdrop`                               | Dialog modal dimming backdrop                                     |
| **Splitter Hover**         | `var(--editor-accent-soft)`                   | FlexLayout pane resize splitter hover                             |
| **Text on solid accent**   | `--ui-on-accent`                              | Active tool buttons, preset chips, primary CTAs, active nav links |

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

The landing page is **deliberately self-contained**. It does **not** consume `--ui-*` or `--editor-*`, because those flip with `.app-dark` and the landing page has no dark theme — borrowing them would half-theme the page the moment `app-dark` appears on `<body>`.

| Custom Property                    | Value                           | Role                                      |
| :--------------------------------- | :------------------------------ | :---------------------------------------- |
| `--landing-page-bg`                | `#ffffff`                       | Background base                           |
| `--landing-page-bg-raised`         | `#ffffff`                       | Card surfaces                             |
| `--landing-page-bg-sunken`         | `#ffffff`                       | Well surfaces                             |
| `--landing-page-ink`               | `#000000`                       | Display headings & primary copy           |
| `--landing-page-ink-dim`           | `#3a3a3a`                       | Body copy & section descriptions          |
| `--landing-page-ink-faint`         | `#707070`                       | Eyebrow labels & captions                 |
| `--landing-page-construction`      | `#017dd3`                       | Primary accent, CTAs, focus outlines      |
| `--landing-page-construction-soft` | `#c7e8ff`                       | Soft pill backgrounds, active state fills |
| `--landing-page-border`            | `rgba(58, 58, 58, 0.18)`        | Standard card/section borders             |
| `--landing-page-border-soft`       | `rgba(58, 58, 58, 0.10)`        | Subtle dividers and grid card borders     |
| `--landing-page-grid-line`         | `rgba(58, 58, 58, 0.06)`        | 28px background blueprint grid lines      |
| `--landing-page-accent-hover`      | `#1a8fe8`                       | Solid accent hover fill                   |
| `--landing-page-on-accent`         | `#ffffff`                       | Ink on solid accent fill                  |
| `--landing-page-accent-grid-line`  | `rgba(1, 125, 211, 0.12)`       | 20px hero canvas grid lines               |
| `--landing-page-shadow-panel`      | `0 1px 3px rgba(0, 0, 0, 0.06)` | Card surface lift                         |

### Manual Page Palette

`ManualPage.css` declares short aliases **on `.manual-container`** — never on `:root`.

| Alias                       | = `--editor-*` equivalent  | Dark override                     |
| :-------------------------- | :------------------------- | :-------------------------------- |
| `--bg`                      | `--editor-bg`              | `#15181e`                         |
| `--bg-raised`               | `--editor-bg-raised`       | `#1d222b`                         |
| `--bg-sunken`               | `--editor-bg-sunken`       | `#11141a`                         |
| `--ink`                     | `--editor-ink`             | `#eef2fb`                         |
| `--ink-dim`                 | `--editor-ink-dim`         | `#c2cce0`                         |
| `--ink-faint`               | `--editor-ink-faint`       | `#92a1bc`                         |
| `--accent`                  | `--editor-accent`          | `#63b3ff`                         |
| `--accent-soft`             | `--editor-accent-soft`     | `rgba(99, 179, 255, 0.25)`        |
| `--border`                  | `--editor-border`          | `rgba(208, 216, 233, 0.22)`       |
| `--border-soft`             | `--editor-border-soft`     | `rgba(208, 216, 233, 0.12)`       |
| `--radius-s` / `--radius-m` | `--editor-radius-s` / `-m` | `3px` / `5px` (theme-independent) |

### Log Level & Status Colors

Used across the Console panel, status bars, and manual alerts.

> **Split-token rule.** Each status ships **two** values: `--ui-*-text`, which is the _accessible_ colour for the paired fill, and `--ui-*-border`, which is the _pure hue_ used for the rule/left bar. Never use the pure hue for body text.

| Level / Status          | Text (`--ui-*-text`)                                   | Soft Fill                                                                  | Border / Accent (`--ui-*-border`)                                           | Contrast on fill           |
| :---------------------- | :----------------------------------------------------- | :------------------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------------------------- |
| **Log / Default**       | `var(--editor-ink-dim)`                                | `transparent`                                                              | `var(--editor-border-soft)`                                                 | 11.4:1 light / 11.0:1 dark |
| **Info**                | `var(--editor-ink)`                                    | `var(--editor-accent-soft)`                                                | `var(--editor-accent)`                                                      | 9.5:1 dark                 |
| **Warn / Warning**      | `--ui-warn-text`: `#856404` (light) / `#e3b341` (dark) | `--ui-warn-fill`: `#fff3cd` / `rgba(227, 179, 65, 0.16)`                   | `--ui-warn-border`: `#b7791f` / `#e3b341`                                   | 5.5:1 light / 8.2:1 dark   |
| **Error / Danger**      | `--ui-danger-text`: `#c53030` / `#fc8181`              | `--ui-danger-fill`: `rgba(197, 48, 48, 0.10)` / `rgba(197, 48, 48, 0.18)`  | `--ui-danger-border`: `#c53030` / `#fc8181`                                 | 7.5:1 light / 6.4:1 dark   |
| **Danger message body** | `--ui-danger-message`: `#9b2c2c` / `#fc8181`           | —                                                                          | —                                                                           | —                          |
| **History badge**       | `--ui-badge-text`: `#a33a32` / `#e2837a`               | `--ui-badge-fill`: `rgba(163, 58, 50, 0.08)` / `rgba(226, 131, 122, 0.10)` | `--ui-badge-border`: `rgba(163, 58, 50, 0.35)` / `rgba(226, 131, 122, 0.4)` | —                          |

> ⚠️ The pure amber `#b7791f` measures only **3.3:1** on `#fff3cd` and **3.6:1** on white — both fail WCAG AA. It is now **border/accent only**. Use `#856404` for warning _text_.

---

## Spacing, Sizing & Radii Scale

Aurea adheres strictly to an 8px base rhythm with 3px/5px corner radiuses and subtle elevation shadows.

### Border Radius Tokens

| Token                 | Value   | Target UI Elements                                                                                   |
| :-------------------- | :------ | :--------------------------------------------------------------------------------------------------- |
| `--editor-radius-s`   | `3px`   | Buttons, text inputs, swatches, stepper controls, preset chips, inline code tags                     |
| `--editor-radius-m`   | `5px`   | Panels, card containers, dialog modals, floating window shells, tabs, alert banners, **code blocks** |
| **Pill (Full Round)** | `999px` | Badges, radius counter pills, status indicators                                                      |

> Code blocks (`pre`, `.manual-code`) use **radius-m**. Inline `code` uses **radius-s**. Do not mix them — an earlier revision had `pre` at 3px and `.manual-code` at 5px.

### Spacing Scale

| Value           | Usage Context                                                                                                  |
| :-------------- | :------------------------------------------------------------------------------------------------------------- |
| **2px / 3px**   | Inline tag padding, stepper inner button padding, segmented target gap                                         |
| **4px**         | Button vertical padding (toolbar/footer), history list item spacing, preset gap                                |
| **6px / 8px**   | Base grid unit, toolbar button padding (`4px 8px`), toggle gaps, section inner gaps                            |
| **10px**        | Panel section inner padding (`10px`), layout gap between cards, swatch gap, history-log row padding            |
| **12px**        | Window shell padding, modal padding, navigation tab horizontal padding, modal element gap, code padding (16px) |
| **14px**        | Sticky navigation vertical padding (`14px 32px`), card text padding                                            |
| **16px**        | Code block padding, alert banner padding, grid gap                                                             |
| **20px**        | Card padding, gallery gap, manual container paragraph bottom margin, landing gallery gap                       |
| **24px**        | Modal container backdrop padding, manual sidebar padding (→ 20px under 860px)                                  |
| **32px**        | Section horizontal padding, page container wrap margin                                                         |
| **40px / 60px** | Manual content container padding (`40px 60px`) (→ `24px 20px` under 860px)                                     |
| **48px**        | Landing section-head bottom margin, style-guide section padding                                                |
| **56px**        | Landing page hero and history two-column grid gaps                                                             |
| **72px**        | Landing hero top padding                                                                                       |
| **96px**        | Major landing page section padding, landing final-CTA vertical padding                                         |

> **Off-scale values are defects.** Historical offenders now corrected: `76px` → `72px` (hero), `100px` → `96px` (final CTA), `52px` → `48px` (section head), `11px` → `10px` (history-log row padding), `80px` → `48px`+`32px` (style-guide sections).

### Elevation & Box Shadows

Declared once as `--ui-shadow-*`; components consume them so light and dark stay in sync.

| Token                | Light Mode                          | Dark Mode                            | Purpose                                |
| :------------------- | :---------------------------------- | :----------------------------------- | :------------------------------------- |
| `--ui-shadow-panel`  | `0 1px 3px rgba(0, 0, 0, 0.06)`     | `0 1px 4px rgba(0, 0, 0, 0.24)`      | Panel / card surface lift              |
| `--ui-shadow-float`  | `0 2px 6px rgba(0, 0, 0, 0.16)`     | `0 2px 8px rgba(0, 0, 0, 0.32)`      | Floating canvas buttons (Reset Camera) |
| `--ui-shadow-window` | `0 2px 10px rgba(0, 0, 0, 0.10)`    | `0 4px 16px rgba(0, 0, 0, 0.40)`     | Floating window shell                  |
| `--ui-shadow-pill`   | `0 1px 4px rgba(0, 0, 0, 0.12)`     | `0 1px 4px rgba(0, 0, 0, 0.12)`      | Floating pill / footer button          |
| `--ui-shadow-modal`  | `0 12px 32px rgba(0, 0, 0, 0.16)`   | `0 16px 40px rgba(0, 0, 0, 0.60)`    | Confirm / colour / file dialogs        |
| `--ui-shadow-glow`   | `0 1px 3px rgba(1, 125, 211, 0.18)` | `0 1px 4px rgba(99, 179, 255, 0.30)` | Active tool button state               |

### Custom Scrollbars

Scrollbars are styled **once, globally**, from the `--ui-scrollbar-*` tokens. Component files must not re-declare them.

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--ui-scrollbar-track);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: var(--ui-scrollbar-thumb);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--ui-scrollbar-thumb-hover);
}

/* Firefox Fallback — required, not optional.
   Without it, Firefox renders a stock light scrollbar on the dark manual page. */
@supports not selector(::-webkit-scrollbar) {
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--ui-scrollbar-thumb) var(--ui-scrollbar-track);
  }
}
```

In dark mode, scrollbar thumbs blend smoothly against dark surfaces:

- Track: `rgba(255, 255, 255, 0.04)`
- Thumb: `#3a4454` (Hover: `#505c70`)

### Layout Pitfalls

- **`100vw` is banned.** It includes the classic scrollbar width and produces a horizontal overflow of exactly that many pixels. Use `100%`.
- **Flex children need `min-height: 0` / `min-width: 0`** when they contain scrollable content. A child with `height: 100%` inside a flex column that also renders a sibling will overflow its parent.
- **`overflow: hidden` clips absolutely-positioned children that overhang.** The floating window's four resize handles sit at `-7px` on each edge; the shell must therefore _not_ set `overflow: hidden`.

---

## UI Components & Design Patterns

### 1. Buttons

Aurea defines standard variants for landing/manual layouts and compact variants for workspace panels.

| Button Type                                     | Typography                                    | Padding                | Border & Radius                                     | Visual Style                                                                                  |
| :---------------------------------------------- | :-------------------------------------------- | :--------------------- | :-------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **Primary CTA**                                 | IBM Plex Mono, 13px, 600, uppercase, `0.06em` | `12px 20px`            | `1px solid var(--editor-accent)`, radius `3px`      | Background `var(--editor-accent)`, text `var(--ui-on-accent)`                                 |
| **Default / Secondary**                         | IBM Plex Mono, 13px, 600, uppercase, `0.06em` | `12px 20px`            | `1px solid var(--editor-border)`, radius `3px`      | Background `var(--editor-bg)`, text `var(--editor-ink)`                                       |
| **Ghost / Tertiary**                            | IBM Plex Mono, 0.75rem, uppercase             | `4px 8px`              | `none`, radius `3px`                                | Background `transparent`, text `var(--editor-ink-dim)`, hover accent                          |
| **Toolbar Tool Button**                         | IBM Plex Mono, 0.75rem, uppercase, `0.03em`   | `4px 8px`              | `1px solid var(--editor-border)`, radius `3px`      | Background `var(--editor-bg-raised)`, text `var(--editor-ink)`                                |
| **Active Tool Button**                          | IBM Plex Mono, 0.75rem, uppercase, `0.03em`   | `4px 8px`              | `1px solid var(--editor-accent)`, radius `3px`      | Background `var(--editor-accent)`, text `var(--ui-on-accent)`, shadow `var(--ui-shadow-glow)` |
| **Panel Action / Reset**                        | IBM Plex Mono, 0.75rem, uppercase, `0.04em`   | `4px 8px` / full width | `1px solid var(--editor-border)`, radius `3px`      | Background `var(--editor-bg-raised)`, hover border & text accent                              |
| **Radius Stepper Button**                       | IBM Plex Mono, 0.75rem, **600**               | `3px 6px`              | `none` (inside container)                           | Background `var(--ui-accent-fill)`, hover `var(--ui-accent-fill-hover)`                       |
| **Preset Chip**                                 | IBM Plex Mono, 0.75rem                        | `2px 8px`              | `1px solid var(--editor-border-soft)`, radius `3px` | Background `var(--editor-bg)`, active fill `var(--editor-accent)` + `var(--ui-on-accent)`     |
| **Soft Accent Button** (confirm / reset / save) | IBM Plex Mono, 0.75rem                        | `4px 8px`              | `1px solid var(--editor-border-soft)`, radius `3px` | Fill `var(--ui-accent-fill)`, text `var(--editor-accent)`, hover `--ui-accent-fill-hover`     |
| **Theme Toggle Button**                         | IBM Plex Mono, 12px, 500, uppercase, `0.06em` | `6px 10px`             | `1px solid var(--editor-border)`, radius `3px`      | Active: accent text/border on `var(--ui-hover-tint-strong)` fill                              |
| **Window Collapse Button**                      | IBM Plex Mono, **11px**, uppercase, `0.04em`  | `4px 8px`              | `1px solid var(--editor-border)`, radius `3px`      | Window header action                                                                          |
| **Canvas Floating Button**                      | IBM Plex Mono, 0.7rem, uppercase, `0.04em`    | `7px 10px`             | `1px solid var(--editor-border)`, radius `3px`      | Position absolute `(12px, 12px)`, shadow `var(--ui-shadow-float)`                             |

**Button state rules**

1. Enumerate `transition` properties. **Never `transition: all`** — it animates layout-affecting properties you never intended to touch.
2. Disabled buttons get `opacity` + `cursor: not-allowed`, and hover rules must be gated with `:not(:disabled)`.
3. An active (`.active` / `.is-active`) selector must be declared **after** its `:hover` sibling at equal specificity, or hover will win on an active element.

### 2. Form Inputs & Controls

- **Text & Search Input**:
  - Height / Padding: `10px 12px` (standard) or `8px 10px` (dialogs)
  - Typography: `IBM Plex Mono` / `IBM Plex Sans` `0.75rem`–`0.9rem`
  - Border: `1px solid var(--editor-border)`, radius `3px`
  - Focus state: **`:focus-visible`**, `outline: 2px solid var(--editor-accent); outline-offset: 3px;`
- **Radius Stepper Input Group**:
  - Container: `border: 1px solid var(--editor-border); border-radius: 3px; overflow: hidden;`
  - Number input: `width: 44px; border: none; text-align: center; font-size: 0.75rem;`
  - Steppers: `+` / `-` buttons on either side with hover accent.
  - ⚠️ The number input must **keep** its focus ring. `outline: none` plus a background tint is not a focus indicator (WCAG 2.4.7). Use `:focus-visible` with a negative offset so the ring stays inside the clipped container.
- **Range Slider**: `accent-color: var(--editor-accent);`
- **Toggle / Checkbox Item**:
  - Container label: `display: flex; gap: 8px–10px; padding: 6px 8px; border: 1px solid var(--editor-border-soft); border-radius: 5px;`
  - Checkbox element: `accent-color: var(--editor-accent);`
  - Hover highlight: `background: var(--ui-hover-tint-soft); border-color: var(--editor-accent-soft);`
- **Master Toggle Label**:
  - Enlarged check box (`transform: scale(1.15)`), padding `8px 10px`, accent border `var(--ui-card-border)`.
- **Use `:focus-visible`, never `:focus`**, for keyboard focus rings. `:focus` fires on mouse press and produces a ring the user did not ask for.

### 3. Surface Cards & Panels

- **Standard Section Card (`.snap-section`, `.file-section`, `.colors-section`, `.guide-section`)**:
  - Background: `var(--editor-bg-raised)`
  - Border: `1px solid var(--editor-border)`
  - Border radius: `5px` (`--editor-radius-m`)
  - Padding: `10px`
  - Box shadow: `var(--ui-shadow-panel)`
  - Header: `Space Grotesk`, `14px`, `font-weight: 600`, color `var(--editor-ink)`
- **Highlight Card / Master Section (`.snap-master-section`, `.file-export-card`)**:
  - `background: var(--ui-card-tint); border-color: var(--ui-card-border);`
- **Color Swatch Card (`.color-swatch`)**:
  - Layout: Vertical stack, `padding: 8px; gap: 8px;`
  - Border: `1px solid var(--editor-border-soft); border-radius: 3px;`
  - Swatch Preview Box: `height: 22px; border: 1px solid var(--editor-border-soft); border-radius: 3px;` — **the modal preview uses the same 22px** (it was 28px).
  - Label: `0.75rem`, weight 500 (`var(--editor-ink)`); Value: `0.72rem`, mono (`var(--editor-ink-faint)`).
- **Stat Metric Grid (`.file-stat-grid`)**:
  - Grid: `grid-template-columns: repeat(3, 1fr); gap: 8px;`
  - Value: `Space Grotesk`, `1.1rem`, weight 600 (`var(--editor-ink)`)
  - Label: `0.72rem`, color `var(--editor-ink-faint)`.
- **Document / Code Viewer (`.file-document-content`)**:
  - Height: `220px` (min `120px`, `resize: vertical;`)
  - Typography: `IBM Plex Mono`, `0.7rem`, `line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere;`
  - Floating pill: Autoscroll toggle positioned at bottom-right `(10px, 10px)`.
  - ⚠️ Use `overflow-wrap: anywhere`, **not `word-break: break-all`** — the latter chops identifiers and coordinates mid-token.

### 4. Windows, Modals & Docking Layout

- **FlexLayout Tabset**:
  - ⚠️ Every `.flexlayout__*` override **must be scoped under `.app`**. flexlayout ships global class names; unscoped overrides leak into other consumers and cannot see the `--editor-*` tokens.
  - Tab Button: `IBM Plex Mono`, `12px`, uppercase, `letter-spacing: 0.06em; padding: 8px 14px;`
  - Unselected: color `var(--editor-ink-dim)`; Selected: color `var(--editor-accent)`, bottom border `2px solid var(--editor-accent)`, bg `var(--editor-tab-selected-bg)`.
  - Tabset header: `var(--ui-header-glass)`.
  - Splitter bar: `var(--editor-border-soft)`, expands/highlights to `var(--editor-accent-soft)` on hover.
- **Floating Window Shell (`.window-shell`)**:
  - Position: `absolute; z-index: 1000; padding: 12px; gap: 10px;`
  - Surface: `background: var(--ui-surface-glass); border: 1px solid var(--editor-border); border-radius: 5px; box-shadow: var(--ui-shadow-window);`
  - ⚠️ **No `overflow: hidden`.** The resize handles overhang by `-7px` and would be clipped, making the window unresizable.
  - Header: `margin: -4px -4px 0; padding: 3px 5px; background: var(--ui-header-tint); border: 1px solid var(--ui-header-border); border-radius: 3px;`
  - Title: `Space Grotesk`, `13px`, weight 600.
  - Collapse Button: `IBM Plex Mono`, `11px`, uppercase.
  - Resize Grips: 4 corners, `14px x 14px`, `background: var(--ui-grip-fill); border: 1px solid var(--ui-grip-border); border-radius: 3px;`
- **Modal Dialogs (`.confirm-dialog`, `.color-modal`, `.file-dialog`)**:
  - All shared chrome lives in **`src/ui/Dialog.css`**. Component CSS holds only component-specific rules.
  - Backdrop: `position: fixed; inset: 0; background: var(--ui-backdrop); z-index: 2000; padding: 24px;`
  - Shell: `width: min(360px, calc(100vw - 48px)); padding: 12px; gap: 12px; border-radius: 5px; box-shadow: var(--ui-shadow-modal);`
  - Title: `Space Grotesk`, `15px`, weight 600.
  - Actions: Right-aligned button group (Cancel / Close vs Confirm / Save / Reset).

---

## Layout & Blueprint Grid Systems

### Editor Viewport Shell

```css
.app {
  position: relative;
  width: 100%; /* never 100vw */
  height: 100vh;
  overflow: hidden;
  background: var(--editor-bg);
  color: var(--editor-ink);
}
```

### Blueprint Grid Patterns

1. **Hero & Canvas Reference Grid**:
   - `background-size: 20px 20px;`
   - Gradient lines: `var(--ui-grid-line)` — `rgba(1, 125, 211, 0.12)` (Light) / `rgba(99, 179, 255, 0.18)` (Dark)
2. **Page Background Blueprint Grid**:
   - `background-size: 28px 28px;`
   - Gradient lines: `rgba(58, 58, 58, 0.06)` (Light) / `rgba(208, 216, 233, 0.07)` (Dark)

### Navigation Bar

- Sticky header with `position: sticky; top: 0; backdrop-filter: blur(8px);`
- Background: `rgba(255, 255, 255, 0.92)` (Light) / `rgba(21, 24, 30, 0.94)` (Dark) — style-guide chrome; the app uses `var(--ui-header-glass)`.
- Border bottom: `1px solid var(--editor-border)`
- Padding: `14px 32px` (`14px 20px` under 640px)
- Links: `IBM Plex Mono`, `12px`, uppercase, `0.06em` letter-spacing, with `2px` solid underline on active/hover.

### Responsive Breakpoints — **verified against source**

| Breakpoint             | Target Screen                    | Adjustments                                                                                                   |
| :--------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **`max-width: 940px`** | Small Desktop / Tablet Landscape | Landing hero grid collapses to one column                                                                     |
| **`max-width: 900px`** | Small Desktop                    | Landing history two-column layout collapses to one column                                                     |
| **`max-width: 860px`** | Tablet Portrait                  | Instrument cards **and gallery** collapse; **manual page** stacks sidebar above content (`24px 20px` padding) |
| **`max-width: 780px`** | Narrow Tablet                    | Landing nav tabs are hidden (`display: none`)                                                                 |
| **`max-width: 640px`** | Mobile Large                     | Wrap **and nav** padding reduce from `32px` to `20px`                                                         |
| **`max-width: 540px`** | Mobile Portrait                  | Gallery → 1 column; hero CTA group stacks vertically                                                          |

> Earlier revisions of this table mis-assigned `780px` (it hides nav tabs, not the gallery) and omitted `900px` entirely.

---

## Motion, Accessibility & Dark Mode Guidelines

### Motion Scale

| Name                      | Duration | Easing          | Context                                                        |
| :------------------------ | :------- | :-------------- | :------------------------------------------------------------- |
| **`landingPageDraw`**     | `1.1s`   | `ease forwards` | SVG geometry stroke dasharray construction                     |
| **`landingPageFadeIn`**   | `0.6s`   | `ease forwards` | Hero content entry                                             |
| **Component Transitions** | `0.15s`  | `ease`          | Button, swatch, link color, background, and border transitions |
| **Fast Feedback**         | `0.10s`  | `ease`          | Preset buttons active switch                                   |
| **Gallery guide reveal**  | `0.25s`  | `ease`          | Landing gallery hover/focus-within guide fade                  |

Always write the `transition` shorthand as `background 0.15s ease` (shorthand) or `border-color 0.15s ease` (longhand) — but **never** `all`.

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

Landing page scroll-smoothing is separately neutralised in `LandingPage.css`, which also kills the draw/fade keyframes outright rather than shrinking them to 0.01ms.

### Dark Mode Implementation Guidelines

1. **Avoid Pure Black Canvas in Sunken Areas**: Sunken canvas viewport uses `#11141a`, while raised surfaces use `#1d222b` to establish true depth and elevation.
2. **Accessible Contrast Ratios** (measured against `#15181e`):
   - `--editor-ink: #eef2fb` → **15.9:1**
   - `--editor-ink-dim: #c2cce0` → **11.0:1**
   - `--editor-ink-faint: #92a1bc` → **7.98:1** vs `#15181e`, **6.11:1** vs `--editor-bg-raised` `#1d222b`
   - `--editor-accent: #63b3ff` → **7.98:1**
3. **Tinted Alpha Borders**: Use `rgba(208, 216, 233, 0.22)` for dark mode borders rather than opaque grays, allowing background luminance to naturally soften edges.
4. **Interactive Accents**: Active selection and hover fills scale up their alpha channel in dark mode (from 3–4% to 12–16%) to preserve visibility against dark backdrops.
5. **Set `color-scheme`** so native controls follow the theme.
6. **Flip `--ui-on-accent`**, never hard-code white text on an accent fill.

---

## CSS Pitfalls & Guardrails

The list below is the checklist to run before merging any CSS change.

### 1. Never `@import` a webfont from CSS

**Pitfall.** `@import` in a CSS module is fetched _after_ the importing stylesheet is parsed, creating a second serialised request that blocks first paint. Aurea had the identical Google Fonts URL in `global.css`, `EditorPage.css`, `LandingPage.css` and `ManualPage.css` — four copies.

**Rule.** Webfonts load once from `index.html` via `<link>` + `preconnect`. Component CSS starts with a comment saying so.

### 2. Never hard-code theme colours

**Pitfall.** ~40 literal `rgba(1, 125, 211, …)` / `rgba(99, 179, 255, …)` values, each paired with an `.app.app-dark` twin rule. Adding a new state meant editing two places, and missing the twin produced a light-mode colour in dark mode.

**Rule.** Colour comes from `--editor-*` (palette) or `--ui-*` (semantic). An `.app.app-dark` colour override is a code smell — it means the value should have been a token.

### 3. Never put `#ffffff` on an accent fill

**Pitfall.** 2.23:1 in dark mode. See [`--ui-on-accent`](#--ui-on-accent--the-one-rule-people-get-wrong).

### 4. Never use the pure status hue for body text

**Pitfall.** `#b7791f` amber on `#fff3cd` = 3.3:1; on white = 3.6:1. Both fail AA. Info text on `--accent-soft` = 3.4:1. Alert _text_ must use `--ui-*-text`, not the border hue.

### 5. Never remove a focus indicator

**Pitfall.** `.snap-radius-number { outline: none }` on focus — the tinted background was the only change and vanished on the sunken input fill.

**Rule.** Use `:focus-visible`, keep the 2px/3px ring, never `outline: none`.

### 6. Never `transition: all`

**Pitfall.** `.snap-preset-btn` animated every animatable property including `width`/`height`, producing layout thrash on hover.

### 7. Never request weight 700 from a Plex family

**Pitfall.** `font-weight: bold` on IBM Plex Mono → synthetic faux-bold of the 600 face. Use `600`.

### 8. Never use `100vw` for layout

**Pitfall.** Includes the scrollbar width → horizontal overflow of exactly that many pixels.

### 9. Never set `overflow: hidden` on a positioned container with overhanging children

**Pitfall.** `.window-shell { overflow: hidden }` clipped all four resize handles positioned at `-7px`, silently disabling window resizing.

### 10. Never use `height: 100%` for a flex child that has siblings

**Pitfall.** `.console-content` at `height: 100%` inside a flex column that also renders `.console-controls` pushed the controls out of the panel. Use `flex: 1; min-height: 0`.

### 11. Never declare generic tokens on `:root`

**Pitfall.** `ManualPage.css` wrote `--bg`, `--ink`, `--accent`, `--border`, `--radius-s`, `--font-body` on `:root` while only `.manual-container` consumed them — a namespace collision waiting to happen. Scope page tokens to the page container.

### 12. Never duplicate shared chrome

**Pitfall.** The confirm / colour / file dialogs were three verbatim copies of the same ~90 lines. They now share `src/ui/Dialog.css`. Before adding a third variant, extend the shared file.

### 13. Never re-declare global scrollbars

**Pitfall.** Scrollbar rules were duplicated in `global.css`, `ConsolePanel.css` and `ManualPage.css` — and the Manual copy omitted the Firefox `scrollbar-color` fallback, so Firefox rendered a light scrollbar on the dark manual page.

### 14. Never assert scoping you have not verified

**Pitfall.** `LandingPage.css` opened with _"All rules are scoped under `.landing-page-landing`"_ while ~60 selectors were top-level. Every rule is now genuinely nested, and the file declares a **scope contract** stating that it is self-contained and must not consume `--editor-*` / `--ui-*`.

### 15. Never invent off-scale values

**Pitfall.** Font sizes `0.64 / 0.65 / 0.68 / 0.78 / 0.8 / 0.82rem` and `10px`; spacing `11 / 52 / 76 / 80 / 100px`. All normalized to the scales documented above.

### 16. Never `word-break: break-all` on data text

**Pitfall.** It chops identifiers, ids and coordinates mid-token. Use `overflow-wrap: anywhere`.

### 17. Never declare a dark-mode rule for a selector nothing sets

**Pitfall.** `ManualPage.css` shipped a full dark palette behind `body.app-dark .manual-container, .manual-container.app-dark`, but the manual page has no theme switch — **neither selector ever matched**. The palette was dead code and the manual page never actually themed.

**Outstanding wiring.** `ManualPage.tsx` has no theme control. To activate the (now correct) manual dark theme, add `document.body.classList.toggle('app-dark')` alongside a control, or render `.manual-container` with an `app-dark` class. Until then the manual page is light-only by construction.

### 18. Watch CSS load order for shared component files

`Dialog.css` is imported by `ConfirmDialog.tsx`, `ColorsPanel.tsx` and `FilePanel.tsx`. Vite de-duplicates it into a single stylesheet, but removing one of those imports would still be safe. Component-specific overrides live in the component's own file and therefore win.

---

## Verification Commands

```bash
npm run lint      # eslint
npx tsc -b        # types
npx vite build    # bundle
npx prettier --check "src/**/*.{css,tsx}"
```

Prettier owns CSS formatting (`.prettierignore` excludes only `node_modules`, `dist`, `build`, `coverage` — `doc/` **is** formatted, so keep `style-guide.html` Prettier-clean).
