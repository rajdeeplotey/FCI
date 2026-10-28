"use client";

import { usePathname } from "next/navigation";

// The client portal and the admin panel are full-screen app shells, so the
// marketing footer is hidden there (admin login keeps it). Other routes render
// it unchanged.
export default function FooterVisibility({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const inPortal = pathname === "/portal" || pathname.startsWith("/portal/");
  const inAdminPanel = (pathname === "/admin" || pathname.startsWith("/admin/")) &&
    !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/team-login");
  if (inPortal || inAdminPanel) return null;
  return children;
}
