"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, Info } from "lucide-react";

export default function BottomNav() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/categories", label: "Kategori", icon: Grid },
		{ href: "/favorites", label: "Favorit", icon: Heart },
		{ href: "/about", label: "About", icon: Info },
	];

	return (
		// ADDED: md:hidden (Hides on desktop)
		<nav className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 pb-safe">
			<div className="flex justify-around items-center h-16">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
								isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-400"
							}`}
						>
							<item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
							<span className="text-xs font-medium">{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
