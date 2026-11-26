import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Allow public routes
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Require login for everything else
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as "admin" | "user";

    // Admin gets full access
    if (role === "admin") {
      return NextResponse.next();
    }

    // Regular "user" RBAC rules:
    // Allow /projects, /projects/<project_id>
    if (role === "user" && pathname.startsWith("/projects")) {
      return NextResponse.next();
    }

    // Redirect unauthorized users
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}

// Only run middleware on app routes (skip static files & Next internals)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
