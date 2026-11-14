import { NextResponse, type NextRequest } from "next/server";
import { serverClient, configured } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code && configured()) {
    const client = await serverClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/edit", request.url));
  }
  return NextResponse.redirect(new URL("/login?error=auth", request.url));
}
