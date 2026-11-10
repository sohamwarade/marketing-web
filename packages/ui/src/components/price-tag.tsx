import * as React from "react";
import { cn } from "../lib/utils";
import { Badge } from "./badge";

export interface PriceTagProps {
  pricePaise: number;
  compareAtPricePaise?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function formatINR(paise: number): string {
  const rupees = Math.floor(paise / 100);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function PriceTag({ pricePaise, compareAtPricePaise, className, size = "md" }: PriceTagProps) {
  if (pricePaise === 0) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <Badge variant="success" className="text-xs font-bold px-2.5 py-0.5">
          FREE
        </Badge>
      </div>
    );
  }

  const textSizes: Record<string, string> = {
    sm: "text-base font-bold",
    md: "text-xl font-extrabold",
    lg: "text-2xl font-black",
  };

  const discount =
    compareAtPricePaise && compareAtPricePaise > pricePaise
      ? Math.round(((compareAtPricePaise - pricePaise) / compareAtPricePaise) * 100)
      : null;

  return (
    <div className={cn("inline-flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn("text-heading tracking-tight", textSizes[size])}>
        {formatINR(pricePaise)}
      </span>
      {compareAtPricePaise && compareAtPricePaise > pricePaise && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatINR(compareAtPricePaise)}
          </span>
          {discount && (
            <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
