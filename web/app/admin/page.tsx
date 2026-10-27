import type { Metadata } from "next";
import AdminApp from "./AdminApp";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  manifest: "/admin.webmanifest",
  appleWebApp: { capable: true, title: "Traditum Admin", statusBarStyle: "black-translucent" },
};

export default function AdminPage() {
  return <AdminApp />;
}
