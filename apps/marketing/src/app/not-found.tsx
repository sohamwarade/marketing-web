import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button, Container, Section } from "@puzzlers/ui";

export default function NotFound() {
  return (
    <Section tone="white" className="py-24 text-center">
      <Container className="max-w-md space-y-5">
        <span className="text-5xl font-black text-primary font-display">404</span>
        <h1 className="text-2xl font-black text-heading">Page Not Found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The course, batch, or page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link href="/">
            <Button variant="default" className="font-semibold">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" className="font-semibold">
              Browse Courses
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
