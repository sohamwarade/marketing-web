# Shared 03 — Design Tokens

Package: `@puzzlers/design-tokens`. Usage guidelines: [../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md](../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md).

Tailwind CSS v4 (CSS-first config) is assumed. If the PoC pins Tailwind v3, §4 gives the equivalent `tailwind.config` preset.

## 1. `tokens.css` (raw brand tokens + semantic shadcn variables)

```css
/* packages/design-tokens/src/tokens.css */
:root {
  /* ---------- Brand (raw) ---------- */
  --brand-navy: #0D2B5A;
  --brand-blue: #2563EB;
  --brand-blue-700: #1D4ED8;
  --brand-blue-500: #3B82F6;
  --brand-blue-300: #93C5FD;
  --brand-blue-200: #BFDBFE;
  --brand-blue-100: #DBEAFE;
  --brand-blue-50:  #EFF6FF;
  --brand-gradient: linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%);

  --accent-amber: #FFC107;
  --accent-yellow-400: #FACC15;
  --accent-yellow-300: #FDE047;

  --bg-white: #FFFFFF;
  --bg-cream: #FEF8EB;
  --bg-cool:  #F1F5F9;
  --bg-gray:  #F9FAFB;

  --text-heading:   #111827;
  --text-heading-2: #171717;
  --text-body:      #374151;
  --text-body-2:    #4B5563;
  --text-muted:     #6B7280;

  --alert-red: #EF4444;
  --alert-red-strong: #D92D20;
  --alert-red-dark: #A91D0F;
  --alert-gradient: linear-gradient(90deg, #A91D0F 0%, #D92D20 50%, #A91D0F 100%);

  /* ---------- Functional status (D-16 to confirm) ---------- */
  --status-success: #16A34A;
  --status-success-bg: #DCFCE7;
  --status-review: #7C3AED;
  --status-review-bg: #EDE9FE;
  --status-warning: #B45309;
  --status-warning-bg: #FEF3C7;
  --status-neutral: #F3F4F6;
  --status-neutral-border: #D1D5DB;

  /* ---------- Semantic (shadcn/ui variable names) ---------- */
  --background: var(--bg-white);
  --foreground: var(--text-body);
  --card: var(--bg-white);
  --card-foreground: var(--text-body);
  --popover: var(--bg-white);
  --popover-foreground: var(--text-body);
  --primary: var(--brand-blue);
  --primary-foreground: #FFFFFF;
  --secondary: var(--brand-blue-50);
  --secondary-foreground: var(--brand-blue-700);
  --muted: var(--bg-cool);
  --muted-foreground: var(--text-muted);
  --accent: var(--accent-amber);
  --accent-foreground: var(--brand-navy);
  --destructive: var(--alert-red-strong);
  --destructive-foreground: #FFFFFF;
  --border: #E5E7EB;
  --input: #D1D5DB;
  --ring: var(--brand-blue);
  --heading: var(--text-heading);
  --brand: var(--brand-navy);

  /* Charts (shadcn chart vars) */
  --chart-1: var(--brand-blue);
  --chart-2: var(--brand-navy);
  --chart-3: var(--accent-amber);
  --chart-4: var(--brand-blue-300);
  --chart-5: var(--status-success);

  /* Sidebar (shadcn sidebar vars) */
  --sidebar: var(--brand-navy);
  --sidebar-foreground: #E5EDFF;
  --sidebar-primary: var(--accent-amber);
  --sidebar-primary-foreground: var(--brand-navy);
  --sidebar-accent: #16396F;
  --sidebar-accent-foreground: #FFFFFF;
  --sidebar-border: #1B3A6B;
  --sidebar-ring: var(--brand-blue-300);

  /* ---------- Shape & depth ---------- */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius: var(--radius-md);            /* shadcn base radius */
  --shadow-sm: 0 1px 2px rgba(13, 43, 90, 0.06), 0 1px 3px rgba(13, 43, 90, 0.08);
  --shadow-md: 0 4px 12px rgba(13, 43, 90, 0.10);
  --shadow-lg: 0 12px 32px rgba(13, 43, 90, 0.16);

  /* ---------- Typography ---------- */
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-display: "Plus Jakarta Sans", var(--font-sans);
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* ---------- Exam palette ---------- */
  --palette-not-visited-bg: var(--status-neutral);
  --palette-not-visited-fg: var(--text-body);
  --palette-not-answered-bg: var(--alert-red-strong);
  --palette-answered-bg: var(--status-success);
  --palette-review-bg: var(--status-review);
  --palette-fg-on-color: #FFFFFF;
  --palette-current-ring: var(--brand-navy);
}

/* App surface presets: set on <body data-surface="..."> */
[data-surface="marketing"] { --background: var(--bg-white); }
[data-surface="student"]   { --background: var(--bg-cool); }
[data-surface="admin"]     { --background: var(--bg-gray); }
[data-surface="exam"]      { --background: var(--bg-white); }
```

