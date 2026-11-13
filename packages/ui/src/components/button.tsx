import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent" | "outline-light";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]";

    const variants: Record<string, string> = {
      default: "bg-primary text-primary-foreground hover:bg-blue-700 shadow-sm",
      accent: "bg-accent text-accent-foreground hover:bg-yellow-400 font-bold shadow-sm",
      destructive: "bg-destructive text-destructive-foreground hover:bg-red-700 shadow-sm",
      outline: "border border-input bg-transparent hover:bg-muted hover:text-foreground",
      "outline-light": "border border-white/35 bg-white/10 text-white hover:bg-white/20 backdrop-blur-xs shadow-xs",
      secondary: "bg-secondary text-secondary-foreground hover:bg-blue-100",
      ghost: "hover:bg-muted hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
