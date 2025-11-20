import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Daftar Acara Kampus",
	description: "Cari info seminar dan lomba kampus",
	manifest: "/manifest.json",
};

export const viewport: Viewport = {
	themeColor: "#2563eb",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="id">
			<body className={`${inter.className} bg-gray-50 min-h-screen`}>
				{/* Desktop Sidebar */}
				<Sidebar />

				{/* Main Content Wrapper */}
				{/* md:pl-64 pushes content to the right when sidebar is visible */}
				<main className="md:pl-64 min-h-screen transition-all duration-300">
					{/* Container to limit width on ultra-wide screens */}
					<div className="max-w-7xl mx-auto min-h-screen pb-20 md:pb-0">
						{children}
					</div>
				</main>

				{/* Mobile Bottom Nav */}
				<BottomNav />
			</body>
		</html>
	);
}
