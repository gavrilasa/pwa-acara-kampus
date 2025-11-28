"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, Clock, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Event } from "@/types";
import FavoriteButton from "@/components/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function EventDetailClient({ event }: { event: Event }) {
	const dateObj = new Date(event.date);
	const dateString = dateObj.toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
	const timeString = dateObj.toLocaleTimeString("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="min-h-screen bg-white pb-24">
			<div className="relative h-[40vh] min-h-[300px] w-full md:h-[50vh]">
				<div className="absolute left-0 top-0 z-20 flex w-full justify-between p-4 md:px-8 md:py-6">
					<Link href="/">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md text-zinc-800 hover:bg-white shadow-sm transition-all"
						>
							<ArrowLeft size={20} />
						</Button>
					</Link>

					<div className="flex gap-2">
						<Button
							variant="secondary"
							size="icon"
							className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md text-zinc-800 hover:bg-white shadow-sm transition-all"
						>
							<Share2 size={20} />
						</Button>
						<div className="pointer-events-auto">
							<FavoriteButton event={event} />
						</div>
					</div>
				</div>

				{event.imageUrl ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						className="relative h-full w-full"
					>
						<Image
							src={event.imageUrl}
							alt={event.title}
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white/10 to-transparent md:hidden" />
					</motion.div>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400">
						No Image Available
					</div>
				)}
			</div>

			<div className="container mx-auto px-4 md:px-6 lg:max-w-6xl">
				<div className="relative -mt-8 md:-mt-0 md:pt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="space-y-8"
					>
						<div className="rounded-2xl bg-white p-6 shadow-xl shadow-zinc-200/20 md:p-0 md:shadow-none">
							<div className="flex flex-wrap gap-2 mb-4">
								{event.category && (
									<Badge
										variant="secondary"
										className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 text-sm font-medium"
									>
										{event.category.name}
									</Badge>
								)}
								{event.isFeatured && (
									<Badge className="bg-amber-500 text-white hover:bg-amber-600 px-3 py-1 text-sm">
										Featured
									</Badge>
								)}
							</div>

							<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight mb-4">
								{event.title}
							</h1>

							{event.organizer && (
								<div className="flex items-center gap-3 pt-2">
									<div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
										<User size={20} className="text-zinc-400" />
									</div>
									<div className="flex flex-col">
										<span className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">
											Diselenggarakan oleh
										</span>
										<span className="text-sm font-bold text-zinc-900">
											{event.organizer.name}
										</span>
									</div>
								</div>
							)}
						</div>

						<Separator className="hidden md:block" />

						<div className="space-y-4">
							<h3 className="text-xl font-bold text-zinc-900">Tentang Acara</h3>
							<div className="prose prose-zinc prose-lg max-w-none text-zinc-600 leading-relaxed whitespace-pre-line">
								{event.description}
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="lg:block"
					>
						<div className="sticky top-24 space-y-6">
							<div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-200/30">
								<div className="space-y-6">
									<div className="flex gap-4 items-start">
										<div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 shrink-0">
											<Calendar size={22} />
										</div>
										<div>
											<h4 className="font-semibold text-zinc-900">
												Tanggal & Waktu
											</h4>
											<p className="text-sm text-zinc-600 mt-0.5">
												{dateString}
											</p>
											<p className="text-sm text-zinc-500 mt-0.5 flex items-center gap-1">
												<Clock size={14} /> {timeString} WIB
											</p>
										</div>
									</div>

									<div className="flex gap-4 items-start">
										<div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600 shrink-0">
											<MapPin size={22} />
										</div>
										<div>
											<h4 className="font-semibold text-zinc-900">Lokasi</h4>
											<p className="text-sm text-zinc-600 mt-0.5">
												{event.location}
											</p>
											<p className="text-xs text-zinc-400 mt-1">Kampus Utama</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
