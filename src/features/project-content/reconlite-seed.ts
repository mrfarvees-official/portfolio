// Original case-study copy based on ReconLite's source and CASE_STUDY.md.
// https://github.com/mrfarvees-official/reconlite
export const reconLiteIntro = "ReconLite is a deliberately passive website security inspector. It runs eight server-side checks in parallel and streams clear, actionable findings into a terminal-style interface without sending exploit payloads.";

export const reconLiteSummary = "A passive website security inspector that streams checks for headers, cookies, CORS, TLS, DNS, exposed technology, CVEs and database error leaks.";

export const reconLiteSections = [
  {
    title: "The problem",
    body: "A useful website security review often starts with information the site already publishes: response headers, cookie attributes, TLS certificate metadata, DNS policies and software version banners. Collecting and interpreting those signals manually takes time, while many public scanners blur the line between inspection and active exploitation.\n\nReconLite provides a smaller, defensible tool for this first-pass review. It accepts an authorized public hostname, runs passive checks server-side and explains both the finding and the remediation without attempting SQL injection, XSS, brute force or directory enumeration.",
  },
  {
    title: "What it checks",
    body: "ReconLite runs eight isolated modules:\n\n- **HTTP headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.\n- **Cookies:** `Secure`, `HttpOnly` and `SameSite` attributes, with stronger severity for session-like names.\n- **CORS:** unsafe origin reflection combined with credential access.\n- **TLS:** certificate trust and expiry, negotiated protocol and acceptance of legacy protocols.\n- **DNS:** SPF and DMARC records through DNS-over-HTTPS.\n- **Technology:** server headers, generator metadata and JavaScript library filenames.\n- **CVE matching:** NVD lookups for disclosed product versions.\n- **Database error leaks:** verbose SQL error strings in normal public responses.\n\nEach module returns structured findings with a severity, explanation and recommended fix.",
  },
  {
    title: "A deliberately passive scope",
    body: "The project does not send exploit payloads. The database leak module only checks the homepage, `robots.txt` and `/.well-known/security.txt` for errors the server would return normally. The CORS module sends a regular request with a test `Origin` and inspects the response; it does not access authenticated user data.\n\nThis boundary is intentional. A public form cannot reliably verify ownership strongly enough to justify active exploitation. Active testing would require verified domain ownership, an agreed scope and an audit trail, so it belongs in a separate engagement tool rather than this portfolio application.",
  },
  {
    title: "Protecting the scanner from SSRF",
    body: "Fetching a user-supplied hostname makes server-side request forgery the scanner's main application risk. ReconLite rejects IP literals and non-public hostnames up front, permits only HTTPS on port 443 and routes every outbound connection through a custom DNS lookup.\n\nThat lookup rejects private, loopback and link-local addresses at connection time. Performing the check when the socket connects also protects against DNS rebinding, where a hostname first resolves publicly and later changes to an internal address. Response bodies are capped and every network operation has a timeout.",
  },
  {
    title: "Streaming parallel checks",
    body: "The scan endpoint starts all modules concurrently and returns a Server-Sent Events stream. A module emits its start state immediately, then replaces that line in the terminal when its findings arrive. A shared memoized page fetch prevents multiple modules from repeatedly requesting the same homepage.\n\nThe terminal supports `scan`, `modules`, `report`, `clear` and `help`, with command history, tab completion and scan cancellation. Network failures are converted into short terminal messages rather than exposing server stack traces.",
  },
  {
    title: "Responsible CVE reporting",
    body: "The technology module can turn disclosed product versions into NVD searches, but a version match is evidence to investigate rather than proof of a vulnerability. Linux distributions frequently backport security fixes without changing the upstream version number.\n\nReconLite therefore tells the user to verify the real patch level. NVD results are cached for six hours, globally spaced to respect API limits and capped at four lookups per scan. An optional NVD API key increases the available request rate.",
  },
  {
    title: "Abuse controls",
    body: "Authorization confirmation is enforced again by the server rather than trusted from the interface. Each IP is limited to five scans per ten minutes and one active scan at a time. Domain validation, HTTPS-only requests, response limits and per-module timeouts further constrain how the scanner can be used.\n\nThe current limiter is intentionally in memory, which is sufficient for a single application process. A horizontally scaled deployment would replace it with Redis or another shared store.",
  },
  {
    title: "Deployment",
    body: "ReconLite is built with Next.js, React and TypeScript. The production setup runs the application under PM2 on a localhost-only port, with Nginx as the public reverse proxy and Certbot managing HTTPS certificates.\n\nThe deployment script performs a fast-forward source update, installs dependencies, builds the application, restarts the PM2 process and validates the Nginx configuration. The live application is available at [recon.farvees.xyz](https://recon.farvees.xyz), and the source is available on [GitHub](https://github.com/mrfarvees-official/reconlite).",
  },
  {
    title: "Result",
    body: "ReconLite combines eight passive security checks behind one terminal-style workflow. It turns public configuration signals into readable findings and practical fixes while keeping the scanner's network access and behavior deliberately constrained.\n\nThe project demonstrates streamed server work, defensive networking, security-focused input validation, modular analysis and a production deployment pipeline in a compact developer tool.",
  },
  {
    title: "What I'd do next",
    body: "The next improvements would be:\n\n- Replace in-memory rate limiting with a shared Redis or managed KV store for multi-instance deployments.\n- Use a public-suffix-aware library for organizational-domain detection on domains such as `example.co.uk`.\n- Add verified domain ownership for any future checks that go beyond passive inspection.\n- Add automated fixtures for TLS, DNS and response-header edge cases.",
  },
];
