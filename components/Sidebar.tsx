"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, Info, Command } from "lucide-react";
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
		<Sidebar collapsible="icon" className="hidden md:flex border-r-zinc-200">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
									<Command className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold text-zinc-900">
										Acara Kampus
									</span>
									<span className="text-zinc-500 text-xs">
										Universitas Diponegoro
									</span>
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
										tooltip={item.label}
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
				<div className="p-2 text-xs text-zinc-400 text-center opacity-100 group-data-[collapsible=icon]:opacity-0 transition-opacity">
					© 2025 AcaraKampusPWA
				</div>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
