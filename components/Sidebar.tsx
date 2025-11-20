"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, Info, CalendarDays } from "lucide-react";

export default function Sidebar() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/categories", label: "Kategori", icon: Grid },
		{ href: "/favorites", label: "Favorit", icon: Heart },
		{ href: "/about", label: "About", icon: Info },
	];

	return (
		<aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 border-r border-gray-200 bg-white z-50">
			{/* Logo Area */}
			<div className="p-6 flex items-center gap-3 border-b border-gray-100">
				<div className="bg-blue-600 p-2 rounded-lg text-white">
					<CalendarDays size={24} />
				</div>
				<span className="text-xl font-bold text-blue-900">KampusEvent</span>
			</div>

			{/* Navigation Links */}
			<nav className="flex-1 p-4 space-y-2">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
								isActive
									? "bg-blue-50 text-blue-600 font-semibold"
									: "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
							}`}
						>
							<item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Footer Area */}
			<div className="p-4 border-t border-gray-100 text-xs text-gray-400">
				© 2025 KampusEvent PWA
			</div>
		</aside>
	);
}
