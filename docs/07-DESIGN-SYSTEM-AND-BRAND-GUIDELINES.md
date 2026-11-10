# 07 — Design System and Brand Guidelines

The exact token values (CSS variables, the Tailwind theme, TS constants) are in [shared/03-SHARED-DESIGN-TOKENS.md](shared/03-SHARED-DESIGN-TOKENS.md). This document explains **how** to use them. The shared component inventory is in [shared/04-SHARED-COMPONENTS.md](shared/04-SHARED-COMPONENTS.md).

> **Source of the palette:** colours supplied in the brief, extracted from the existing Aaditya COEP website. The PRD lists "final branding" as an open item (C-09). The palette is adopted as the working brand. The logo, wordmark and fonts are still **D-16**.

## 1. Brand palette

| Role | Token | Hex |
|---|---|---|
| Deep Navy (primary identity, headers, dark surfaces) | `--brand-navy` | `#0D2B5A` |
| Royal Blue (primary actions, links) | `--brand-blue` | `#2563EB` |
| Blue gradient start / end | `--brand-blue-700` / `--brand-blue-500` | `#1D4ED8` → `#3B82F6` |
| Light Blue | `--brand-blue-200` / `--brand-blue-300` | `#BFDBFE` / `#93C5FD` |
| Pale Blue (secondary cards, highlighted sections) | `--brand-blue-100` / `--brand-blue-50` | `#DBEAFE` / `#EFF6FF` |
| Amber (key accent, CTA highlight) | `--accent-amber` | `#FFC107` |
| Yellow | `--accent-yellow-400` / `--accent-yellow-300` | `#FACC15` / `#FDE047` |
| White | `--bg-white` | `#FFFFFF` |
| Warm Cream (primary alt background) | `--bg-cream` | `#FEF8EB` |
| Cool Off-White | `--bg-cool` | `#F1F5F9` |
| Light Gray | `--bg-gray` | `#F9FAFB` |
| Heading primary / secondary | `--text-heading` / `--text-heading-2` | `#111827` / `#171717` |
| Body / secondary body / muted | `--text-body` / `--text-body-2` / `--text-muted` | `#374151` / `#4B5563` / `#6B7280` |
| Alert red | `--alert-red` | `#EF4444` |
| Red gradient | `--alert-red-dark` → `--alert-red-strong` → `--alert-red-dark` | `#A91D0F` → `#D92D20` → `#A91D0F` |

### Functional colours added by this document *[Rec]*

