# Shared 04 — Shared Components (`@puzzlers/ui`)

All shadcn/ui components are generated **once** into `packages/ui` (shadcn `components.json` points there) and consumed by all apps. App developers do not run `shadcn add` inside an app.

## 1. Base (shadcn) components

Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Chart (Recharts wrapper), Checkbox, Collapsible, Command, DatePicker (Calendar + Popover), Dialog, Drawer, DropdownMenu, Form (react-hook-form), HoverCard, Input, Label, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner (toasts), Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip.

Variants are customised as in [../07 §6](../07-DESIGN-SYSTEM-AND-BRAND-GUIDELINES.md#6-buttons) (`accent` button variant added).

## 2. Puzzlers composite components

| Component | Purpose | Used by | Key props |
|---|---|---|---|
| `Logo` | Wordmark/logo (placeholder until D-16) | all | `variant: 'full'|'mark'`, `tone: 'light'|'dark'` |
| `PageHeader` | Title, description, breadcrumbs, actions | student, admin | `title`, `description?`, `breadcrumbs?`, `actions?` |
| `EmptyState` | Empty lists | all | `icon`, `title`, `description`, `action?` |
| `ErrorState` | Error with retry and request id | all | `error: ApiError`, `onRetry?` |
| `ForbiddenState` | 403 screens | student, admin | `reason?` |
| `LoadingSkeletons` | Card/list/table skeletons | all | `kind`, `count` |
| `SafeHtml` | Renders sanitised HTML (second pass with an allowlist) | all | `html`, `className` |
| `MathText` | `SafeHtml` + KaTeX auto-render of `\( \)` / `\[ \]` | student, admin | `html`, `size` |
| `PriceTag` | ₹ formatting, compare-at strikethrough, "Free" badge | marketing, student, admin | `pricePaise`, `compareAtPaise?` |
| `ExamBadge` | MHT-CET / JEE Main / JEE Adv chip | all | `code` |
| `StatusBadge` | Draft/Published/Archived, order statuses, attempt statuses | admin, student | `status`, `domain` |
| `DataTable` | TanStack Table + server pagination/sort/filter + row selection + bulk-action bar + column visibility | admin | `columns`, `query`, `bulkActions?` |
| `FilterBar` | Declarative filters synced to the URL query | admin, student | `filters: FilterDef[]` |
| `ConfirmDialog` | Destructive confirmation with a required reason field (optional) | admin | `title`, `requireReason`, `onConfirm` |
| `FileUpload` | Presign → PUT → confirm flow with progress | admin | `purpose`, `accept`, `maxBytes`, `onUploaded(uploadId)` |
| `RichTextEditor` | Tiptap + math + image upload (dynamic import) | admin | `value`, `onChange`, `features` |
| `StatCard` | KPI tile | student, admin | `label`, `value`, `delta?`, `href?` |
| `ChartCard` | Card + Recharts chart + empty state | student, admin | `title`, `children` |
| `ProgressRing` / `ProgressBar` | Course/lesson progress | student | `value` |
| `CourseCard`, `BatchCard`, `TestSeriesCard` | Catalogue cards | marketing, student | `data` (public schemas), `href`, `cta` |
| `CountdownText` | Timer text from a deadline + skew | student | `deadlineAt`, `skewMs` |
| `Section` / `Container` | Marketing layout primitives | marketing | `tone: 'white'|'cream'|'pale'|'navy'` |
| `FAQList` | Accordion FAQ + FAQPage JSON-LD helper | marketing, student | `items` |
| `AuthCard` | Auth form container | student, admin | |

Exam-specific components (palette, question renderers, timer) live in the **student app** (`apps/student/src/features/exam/components`), not in `@puzzlers/ui`. They are not shared. The admin preview imports a read-only renderer exported from `@puzzlers/ui/exam-preview`, which Developer 1 maintains *[Rec]* (`QuestionView` in read-only mode), so the admin preview looks exactly like the student view.

## 3. Rules

1. Components are presentational. No data fetching inside `@puzzlers/ui` (except `FileUpload`, which receives an injected `api` function).
2. Props are typed. Data props use types inferred from `@puzzlers/schemas` where they represent API data.
3. Every interactive component supports keyboard use and has an accessible name.
4. Each component has a usage example in `packages/ui/README.md` (or Storybook *[Rec]*).
5. A breaking prop change needs the same review as a contract change: all consuming developers.
