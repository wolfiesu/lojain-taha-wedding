import { Link } from "@tanstack/react-router";

const items = [
  {
    to: "/",
    label: "Home",
    icon: <path d="M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5" />,
  },
  {
    to: "/details",
    label: "Details",
    icon: (
      <>
        <path d="M12 21V11" />
        <path d="M12 13C12 7 8 4 2.5 4 2.5 10 6 13 12 13Z" />
        <path d="M12 13c0-6 4-9 9.5-9 0 6-3.5 9-9.5 9Z" />
      </>
    ),
  },
  {
    to: "/rsvp",
    label: "RSVP",
    icon: <path d="M12 20.5 10.6 19.2C5.5 14.6 2.2 11.6 2.2 7.9 2.2 4.9 4.5 2.6 7.5 2.6c1.7 0 3.3.8 4.5 2.1 1.2-1.3 2.8-2.1 4.5-2.1 3 0 5.3 2.3 5.3 5.3 0 3.7-3.3 6.7-8.4 11.3Z" />,
  },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/40 bg-background/90 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md justify-around px-6 pb-2 pt-3">
        {items.map((it) => (
          <li key={it.to}>
            <Link
              to={it.to}
              activeOptions={{ exact: true }}
              className="group flex flex-col items-center gap-1 px-3 text-muted-foreground transition-colors hover:text-antique data-[status=active]:text-primary"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" aria-hidden>
                {it.icon}
              </svg>
              <span className="label-caps text-[10px]">{it.label}</span>
              <span className="h-px w-0 bg-current transition-all group-data-[status=active]:w-5" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
