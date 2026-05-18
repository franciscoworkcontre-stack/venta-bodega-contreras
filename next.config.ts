import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.samsung.com" },
      { hostname: "cl-dam-resizer.ecomm.cencosud.com" },
      { hostname: "cl-paris-media-hub.ecomm.cencosud.com" },
      { hostname: "stjqmackfgkxdxypedsy.supabase.co" },
      { hostname: "www.bgarden.cl" },
      { hostname: "www.thenorthface.cl" },
      { hostname: "i.ebayimg.com" },
      { hostname: "media.ralphlauren.global" },
    ],
  },
};

export default nextConfig;
