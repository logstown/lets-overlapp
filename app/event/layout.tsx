import ThemeChooser from "@/components/ThemeChooser";
import Link from "next/link";

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="navbar">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Let's Overlapp
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/event/create" className="btn btn-primary btn-sm">
            New Event
          </Link>
          <ThemeChooser />
        </div>
      </div>
      <div className="p-4 max-w-5xl mx-auto mt-4">{children}</div>
    </>
  );
}
