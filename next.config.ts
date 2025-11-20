import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	disable: process.env.NODE_ENV === "development", // Matikan di dev agar tidak caching agresif
	workboxOptions: {
		disableDevLogs: true,
	},
});

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Mengizinkan semua domain gambar (Pragmatis untuk development)
			},
		],
	},
};

export default withPWA(nextConfig);
