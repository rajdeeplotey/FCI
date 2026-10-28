import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reuse already-visited dynamic pages (e.g. client portal tabs) for 30s so
    // Back/Forward and switching tabs are instant. Every portal mutation calls
    // router.refresh(), which bypasses this cache, so data never goes stale
    // after a client action.
    // `static` also governs hover-prefetched portal pages; keep it short so a
    // prefetched page is never more than 30s old when shown.
    staleTimes: { dynamic: 30, static: 30 },
  },
};

export default nextConfig;
