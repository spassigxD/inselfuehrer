import type { NextConfig } from "next"

const githubPages = process.env.GITHUB_PAGES === "true"
const basePath = githubPages ? "/inselfuehrer" : ""

const nextConfig: NextConfig = {
  ...(githubPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
}

export default nextConfig
