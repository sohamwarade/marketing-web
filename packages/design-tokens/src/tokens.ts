export const brand = {
  navy: "#0D2B5A",
  blue: "#2563EB",
  blue700: "#1D4ED8",
  blue500: "#3B82F6",
  blue300: "#93C5FD",
  blue200: "#BFDBFE",
  blue100: "#DBEAFE",
  blue50: "#EFF6FF",
  amber: "#FFC107",
  yellow400: "#FACC15",
  yellow300: "#FDE047",
} as const;

export const surface = {
  white: "#FFFFFF",
  cream: "#FEF8EB",
  cool: "#F1F5F9",
  gray: "#F9FAFB",
} as const;

export const text = {
  heading: "#111827",
  heading2: "#171717",
  body: "#374151",
  body2: "#4B5563",
  muted: "#6B7280",
} as const;

export const alert = {
  red: "#EF4444",
  redStrong: "#D92D20",
  redDark: "#A91D0F",
} as const;

export const status = {
  success: "#16A34A",
  review: "#7C3AED",
  warning: "#B45309",
} as const;

export const chartSeries = [
  brand.blue,
  brand.navy,
  brand.amber,
  brand.blue300,
  status.success,
] as const;
