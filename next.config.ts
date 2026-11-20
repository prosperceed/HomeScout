import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		useTypeScriptCli: false,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "maps.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "**.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "**.supabase.co",
			},
		],
	},
};

export default nextConfig;
