import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const studentBase = process.env.NEXT_PUBLIC_STUDENT_URL || "https://app.puzzlers.in";
  const url = new URL("/register", studentBase);

  // Preserve exam, next, and utm params
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url.toString(), 307);
}
