"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export function Accordion({
  children,
  className,
  type = "single",
  defaultValue = [],
}: {
  children: React.ReactNode;
  className?: string;
  type?: "single" | "multiple";
  defaultValue?: string[];
}) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggleItem = (val: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(val) ? [] : [val]));
    } else {
      setOpenItems((prev) =>
        prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("divide-y divide-border", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("py-2", className)} data-value={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue: value } as any);
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  children,
  className,
  itemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const ctx = React.useContext(AccordionContext);
  const isOpen = itemValue ? ctx?.openItems.includes(itemValue) : false;

  return (
    <button
      type="button"
      onClick={() => itemValue && ctx?.toggleItem(itemValue)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-semibold text-heading transition-all hover:text-primary cursor-pointer text-base",
        className
      )}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180 text-primary"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  itemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const ctx = React.useContext(AccordionContext);
  const isOpen = itemValue ? ctx?.openItems.includes(itemValue) : false;

  if (!isOpen) return null;

  return (
    <div
      className={cn("pb-4 pt-1 text-sm text-body leading-relaxed animate-in fade-in-50", className)}
    >
      {children}
    </div>
  );
}
