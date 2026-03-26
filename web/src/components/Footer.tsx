import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        backgroundColor: "#0F1117",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#4ECDC4" }}
              >
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M9 2C9 2 4 6.5 4 10a5 5 0 0010 0c0-3.5-5-8-5-8z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                className="font-bold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                River Rats
              </span>
            </Link>
            <p className="text-sm" style={{ color: "#5c6070" }}>
              Never run a river alone.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex gap-6">
            {[
              { href: "/rivers", label: "Rivers" },
              { href: "/trips", label: "Trips" },
              { href: "/#features", label: "Features" },
              { href: "/#waitlist", label: "Waitlist" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#8B8FA8" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/riverratsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-white"
              style={{ color: "#8B8FA8" }}
              aria-label="River Rats on X (Twitter)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @riverratsapp
            </a>
          </div>
        </div>

        <div
          className="mt-8 border-t pt-8 text-center text-xs"
          style={{ borderColor: "rgba(255,255,255,0.06)", color: "#5c6070" }}
        >
          © {new Date().getFullYear()} River Rats. Built for paddlers, by paddlers.
        </div>
      </div>
    </footer>
  );
}