The brand palette has no green or purple, but the CBT palette and success feedback need them (students recognise NTA's convention). These are **functional status colours, not brand colours**. Use them only for states.

| Token | Hex | Use |
|---|---|---|
| `--status-success` | `#16A34A` | Answered (palette), payment success, completed lesson |
| `--status-success-bg` | `#DCFCE7` | Success backgrounds |
| `--status-review` | `#7C3AED` | Marked for review (palette) |
| `--status-review-bg` | `#EDE9FE` | |
| `--status-warning` | `#B45309` | Warning text on light backgrounds (amber is too light for text) |

Owner confirmation of these additions is part of **D-16**.

## 2. Rules

1. Navy and royal blue carry the brand. Amber/yellow are accents: one primary CTA highlight per view, badges ("Free", "New"), and focus highlights on marketing.
2. Page backgrounds: white or warm cream. Cool off-white / light gray for app canvases (student and admin). Pale blue for secondary cards and highlighted bands.
3. **Red is reserved** for errors, warnings, destructive actions and the exam "not answered" state. The exam state is a warning-class state, which rule 5 of the brief permits.
4. Gradients: only the blue gradient, only on marketing hero/CTA bands, at most one per screen. Never behind small text (see contrast). The red gradient is for critical banners only (e.g. "exam ends in 1 minute").
5. Radii, spacing and shadows come from tokens only. No arbitrary `rounded-[13px]` or hex values in components (lint rule *[Rec]*).
6. Every interactive element has a visible focus ring (`--ring` = royal blue, 2 px, 2 px offset).
7. Dark mode: **not in the MVP**. Tokens are named semantically, so dark mode can be added later. Exception: the exam may offer a high-contrast toggle (Phase 6+).

## 3. Contrast (computed; verify with a contrast checker in design review)

| Foreground on background | Ratio (approx.) | Use allowed |
|---|---|---|
| Navy `#0D2B5A` on white | ~13:1 | All text |
| Royal Blue `#2563EB` on white | ~5.2:1 | All text, links, buttons |
| White on Royal Blue `#2563EB` | ~5.2:1 | Primary button text |
| White on `#3B82F6` | ~3.7:1 | **Large text only** (≥ 24 px, or 19 px bold) |
| Royal Blue on Pale Blue `#DBEAFE` | ~4.2:1 | **Large text only**. Use `#1D4ED8` (~5.4:1) or navy for small text |
| Navy on Amber `#FFC107` | ~8:1 | Amber CTA text |
| White on Amber | ~1.6:1 | **Never** |
| Red `#EF4444` on white | ~3.8:1 | Icons, borders, large text only |
| Strong red `#D92D20` on white | ~4.8:1 | Error text |
| Muted `#6B7280` on white | ~4.8:1 | Secondary text |
| Muted on cream `#FEF8EB` | ~4.6:1 | Secondary text (borderline; prefer `#4B5563`) |

## 4. Typography *[Rec, D-16]*

| Role | Font | Weights |
|---|---|---|
| UI and body | **Inter** (via `next/font/google`, self-hosted at build) | 400, 500, 600, 700 |
| Marketing display headings | **Plus Jakarta Sans** | 600, 700, 800 |
| Numbers in exam, results, admin tables | Inter with `font-variant-numeric: tabular-nums` | |
| Code/IDs in admin | system monospace stack | |
| Math | KaTeX fonts | |

Type scale (rem; base 16 px):

| Token | Size / line height | Use |
|---|---|---|
| `text-display` | 3.5 / 1.1 (mobile 2.25) | Marketing hero |
| `text-h1` | 2.25 / 1.2 | Page titles (marketing) |
| `text-h2` | 1.75 / 1.25 | Section titles |
| `text-h3` | 1.375 / 1.3 | Card titles |
| `text-h4` | 1.125 / 1.4 | App page titles (student/admin) |
| `text-body` | 1 / 1.6 | Body |
| `text-sm` | 0.875 / 1.5 | Secondary, table cells (admin) |
| `text-xs` | 0.75 / 1.4 | Labels, badges |
| `text-question` | 1.0625 / 1.7 (user-scalable 90–140 %) | Exam question text |

## 5. Spacing, radius, elevation

- Spacing: the Tailwind 4 px scale. Page gutters: 16 px mobile, 24 px tablet, 32 px desktop. Max content width: 1200 px (marketing), fluid (admin), 1100 px (student reading surfaces).
- Radius: `--radius-sm` 6 px (inputs, badges), `--radius-md` 10 px (buttons, cards), `--radius-lg` 16 px (marketing cards, modals), `--radius-full` (pills, palette buttons may use `--radius-sm`).
- Elevation: `--shadow-sm` (cards), `--shadow-md` (dropdowns, popovers), `--shadow-lg` (modals). Admin uses borders more than shadows.

## 6. Buttons

| Variant | Style | Use |
|---|---|---|
| `primary` | Royal Blue bg, white text, hover `#1D4ED8` | Main action per view |
| `accent` | Amber bg, navy text, hover `#FACC15` | Marketing conversion CTA ("Start free"). Max one per section. |
| `secondary` | Pale Blue bg `#EFF6FF`, text `#1D4ED8`, border `#BFDBFE` | Secondary actions |
| `outline` | White bg, border `#D1D5DB`, text heading | Neutral actions |
| `ghost` | Transparent, text body | Toolbars, table row actions |
| `destructive` | `#D92D20` bg, white text | Delete, revoke, suspend, refund |
| `link` | Royal Blue text, underline on hover | Inline |

Sizes: `sm` 32 px, `md` 40 px, `lg` 48 px (marketing CTAs, exam footer buttons on mobile). Minimum touch target: 44 × 44 px on touch devices.

## 7. Application-specific tuning

| Aspect | Marketing | Student | Admin |
|---|---|---|---|
| Goal | Conversion, trust | Focus, low distraction | Density, speed |
| Background | White + cream bands, pale blue highlights | Cool off-white canvas, white cards | Light gray canvas, white panels |
| Navigation | Top nav + mega menu (exams), sticky CTA | Left sidebar (desktop), bottom nav (mobile) | Collapsible left sidebar grouped by module, top bar with search |
| Density | Generous spacing, large type | Comfortable | Compact: 36 px rows, `text-sm` tables |
| Accents | Amber CTAs, blue gradient hero | Amber only for "Continue" or streak highlights | Almost none; status badges only |
| Motion | Subtle reveal on scroll (respect `prefers-reduced-motion`) | Minimal | None beyond feedback |
| Exam screen | n/a | **No brand chrome**: navy header bar, white question pane, palette panel; no marketing elements | n/a |

## 8. CBT palette visual spec

| State | Fill | Text | Shape / marker |
|---|---|---|---|
| Not visited | `#F3F4F6` + border `#D1D5DB` | `#374151` | Square |
| Not answered | `#D92D20` | white | Square with bottom-cut ("flag" shape) |
| Answered | `--status-success` | white | Square with top-cut |
| Marked for review | `--status-review` | white | Circle |
| Answered & marked | `--status-review` | white | Circle + small green dot badge |
| Current question | any of the above + 2 px navy outline | | |

The shapes duplicate the colour meaning, so the palette works for colour-blind students (WCAG 1.4.1). The legend with counts is always visible.

## 9. Iconography and imagery

- Icons: `lucide-react` (shadcn default), 1.5 px stroke, 16/20/24 px.
- Illustrations: original only. No imagery that imitates other brands' visual identity.
- Photos of students: only with written consent (see the testimonial policy in [developer-3 05](developer-3-marketing-website/05-CONTENT-AND-COPYWRITING-GUIDELINES.md)).

## 10. Accessibility baseline

WCAG 2.2 AA: contrast as in §3, keyboard operability, focus visible, `prefers-reduced-motion`, form labels and error association, `lang="en"`, skip links, and screen-reader names for palette buttons ("Question 12, answered and marked for review").
