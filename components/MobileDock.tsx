"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";

export default function MobileDock() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Home", icon: Home },
		{ href: "/categories", label: "Kategori", icon: Grid },
		{ href: "/favorites", label: "Favorit", icon: Heart },
		{ href: "/about", label: "About", icon: Info },
	];

	return (
		<div className="md:hidden pointer-events-none fixed inset-x-0 bottom-6 mb-4 z-50 mx-auto flex justify-center h-16">
			<TooltipProvider>
				<Dock className="pointer-events-auto z-50 bg-white/80 backdrop-blur-md border border-zinc-200 shadow-lg shadow-zinc-200/50 rounded-full px-3">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;

						return (
							<DockIcon key={item.label} magnification={60} distance={100}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href={item.href}
											prefetch={true}
											className={cn(
												buttonVariants({ variant: "ghost", size: "icon" }),
												"size-12 rounded-full transition-colors",
												isActive
													? "bg-indigo-50 text-indigo-600"
													: "text-zinc-500 hover:text-zinc-900"
											)}
										>
											<Icon
												className={cn("size-6", isActive && "fill-current")}
											/>
										</Link>
									</TooltipTrigger>
									<TooltipContent side="top">
										<p>{item.label}</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>
						);
					})}
				</Dock>
			</TooltipProvider>
		</div>
	);
}
