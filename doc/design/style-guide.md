# Aurea: CSS Style Guide

## Typography

Aurea uses three Google Fonts: **Space Grotesk** for display headings, **IBM Plex Sans** for body text, and **IBM Plex Mono** for code and data.

### Font Stack

| Role | Font | Weights |
|------|------|---------|
| Display | `'Space Grotesk', sans-serif` | 500, 600, 700 |
| Body | `'IBM Plex Sans', sans-serif` | 400, 500, 600 |
| Mono | `'IBM Plex Mono', monospace` | 400, 500, 600 |

### Heading Styles

- **Heading 1** — Bold display, `clamp(2.4rem, 5vw, 3.6rem)`, font-weight 700, letter-spacing -0.01em, line-height 1.05
- **Heading 2** — Semi-bold, `clamp(1.6rem, 3vw, 2.2rem)`, font-weight 600, letter-spacing -0.01em
- **Heading 3** — Medium, 17px, font-weight 600

All headings use `'Space Grotesk', sans-serif` with no margin by default.

### Body Text

- **Base body**: 16px, color `#3a3a3a`, line-height 1.55
- **Small body**: 14.5px, color `#3a3a3a` — used for descriptions and secondary content
- **Caption**: 13px, monospace — used in gallery tiles and figure descriptions
- **Faint text**: 11px, color `#707070`, monospace — metadata labels and timestamps

### Monospace / Code

Code text uses `'IBM Plex Mono', monospace` at 0.75–0.85rem with uppercase letter-spacing of 0.04–0.06em.

### Font Properties

| Property | Value |
|----------|-------|
| Base font size | 16px |
| Base line height | 1.55 |
| Text rendering | `optimizeLegibility` |
| Font smoothing | `-webkit-font-smoothing: antialiased` |
| Letter spacing (uppercase) | 0.04em–0.14em |

---

## Colors

The Aurea editor palette is built around a minimal dark-on-light system with a single blue accent (`#017dd3`). All colors are exposed as CSS custom properties.

### Editor / App Palette

#### Backgrounds

| Custom Property | Value | Description |
|----------------|-------|-------------|
| `--editor-bg` | `#ffffff` | Base background |
| `--editor-bg-raised` | `#ffffff` | Raised surfaces (cards, panels) |
| `--editor-bg-sunken` | `#ffffff` | Sunken areas (canvas) |
| `--editor-accent-soft` | `#c7e8ff` | Soft accent tint |

#### Ink / Text

| Custom Property | Value | Description |
|----------------|-------|-------------|
| `--editor-ink` | `#000000` | Primary text |
| `--editor-ink-dim` | `#3a3a3a` | Secondary text |
| `--editor-ink-faint` | `#707070` | Muted / metadata text |
| `--editor-accent` | `#017dd3` | Primary accent (links, CTAs) |

#### Borders

| Custom Property | Value | Description |
|----------------|-------|-------------|
| `--editor-border` | `rgba(58,58,58,0.18)` | Standard border |
| `--editor-border-soft` | `rgba(58,58,58,0.10)` | Subtle border |
| Accent border | `rgba(1,125,211,0.12)` | Light accent border |
| Accent border-strong | `rgba(1,125,211,0.18)` | Stronger accent border |

### Landing Page Palette

The landing page shares the same base palette with `--landing-page-*` prefixed custom properties. Key additions include a 28px grid background pattern using `rgba(58,58,58,0.06)` lines.

| Custom Property | Value | Usage |
|----------------|-------|-------|
| `--landing-page-construction` | `#017DD3` | Primary accent (CTA, links, highlights) |
| `--landing-page-construction-soft` | `#C7E8FF` | Soft accent background (active states) |
| `--landing-page-grid-line` | `rgba(58,58,58,0.06)` | Background grid lines |
| `--landing-page-bg` | `#FFFFFF` | Page background |
| `--landing-page-border` | `rgba(58,58,58,0.18)` | Surface borders |
| `--landing-page-border-soft` | `rgba(58,58,58,0.10)` | Subtle borders |

### Log Level Colors

| Level | Color | Hex |
|-------|-------|-----|
| Log | Default ink-dim | `#3a3a3a` |
| Info | Accent | `#017dd3` |
| Warn | Amber | `#b7791f` |
| Error | Red | `#c53030` |

---

## Spacing & Radius

Aurea uses a consistent spacing scale based on 8px grid units and two border-radius values.

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--editor-radius-s` | 3px | Small elements: buttons, inputs, swatches |
| `--editor-radius-m` | 5px | Medium elements: panels, tabs, cards, modals |

### Spacing Scale

| Token | Value | Context |
|-------|-------|---------|
| 8px | 8px | Base grid unit |
| 10px | 10px | Panel section gaps, padding |
| 12px | 12px | Modal gap, icon gaps |
| 14px | 14px | Nav padding, list margins |
| 16px | 16px | Grid gaps, footer padding |
| 20px | 20px | Card padding, gallery gaps |
| 24px | 24px | Modal padding |
| 32px | 32px | Section horizontal padding |
| 56px | 56px | Section grid gaps (hero, history) |
| 96px | 96px | Section vertical padding |

### Scrollbar

| Part | Width | Color |
|------|-------|-------|
| Track | 8px | `rgba(0,0,0,0.05)` |
| Thumb | 8px | `#cbd5e0` |
| Thumb hover | 8px | `#a0aec0` |
| Border radius | 4px | Applies to track & thumb |

