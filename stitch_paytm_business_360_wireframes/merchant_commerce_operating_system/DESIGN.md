---
name: Merchant Commerce Operating System
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#3d484f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#6d7980'
  outline-variant: '#bcc8d0'
  surface-tint: '#006686'
  primary: '#006686'
  on-primary: '#ffffff'
  primary-container: '#00baf2'
  on-primary-container: '#00465e'
  inverse-primary: '#71d2ff'
  secondary: '#3f5ba3'
  on-secondary: '#ffffff'
  secondary-container: '#96b1ff'
  on-secondary-container: '#234288'
  tertiary: '#006e2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#45c466'
  on-tertiary-container: '#004c1d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c0e8ff'
  primary-fixed-dim: '#71d2ff'
  on-primary-fixed: '#001e2b'
  on-primary-fixed-variant: '#004d66'
  secondary-fixed: '#dae1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#001849'
  on-secondary-fixed-variant: '#25438a'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  currency-display-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 1.75rem
---

## Brand & Style

This design system serves millions of micro-merchants, retail store operators, and enterprise B2B vendors across India. The brand ethos embodies extreme financial reliability, real-time transaction clarity, and friction-free daily reconciliation. The visual environment balances institutional stability with accessible digital speed.

The design style combines **Corporate / Modern** fintech precision with tailored Indian retail ergonomics:
- **Trust & Immediate Legibility:** Core data points (daily settlement totals, QR scan health, voice box connectivity, soundbox confirmation states) take immediate priority without visual clutter.
- **Equal-Weight Financial Clarity:** Inflows ("Money In") and Outflows ("Money Out") utilize identical structural weight and information density, using crisp contextual semantic tagging rather than overwhelming screen real estate.
- **High-Density Utility:** Tailored for both high-end tablets at multi-chain checkout counters and low-tier Android smartphones used in bustling outdoor markets with glare, dust, and variable lighting.

## Colors

The palette delivers sharp visual hierarchy anchored by the signature high-energy digital cyan alongside a commanding enterprise navy.

- **Primary Cyan (`#00BAF2`):** Reserved for core brand anchors, primary action states, real-time status pulses, and active selection highlights.
- **Deep Corporate Navy (`#002970`):** Used for structural chrome, high-emphasis headlines, critical monetary headers, high-tier navigation, and institutional badges. It acts as the visual bedrock.
- **Surface Neutral (`#F5F8FA`):** The foundational canvas tint. It avoids pure blinding white backgrounds to reduce fatigue during multi-hour point-of-sale use and ensures pure white card surfaces pop with spatial intent.
- **Functional Financial Tones:**
  - **Success Emerald (`#16A34A`):** Used for verified settlements, Money In confirmations, UPI payment success, and active Soundbox connectivity.
  - **Warning Amber (`#F59E0B`):** Applied to pending bank settlements, disputed transactions, KYC renewal reminders, and battery alerts.
  - **Error Crimson (`#DC2626`):** Dedicated to transaction failures, merchant chargebacks, network timeouts, and critical alerts.
- **Card & Data Containers (`#FFFFFF`):** High-contrast, pure white structural surfaces that organize high-density financial ledgers.

## Typography

Inter serves as the single programmatic typeface across the entire hierarchy, chosen for its neutral grotesque precision, tall x-height, and robust tabular numeric support.

- **Tabular Numerals & Monetary Formatting:** All financial tables, ledgers, settlement summaries, and Rupee balance figures enforce tabular lining numbers (`font-variant-numeric: tabular-nums`). The Indian Rupee symbol (`₹`) is vertically aligned to harmonize optically with cap-height values.
- **Visual Weighting:** Primary data points (total collected amounts, immediate settlement balances) rely on bold weights (`700`), while contextual subtitles and secondary timestamps use medium (`500`) and regular (`400`) weights in muted slate to prevent numerical fatigue.

## Layout & Spacing

The layout operates on an 8pt base grid with a secondary 4pt half-step for micro-alignment within compact financial tables and badges.

- **Mobile Viewports (<600px):** Single-column stacked fluid layout with 16px lateral padding. Crucial actions (QR generation, Manual Billing, Settlement Request) remain sticky in a bottom bar within thumb range.
- **Tablet/POS Form Factors (600px - 1024px):** 8-column layout. Split-screen orientation places live telemetry (soundbox state, terminal status) and daily inflow metrics in a fixed left panel (35%), leaving transaction histories and filterable tables in a flexible right panel (65%).
- **Desktop/Merchant Portal (>1024px):** 12-column layout maxed at 1440px width with 24px gutters, prioritizing dense parallel views of multi-store accounts, batch settlements, and reconciliation graphs.