## 2. Tailwind v4 theme mapping (`theme.css`)

```css
/* packages/design-tokens/src/theme.css */
@import "./tokens.css";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-heading: var(--heading);

  --color-navy: var(--brand-navy);
  --color-blue: var(--brand-blue);
  --color-blue-700: var(--brand-blue-700);
  --color-blue-500: var(--brand-blue-500);
  --color-blue-300: var(--brand-blue-300);
  --color-blue-200: var(--brand-blue-200);
  --color-blue-100: var(--brand-blue-100);
  --color-blue-50: var(--brand-blue-50);
  --color-amber: var(--accent-amber);
  --color-yellow-400: var(--accent-yellow-400);
  --color-yellow-300: var(--accent-yellow-300);
  --color-cream: var(--bg-cream);
  --color-cool: var(--bg-cool);
  --color-gray-50: var(--bg-gray);
  --color-body: var(--text-body);
  --color-body-2: var(--text-body-2);
  --color-success: var(--status-success);
  --color-success-bg: var(--status-success-bg);
  --color-review: var(--status-review);
  --color-review-bg: var(--status-review-bg);
  --color-warning: var(--status-warning);
  --color-warning-bg: var(--status-warning-bg);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);

  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);

  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
  --font-mono: var(--font-mono);

  --text-display: 3.5rem;
  --text-display--line-height: 1.1;
  --text-question: 1.0625rem;
  --text-question--line-height: 1.7;
}
```

Each app's `globals.css`:

```css
@import "tailwindcss";
@import "@puzzlers/design-tokens/theme.css";
@source "../../../packages/ui/src";   /* let Tailwind scan shared components */
```

Fonts are loaded with `next/font/google` in each app's root layout, which sets `--font-sans` / `--font-display` on `<html>`.

## 3. TS constants (`tokens.ts`)

For charts, canvas, OG images and email templates, where CSS variables cannot be used.

```ts
export const brand = {
  navy: "#0D2B5A", blue: "#2563EB", blue700: "#1D4ED8", blue500: "#3B82F6",
  blue300: "#93C5FD", blue200: "#BFDBFE", blue100: "#DBEAFE", blue50: "#EFF6FF",
  amber: "#FFC107", yellow400: "#FACC15", yellow300: "#FDE047",
} as const;
export const surface = { white: "#FFFFFF", cream: "#FEF8EB", cool: "#F1F5F9", gray: "#F9FAFB" } as const;
export const text = { heading: "#111827", heading2: "#171717", body: "#374151", body2: "#4B5563", muted: "#6B7280" } as const;
export const alert = { red: "#EF4444", redStrong: "#D92D20", redDark: "#A91D0F" } as const;
export const status = { success: "#16A34A", review: "#7C3AED", warning: "#B45309" } as const;
export const chartSeries = [brand.blue, brand.navy, brand.amber, brand.blue300, status.success] as const;
```

## 4. Tailwind v3 fallback preset (only if the PoC pins v3)

```js
// packages/config/tailwind-preset.cjs
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)", foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border: "var(--border)", input: "var(--input)", ring: "var(--ring)",
        navy: "var(--brand-navy)", cream: "var(--bg-cream)", amber: "var(--accent-amber)",
        success: "var(--status-success)", review: "var(--status-review)",
      },
      borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)" },
      fontFamily: { sans: "var(--font-sans)", display: "var(--font-display)" },
    },
  },
};
```

## 5. Rules

- Components use semantic classes (`bg-primary`, `text-muted-foreground`), not raw brand classes, except marketing hero/brand sections (`bg-navy`, `bg-cream`).
- No hex values in app code. A lint rule (`no-restricted-syntax` on `/#[0-9a-f]{3,6}/i` in `className` strings) *[Rec]*.
- Changes to tokens require review by all three developers (they affect every app).
