---
name: Technical Industrial Minimalism
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h2:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0em
  technical-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-point:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  xxl: 128px
---

## Brand & Style

This design system is engineered for high-performance environments where precision, speed, and technical clarity are paramount. The aesthetic is rooted in **Industrial Minimalism** and **Refined Brutalism**, drawing inspiration from high-end laboratory equipment, command-line interfaces, and architectural blueprints.

The visual language communicates authority and reliability through a strict adherence to a modular grid and a high-contrast color palette. It avoids decorative flourishes, favoring functional elements that serve as their own ornamentation. The user experience should feel like operating a sophisticated piece of hardware: tactile, responsive, and uncompromisingly efficient.

## Colors

The palette is anchored by **Deep Charcoal (#121212)**, providing a void-like foundation that minimizes eye strain and allows accents to vibrate. **Cyber Lime (#CCFF00)** is reserved strictly for primary actions and critical status indicators, ensuring a high-luminance focal point. **Electric Cyan (#00F0FF)** functions as a technical highlight, used for data visualization, active states, and telemetry details.

The background must incorporate a subtle monochromatic noise texture (opacity 2-3%) to simulate the grain of powder-coated metal, preventing the "flatness" often found in digital dark modes.

## Typography

The typographic system utilizes a dual-font approach to distinguish between "Machine" and "Human" data. 

**JetBrains Mono** is the technical workhorse, used for headings, labels, and any data-heavy strings to evoke a sense of programmatic precision. **Inter** is utilized for body copy in a semi-bold weight (#600) to maintain high legibility against the dark background, ensuring that even dense paragraphs feel structured and substantial. Letter spacing should be tightened for large headings and opened slightly for technical labels to maximize scannability.

## Layout & Spacing

This design system employs a **strict 4px baseline grid** within a **12-column fluid grid system**. The layout philosophy is architecturally sound: every element must align to the grid, with visible or implied "lanes" of content.

Gutters and margins are fixed to maintain structural integrity across different viewport sizes. Use whitespace not just as a "breather," but as a structural separator. High-density information should be grouped into modular blocks, separated by clear, consistent gaps that follow the power-of-two spacing scale.

## Elevation & Depth

In line with its brutalist leanings, the design system rejects soft, ambient shadows. Instead, it utilizes **Tonal Layering** and **Bold Outlines** to define hierarchy.

1.  **Level 0 (Base):** Deep Charcoal (#121212) with noise texture.
2.  **Level 1 (Surface):** Subtle shift to #1A1A1A with a 1px solid border (#2D2D2D).
3.  **Active/Focus:** Borders shift to Electric Cyan or Cyber Lime to indicate selection.
4.  **Separators:** Use hard 1px lines rather than shadows to divide content sections. 

Depth is achieved through "stacking" panels, where higher-level elements may have a slightly lighter background hex, creating a physical sense of overlapping plates.

## Shapes

The shape language is strictly **Sharp (0px radius)**. This reinforces the industrial, unyielding nature of the design system. 

All containers, buttons, input fields, and tags must maintain right-angle corners. This geometric rigidity ensures that components feel modular and can be tiled seamlessly within the grid. When grouping elements, the lack of border-radius emphasizes the "unit" feel of the interface, making the software feel like a cohesive, solid instrument.

## Components

### Buttons
Primary buttons use a solid **Cyber Lime** fill with black text, providing maximum contrast. Secondary buttons are "Ghost" style with a 1px **Electric Cyan** border and matching text. Hover states should be instantaneous (0ms-50ms transition) to feel mechanical.

### Chips & Tags
Technical tags should use JetBrains Mono in a smaller font size, enclosed in a thin grey border. Use Electric Cyan for status-active chips and a muted grey for inactive ones.

### Input Fields
Inputs are defined by a bottom-border only or a full 1px grey border. Upon focus, the border must glow **Electric Cyan** or **Cyber Lime**. Monospaced text is required for all numerical and technical input.

### Cards & Modules
Containers should be treated as "Panels." Use a slightly lighter surface color than the background and consider adding a small technical ID or "corner accent" (e.g., a 4px L-shape in the top right) to emphasize the engineering aesthetic.

### Data Visualization
Charts and graphs should exclusively use Cyber Lime and Electric Cyan against the Deep Charcoal base. Use thin, 1px grid lines within charts to maintain the architectural feel.