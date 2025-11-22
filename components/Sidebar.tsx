"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, Info, Sparkles } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/categories", label: "Kategori", icon: Grid },
		{ href: "/favorites", label: "Favorit", icon: Heart },
		{ href: "/about", label: "About", icon: Info },
	];

	return (
		// collapsible="icon" memungkinkan sidebar menyusut jadi ikon saja
		// hidden md:flex memastikan sidebar BENAR-BENAR HILANG di mobile agar tidak bentrok dengan MobileDock
		<Sidebar collapsible="icon" className="hidden md:flex border-r-zinc-200">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
									<Sparkles className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold text-zinc-900">
										KampusEvent
									</span>
									<span className="text-zinc-500">v2.0</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton
										asChild
										tooltip={item.label} // Tooltip muncul otomatis saat collapsed
										isActive={pathname === item.href}
										className="hover:bg-zinc-100 data-[active=true]:bg-indigo-50 data-[active=true]:text-indigo-700"
									>
										<Link href={item.href}>
											<item.icon />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				{/* Footer content yang akan hilang saat collapsed */}
				<div className="p-2 text-xs text-zinc-400 text-center opacity-100 group-data-[collapsible=icon]:opacity-0 transition-opacity">
					© 2025 KampusEvent
				</div>
			</SidebarFooter>

			{/* Rail memungkinkan user click/drag border untuk resize/collapse sidebar */}
			<SidebarRail />
		</Sidebar>
	);
}
