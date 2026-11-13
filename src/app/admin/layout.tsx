import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Admin CMS — THE LIVING EARTH",
    template: "%s | Admin CMS — THE LIVING EARTH",
  },
  description:
    "Editorial Content Management System and scientific publishing workspace for THE LIVING EARTH.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
