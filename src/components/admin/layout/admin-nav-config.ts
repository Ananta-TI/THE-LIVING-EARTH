import {
  BarChart3,
  BookOpen,
  Compass,
  FileText,
  Globe2,
  Images,
  Inbox,
  LayoutDashboard,
  Settings,
  Tags,
  type LucideIcon,
} from "lucide-react";

export const ADMIN_NAV_ICONS: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/articles": FileText,
  "/admin/pillars": Compass,
  "/admin/topics": Tags,
  "/admin/case-studies": Globe2,
  "/admin/statistics": BarChart3,
  "/admin/references": BookOpen,
  "/admin/media": Images,
  "/admin/messages": Inbox,
  "/admin/settings": Settings,
};

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
