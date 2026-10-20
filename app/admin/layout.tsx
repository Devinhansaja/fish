import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** The admin panel has no public header/footer/effects: it lives outside the (site) group. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The admin panel always stays in light mode, whatever the site theme is.
  return (
    <div data-theme="light" className="min-h-screen bg-slate-100 text-navy">
      {children}
    </div>
  );
}
