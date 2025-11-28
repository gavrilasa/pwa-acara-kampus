import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	disable: process.env.NODE_ENV === "development",
	workboxOptions: {
		disableDevLogs: false,
		skipWaiting: true,
		clientsClaim: true,
		runtimeCaching: [
			{
				urlPattern: /manifest\.json$/i,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "manifest-cache",
					expiration: { maxEntries: 1, maxAgeSeconds: 24 * 60 * 60 },
				},
			},
			{
				urlPattern: ({ url }) => url.searchParams.has("_rsc"),
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "next-rsc-cache",
					expiration: {
						maxEntries: 200,
						maxAgeSeconds: 24 * 60 * 60,
					},
				},
			},
			{
				urlPattern: /\/api\/.*/i,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "api-cache",
					expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
					cacheableResponse: { statuses: [0, 200] },
				},
			},
			{
				urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
				handler: "CacheFirst",
				options: {
					cacheName: "images",
					expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
				},
			},
			{
				urlPattern: /_next\/static\/.*/i,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "next-static-js",
					expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 },
				},
			},
			{
				urlPattern: ({ request }) => request.mode === "navigate",
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "pages",
					expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
				},
			},
		],
	},
});

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default withPWA(nextConfig);
