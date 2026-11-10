# D3-06 — Marketing UI/UX and Brand Guidelines

Base: [../07](../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md) and tokens in [../shared/03](../shared/03-SHARED-DESIGN-TOKENS.md). Marketing is **visually attractive and conversion-oriented**, but it is still the same product family as the student and admin apps.

## 1. Layout

- Container max 1200 px, gutters 16/24/32 px. Section vertical padding 64 px mobile, 96 px desktop.
- Grid: 12 columns desktop, 6 tablet, 4 mobile.
- `Section` component tones: `white`, `cream` (`--bg-cream`), `pale` (`--brand-blue-50`), `navy` (`--brand-navy` with white text).

## 2. Typography

Display headings in Plus Jakarta Sans 700–800 (`text-display`, `text-h1`, `text-h2`), body in Inter 400/500 at 16–18 px with line height 1.6. Max line length ~70 characters.

## 3. Colour usage

- Primary CTA: amber background + navy text (only one per viewport).
- Secondary CTA: outline or royal blue.
- Links: royal blue, underline on hover/focus.
- The blue gradient appears only in the hero accent panel and optionally the final CTA background. No gradient text.
- Red only for form errors.

## 4. Components

`Header`, `MegaMenu`, `MobileNavSheet`, `Hero`, `ExamCard`, `CourseCard`, `BatchCard`, `TestSeriesCard`, `FeatureTile`, `Stepper`, `TestimonialCard`, `FAQList`, `CTABand`, `Footer`, `PriceTag`, `Breadcrumbs`, `ContactForm`, `LegalLayout`. Cards are shared with the student explore page through `@puzzlers/ui`.

Card spec: radius `--radius-lg`, 1 px border `--border`, hover: lift (`--shadow-md`) + border `--brand-blue-200` (no motion if reduced motion is set). The whole card is clickable via one link (stretched link pattern), and inner buttons are avoided.

## 5. Imagery

- Product screenshots from staging with synthetic data, framed in a simple device mock (custom-made, no third-party branded frames).
- Illustrations: original, flat and in brand colours.
- All images have alt text. Decorative images use `alt=""`.

## 6. Motion

Subtle fade/slide-up on section reveal (≤ 200 ms, once), disabled with `prefers-reduced-motion`. No parallax, no autoplay.

## 7. Responsive behaviour

| Element | Mobile (< 640) | Tablet | Desktop |
|---|---|---|---|
| Header | Logo + hamburger + "Start free" compact | same | Full nav + mega menu |
| Hero | Stacked, CTAs full width | 2-col at ≥ 768 | 2-col 6/6 |
| Card grids | Horizontal scroll-snap (featured) or 1 col (listing) | 2 col | 3–4 col |
| Detail pages | Sticky bottom CTA bar | Sticky side summary at ≥ 1024 | Sticky side summary card |
| Footer | Accordion groups | 2 col | 4 col |

## 8. Accessibility

Skip link, landmark roles, visible focus (2 px royal-blue ring), the menu operable by keyboard (Esc closes, focus trap in the mobile sheet), accordions as `button` + `aria-expanded`, contrast per [../07 §3](../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md#3-contrast-computed-verify-with-a-contrast-checker-in-design-review), form errors linked with `aria-describedby`.
