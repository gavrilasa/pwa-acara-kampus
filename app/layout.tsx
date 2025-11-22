import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileDock from "@/components/MobileDock";
import AppSidebar from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset className="flex min-h-screen w-full bg-zinc-50 transition-all duration-300">
						<div className="flex-1">{children}</div>
					</SidebarInset>
					<MobileDock />
				</SidebarProvider>
			</body>
		</html>
	);
}
