import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import EventFeed from "@/components/EventFeed";
import { Event } from "@/types";
import { Prisma } from "@prisma/client";
import { Marquee } from "@/components/ui/marquee";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

// Revalidate data setiap 60 detik (ISR)
export const revalidate = 60;

type EventWithCategory = Prisma.EventGetPayload<{
	include: { category: true };
}>;

const serializeEvent = (event: EventWithCategory): Event => {
	const { date, ...rest } = event;
	return {
		...rest,
		date: date.toISOString(),
	};
};

async function getFeaturedEvents() {
	const rawEvents = await prisma.event.findMany({
		where: { isFeatured: true },
		include: { category: true },
		orderBy: { date: "asc" },
		take: 5,
	});
	return rawEvents.map(serializeEvent);
}

async function getInitialEvents() {
	const rawEvents = await prisma.event.findMany({
		include: { category: true },
		orderBy: { date: "asc" },
		take: 10,
	});
	return rawEvents.map(serializeEvent);
}

export default async function Home() {
	const [featuredEvents, initialEvents] = await Promise.all([
		getFeaturedEvents(),
		getInitialEvents(),
	]);

	return (
		<div className="min-h-screen bg-zinc-50 pb-24 md:pb-10">
			<header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-xl supports-backdrop-filter:bg-white/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-2">
						<div className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg">
							<SidebarTrigger />
						</div>
						<div className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white p-2">
							<Sparkles className="size-5" />
						</div>
					</div>

					<div className="flex flex-1 items-center justify-center px-4 md:px-8 lg:px-12">
						<div className="relative w-full max-w-md transition-all duration-300 focus-within:max-w-lg">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
							<Input
								type="search"
								placeholder="Cari seminar, lomba, atau workshop..."
								className="w-full rounded-full border-zinc-200 bg-zinc-100 pl-10 placeholder:text-zinc-400 focus-visible:ring-indigo-500 focus-visible:bg-white transition-all shadow-sm"
							/>
						</div>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 md:px-6">
				{featuredEvents.length > 0 && (
					<section className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="px-4 md:px-8 mb-4">
							<h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
								Highlight{" "}
								<span className="text-blue-500 text-xs px-2 py-0.5 bg-blue-50 rounded-full">
									Top Picks
								</span>
							</h2>
						</div>

						<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
							<Marquee pauseOnHover className="[--duration:40s] py-2">
								{featuredEvents.map((event) => (
									<Link
										key={event.id}
										href={`/events/${event.id}`}
										// Menambahkan mx-3 untuk memberikan jarak antar kartu di dalam Marquee
										className="mx-3 block w-72 md:w-96 h-44 md:h-56 relative rounded-2xl overflow-hidden bg-gray-200 shadow-md hover:shadow-xl transition-all group"
									>
										{event.imageUrl ? (
											<Image
												src={event.imageUrl}
												alt={event.title}
												fill
												className="object-cover brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
											/>
										) : (
											<div className="w-full h-full bg-linear-to-br from-blue-400 to-indigo-600" />
										)}
										<div className="absolute bottom-0 left-0 p-5 text-white w-full bg-linear-to-t from-black/80 via-black/40 to-transparent">
											<span className="text-[10px] uppercase tracking-wider font-bold bg-blue-600 px-2 py-1 rounded mb-2 inline-block shadow-sm">
												Featured
											</span>
											<h3 className="font-bold truncate text-lg leading-tight text-shadow-sm">
												{event.title}
											</h3>
										</div>
									</Link>
								))}
							</Marquee>

							<div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-gray-50 to-transparent z-10"></div>
							<div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-gray-50 to-transparent z-10"></div>
						</div>
					</section>
				)}

				<section className="mt-10">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-2xl font-bold tracking-tight text-zinc-900">
							Terbaru
						</h2>
					</div>

					{initialEvents.length > 0 ? (
						<div className="min-h-[50vh]">
							<EventFeed initialEvents={initialEvents} />
						</div>
					) : (
						<div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-zinc-500">
							<p>Belum ada event tersedia.</p>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
