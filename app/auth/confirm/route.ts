import { NextResponse, type NextRequest } from "next/server";
import { serverClient, configured } from "@/lib/supabase/server";
import { confirmSignIn } from "@/lib/auth-confirmation";
export async function GET(request: NextRequest) {
  if (configured()) {
    const client = await serverClient();
    if (await confirmSignIn(request.nextUrl.searchParams, client.auth)) {
      return NextResponse.redirect(new URL("/edit", request.url));
    }
  }
  return NextResponse.redirect(new URL("/login?error=auth", request.url));
}
