import Link from "next/link";

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="navbar shadow-sm">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Let's Overlapp
          </Link>
        </div>
        <div className="flex-none">
          <Link href="/event/create" className="btn btn-primary">
            New Event
          </Link>
        </div>
      </div>
      {children}
    </>
  );
}
