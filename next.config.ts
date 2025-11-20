import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	disable: false, // Wajib false agar jalan
	// Pastikan SW mengontrol halaman secepat mungkin
	workboxOptions: {
		disableDevLogs: false, // Nyalakan log di dev agar terlihat di console
		skipWaiting: true,
		clientsClaim: true,
		runtimeCaching: [
			// 1. MANIFEST.JSON (Wajib di-cache eksplisit)
			{
				urlPattern: /manifest\.json$/i,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "manifest-cache",
					expiration: { maxEntries: 1, maxAgeSeconds: 24 * 60 * 60 },
				},
			},
			// 2. RSC Payload (Data Navigasi Next.js) - Ganti ke StaleWhileRevalidate
			{
				urlPattern: ({ url }) => url.searchParams.has("_rsc"),
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "next-rsc-cache",
					expiration: {
						maxEntries: 200,
						maxAgeSeconds: 24 * 60 * 60, // 1 Hari
					},
				},
			},
			// 3. API Routes
			{
				urlPattern: /\/api\/.*/i,
				handler: "NetworkFirst",
				options: {
					cacheName: "api-cache",
					networkTimeoutSeconds: 10,
					expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
					cacheableResponse: { statuses: [0, 200] },
				},
			},
			// 4. Gambar External & Internal
			{
				urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
				handler: "CacheFirst",
				options: {
					cacheName: "images",
					expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
				},
			},
			// 5. Next.js Static Assets (JS/CSS)
			{
				urlPattern: /_next\/static\/.*/i,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "next-static-js",
					expiration: { maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 },
				},
			},
			// 6. Fallback untuk Halaman HTML
			{
				urlPattern: ({ request }) => request.mode === "navigate",
				handler: "NetworkFirst",
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
