import type { NextConfig } from "next"

const githubPages = process.env.GITHUB_PAGES === "true"

const nextConfig: NextConfig = {
  ...(githubPages
    ? {
        output: "export",
        basePath: "/inselfuehrer",
        trailingSlash: true,
      }
    : {}),
  images: {
    unoptimized: true,
  },
  devIndicators: false,
}

export default nextConfig
