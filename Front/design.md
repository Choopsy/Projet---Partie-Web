---
name: Patrimoine Arboré
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#414943'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#717973'
  outline-variant: '#c0c9c1'
  surface-tint: '#3a674f'
  primary: '#14422d'
  on-primary: '#ffffff'
  primary-container: '#2d5a43'
  on-primary-container: '#9fcfb2'
  inverse-primary: '#a1d1b4'
  secondary: '#316948'
  on-secondary: '#ffffff'
  secondary-container: '#b1edc4'
  on-secondary-container: '#356e4c'
  tertiary: '#5c2f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d4200'
  on-tertiary-container: '#ffb477'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceecf'
  primary-fixed-dim: '#a1d1b4'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#224f39'
  secondary-fixed: '#b4f0c7'
  secondary-fixed-dim: '#98d4ac'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#165132'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is rooted in the intersection of environmental conservation and modern data science. It evokes a sense of "Organic Professionalism"—a style that balances the wild, tactile essence of nature with the precision of a scientific inventory tool. The target audience includes urban planners, environmentalists, and engaged citizens who require a tool that feels both authoritative and life-affirming.

The aesthetic follows a **Modern-Corporate** movement with strong **Minimalist** influences. It prioritizes clarity and whitespace to handle complex data visualizations while using a warm, nature-inspired palette to prevent the interface from feeling cold or institutional. The interface should feel like a premium botanical journal brought into the digital age.

## Colors

The palette is anchored by "Deep Forest Green" to represent longevity and protection. This is supported by "Sage Green" for interactive elements and accents, creating a harmonious monochromatic scale for data density. 

The background uses a "Warm Sand" beige rather than pure white to reduce eye strain and reinforce the organic theme. "Crisp White" is reserved for high-elevation cards and surfaces to create clear visual separation. A tertiary "Ochre" is used sparingly for highlights or status indicators (e.g., "Remarkable Trees") to provide a natural contrast that complements the greens.

## Typography

The typographic hierarchy relies on a sophisticated contrast between Serif and Sans-Serif. **Noto Serif** provides the editorial authority for headings, lending the platform a timeless, archival quality. **Manrope** is used for all functional UI elements, data points, and body copy; its balanced, modern proportions ensure high legibility in dense inventory lists and data tables. 

Titles should utilize the "itallics" variant for specific keywords to emphasize the "natural" aspect within a digital frame, as seen in the primary hero sections.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop views, centered at 1280px to maintain focus, and a **Fluid Grid** for tablet and mobile breakpoints. A 12-column system is the standard, with generous 24px gutters to allow the "breathable" nature of the brand to persist even in data-heavy views.

Rhythm is maintained through an 8px base unit. Vertical rhythm should be intentional, using larger gaps (`stack-lg`) between distinct content sections (e.g., Map vs. Table) and tighter spacing (`stack-sm`) for related form elements or card metadata.

## Elevation & Depth

Hierarchy is established using **Tonal Layers** combined with **Ambient Shadows**. Surfaces do not "float" aggressively; instead, they sit subtly above the warm beige canvas.

- **Level 0 (Canvas):** The warm sand background.
- **Level 1 (Cards/Containers):** Crisp white surfaces with a 1px border in a very light sage tint and a soft, diffused shadow (12% opacity, 16px blur) to provide a soft landing.
- **Level 2 (Modals/Popovers):** Higher contrast shadows and backdrop blurs to isolate the user's focus during data entry or tree registration.

Avoid heavy black shadows; instead, use a deep green-tinted shadow to maintain the natural color harmony.

## Shapes

The shape language is consistently **Rounded**, reflecting the soft silhouettes found in nature. 

- **Cards and Data Containers:** 1rem (`rounded-lg`) corner radius creates a friendly but structured frame.
- **Buttons and Inputs:** 0.5rem (`rounded-md`) for a professional, clickable feel.
- **Status Chips:** Full pill-shape for high distinctiveness in tables.
- **Visuals:** Photography should occasionally utilize "organic" clipping paths (subtle blobs or soft-edged frames) to break the rigidity of the grid.

## Components

### Buttons
- **Primary:** Solid Deep Forest Green with white text. High contrast, high importance.
- **Secondary:** Outlined Sage Green with a subtle background hover state.
- **Ghost:** No border, used for utility actions like "Clear Filters."

### Cards
Cards are the primary vehicle for tree data. They must feature a subtle 1px border (#E5E9E2) and soft shadows. Header icons within cards should be wrapped in a soft sage circular background.

### Input Fields
Inputs use a light background fill (neutral) rather than just an outline. The focus state is a 2px Sage Green border.

### Data Visualizations
Charts should utilize a gradient of the primary and secondary greens. For categorical data (like tree species), use the primary green as the anchor and step down in opacity or lightness to ensure visual cohesion.

### Inventory List
The list/table component uses "Zebra Striping" with a very faint sage tint to maintain horizontal tracking across wide data points (height, diameter, age).