## Elevation & Depth

Depth is established through soft, multi-layered ambient light combined with hairline boundaries rather than high-contrast shadows, ensuring clear visibility under direct ambient sunlight.

- **Layer 0 (Canvas):** Base background tinted with Surface Neutral (`#F5F8FA`).
- **Layer 1 (Cards & Data Panels):** Pure White (`#FFFFFF`) with a 1px structural outline of `rgba(0, 41, 112, 0.08)` and a soft base drop: `0px 2px 8px -2px rgba(0, 41, 112, 0.04), 0px 1px 3px 0px rgba(0, 41, 112, 0.02)`.
- **Layer 2 (Floating Action Trays & Popovers):** Elevated cards, dropdown menus, and date pickers use `0px 8px 24px -4px rgba(0, 41, 112, 0.08), 0px 2px 6px -1px rgba(0, 41, 112, 0.04)` paired with an active hairline border of `rgba(0, 41, 112, 0.12)`.
- **Layer 3 (Modals & Settlement Bottom Sheets):** Deep scrim overlay at `rgba(0, 41, 112, 0.45)` supporting an elevated surface with `0px 20px 32px -8px rgba(0, 41, 112, 0.16)`.

## Shapes

The design system enforces a 14px outer corner radius on all primary cards and data tiles, producing an approachable yet structured aesthetic that softens complex financial metrics.

- **Primary Cards & Containers:** Fixed at 14px (`0.875rem`) corner radius. Nested inner modules (such as distinct settlement metrics or barcode containers) follow an 8px radius to maintain concentric geometry.
- **Interactive Controls (Buttons, Inputs, Selectors):** Normalized to 10px corner radius, balancing tap-target distinction with container cohesion.
- **System Tags, Badges & Pills:** Fully rounded (`rounded-full` / 9999px) to immediately distinguish transactional statuses and network states from interactive structural containers.

## Components

### Buttons
- **Primary:** Deep Corporate Navy background (`#002970`) with pure white text for maximum contrast and transactional weight, or Primary Cyan (`#00BAF2`) with Navy text for digital quick-actions. Height 48px on mobile, 40px on desktop. 10px radius.
- **Secondary / Outline:** Transparent fill, 1.5px border of Navy (`#002970`), Navy text.
- **Ghost / Tertiary:** Transparent fill, muted slate text, turning to Navy on hover/pressed states.

### Financial Summary Cards (Money In / Money Out)
- Set to pure white backgrounds with 14px border-radius and 1px muted border (`rgba(0, 41, 112, 0.08)`).
- **Parity of Visual Weight:** "Money In" (Inflow) and "Money Out" (Vendor settlements, refunds) occupy identical 50/50 split modules.
- **Semantic Accents:** Left-hand micro-indicator badge or subtle light-tinted badge:
  - Money In: Light green container (`#DCFCE7`) with Success Emerald text (`#16A34A`).
  - Money Out: Light slate/amber container with Deep Navy or Amber text (`#D97706`).
  - Font sizes for both primary balances share the exact same `currency-display` scale.

### High-Trust Status Badges
- 24px height, pill-shaped (`9999px`), padding: 4px 10px.
- Text style: `label-sm` uppercase with tabular numeric timestamps.
- **Settled / Verified:** Soft green (`#DCFCE7`), text `#15803D`, accompanied by an integrated checkmark line-icon.
- **Processing / Bank Delay:** Soft amber (`#FEF3C7`), text `#B45309`, with a subtle static clock icon.
- **Failed / Refunded:** Soft red (`#FEE2E2`), text `#B91C1C`.

### Form Fields & Inputs
- Height 48px for finger tap accuracy.
- Resting state: White background, 1px border `rgba(0, 41, 112, 0.16)`, label in slate (`#64748B`).
- Focus state: Border color changes to `#00BAF2` with an ambient glow of `0 0 0 3px rgba(0, 186, 242, 0.20)`.
- Rupee prefix: Fixed visual element inside the input field styled in bold Deep Navy.

### Hardware & Telemetry Indicators (Soundbox / POS Terminal)
- Compact status card displaying Soundbox battery, 4G SIM connectivity, and test audio triggers.
- Signal status uses a pulsating dot indicator (Success Emerald for active, Amber for degraded signal, Crimson for offline).