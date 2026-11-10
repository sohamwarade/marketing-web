"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button, Container, Section } from "@puzzlers/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Marketing error:", error);
  }, [error]);

  return (
    <Section tone="white" className="py-24 text-center">
      <Container className="max-w-md space-y-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-black text-heading">Something went wrong</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We encountered an issue loading this page. Please try refreshing or check your connection.
        </p>
        <div className="pt-4 flex justify-center">
          <Button onClick={() => reset()} variant="default" className="font-semibold">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </Container>
    </Section>
  );
}
