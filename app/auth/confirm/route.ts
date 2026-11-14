import { NextResponse, type NextRequest } from "next/server";
import { serverClient, configured } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get("token_hash");
  if (hash && configured()) {
    const client = await serverClient();
    const { error } = await client.auth.verifyOtp({ token_hash: hash, type: "email" });
    if (!error) return NextResponse.redirect(new URL("/edit", request.url));
  }
  return NextResponse.redirect(new URL("/login?error=auth", request.url));
}
