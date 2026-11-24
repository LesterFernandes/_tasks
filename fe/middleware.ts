// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value; // Match your Fastify cookie name

  // Allow public login page
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Redirect to /login if no token exists
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;
    console.log(role, payload);

    // RBAC: Block non-admins from /users
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/projects", req.url));
    }

    return NextResponse.next();
  } catch {
    // Token expired or tampered with
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}

export const config = {
  matcher: ["/projects/:path*", "/users/:path*", "/login"],
};
