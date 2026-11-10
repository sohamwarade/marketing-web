"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@puzzlers/ui";
import { studentUrl } from "@/lib/links";

export function AuthStateButton() {
  const [user, setUser] = React.useState<{ name?: string } | null>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.puzzlers.in";
    fetch(`${apiBase}/v1/me`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (mounted && data?.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <a href={studentUrl("/dashboard")}>
          <Button variant="default" size="sm" className="font-semibold">
            Go to dashboard
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a href={studentUrl("/login", { next: "/dashboard" })}>
        <Button variant="ghost" size="sm" className="text-body font-semibold hover:text-navy">
          Login
        </Button>
      </a>
      <a href={studentUrl("/register")}>
        <Button variant="accent" size="sm" className="font-semibold shadow-sm">
          Start free
        </Button>
      </a>
    </div>
  );
}