Firefox fallback uses `scrollbar-width: thin` and `scrollbar-color: #cbd5e0 rgba(0,0,0,0.05)`.

---

## Components

All reusable UI components follow consistent styling patterns: 1px borders with soft alpha values, 3px/5px border-radius, and subtle box shadows for depth.

### Buttons

| Property | Value |
|----------|-------|
| Padding | 12px 20px |
| Font | `'IBM Plex Mono', monospace` |
| Font size | 13px |
| Letter spacing | 0.06em |
| Text transform | uppercase |
| Border | `1px solid rgba(58,58,58,0.18)` |
| Border radius | 3px |
| Transition | `border-color .15s, background .15s` |

**Variants:**
- **Default**: White background, dark text, light border
- **Primary**: Blue (`#017dd3`) background with white text
- **Ghost**: Transparent background

**Toolbar / Panel buttons** use smaller sizing: padding 4px 8px, font-size 0.75rem, uppercase mono. Active state uses accent background with white text and a subtle box shadow (`0 1px 3px rgba(1,125,211,0.18)`).

**See-more button**: Same sizing as toolbar buttons, accent border on hover.

**Reset button**: Full-width, uppercase mono, border + accent color on hover.

### Input Fields

Inputs use `border-radius: 3px`, `1px solid` border, and an accent (`#017dd3`) outline with `outline-offset: 3px` on focus.

### Panel Surface

- Background: `#fff`
- Border: `1px solid rgba(58,58,58,0.18)`
- Border radius: 5px
- Box shadow: `0 1px 3px rgba(0,0,0,0.06)`

### Toggle / Checkbox

Checkboxes use `accent-color: var(--editor-accent)` (`#017dd3`). Labels have 8px gap, 1px soft border, and 5px border-radius with a hover highlight using `rgba(1,125,211,0.03)` background.

### Badge

Used in the snap panel to display current radius values. Pill shape with accent colors:
- Text: `#017dd3`, font-weight 600, font-size 0.72rem
- Background: `#c7e8ff`
- Border: `1px solid rgba(1,125,211,0.18)`
- Border radius: 999px (full pill)
- Padding: 2px 8px

### Modal

- Backdrop: `rgba(0,0,0,0.18)`
- z-index: 2000
- Width: `min(360px, calc(100vw - 48px))`
- Padding: 12px
- Border: `1px solid rgba(58,58,58,0.18)`
- Border radius: 5px
- Box shadow: `0 12px 32px rgba(0,0,0,0.16)`
- Close/Reset buttons: `padding: 4px 8px`, 3px radius, mono font

---

## Layout

Aurea uses a 100vw × 100vh editor shell with flexbox-based panel layouts and CSS Grid for responsive landing page sections.

### Editor Shell

```css
.app {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--editor-bg);
}
```

All children use `box-sizing: border-box`.

### Window Shell

- Position: absolute
- Padding: 12px
- Gap: 10px
- Background: `rgba(255,255,255,0.96)`
- Border: `1px solid rgba(58,58,58,0.18)`
- Border radius: 5px
- Box shadow: `0 2px 10px rgba(0,0,0,0.10)`
- z-index: 1000
- Header: `margin: -4px -4px 0`, padded 3px 5px, background `rgba(1,125,211,0.06)`

### Grid Systems

| Context | Template | Gap |
|---------|----------|-----|
| Landing hero | 1.05fr 1fr | 56px |
| Landing instruments | repeat(3, 1fr) | 20px |
| Landing gallery | repeat(3, 1fr) | 18px |
| Landing history | 1fr 1fr | 56px |
| Color layer grid | 1fr 1fr | 10px |

Responsive breakpoints: 540px, 780px, 860px, 900px, 940px collapse grids to fewer columns.

### Navigation

Sticky header with `backdrop-filter: blur(8px)` and `rgba(255,255,255,0.88)` background. Tabs use monospace font, 12px, uppercase, with 2px underline accent on active/hover.

### CSS Grid Background

Two grid patterns are used:
- **20px grid** with accent tint (`rgba(1,125,211,0.12)`) — hero canvas area
- **28px grid** with subtle lines (`rgba(58,58,58,0.06)`) — landing page background

### Animations

| Animation | Duration | Timing |
|-----------|----------|--------|
| `landingPageDraw` | 1.1s | ease forwards |
| `landingPageFadeIn` | 0.6s | ease forwards |
| Component transitions | 0.15s | ease (color, background, border) |

All animations respect `prefers-reduced-motion: reduce` — drawing animations are disabled, fade-in becomes `opacity: 1`, and scroll-behavior becomes auto.

### Selection Styling

Selected text on the landing page uses the accent color (`#017DD3`) as background with white text.

### Focus Styles

Focus-visible outlines use `2px solid var(--landing-page-construction)` with `outline-offset: 3px`.
