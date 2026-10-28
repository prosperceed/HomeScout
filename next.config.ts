import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
	partialPrefetching: true,
	turbopack: {
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
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
