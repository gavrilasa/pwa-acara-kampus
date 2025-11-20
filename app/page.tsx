import Link from "next/link";
import Image from "next/image";
import { Search, Bell } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types";
import { getBaseUrl } from "@/lib/utils";

async function getEvents() {
	const res = await fetch(`${getBaseUrl()}/api/events`, {
		cache: "no-store",
	});
	if (!res.ok) return [];
	return res.json() as Promise<Event[]>;
}

export default async function Home() {
	const events = await getEvents();
	const featuredEvents = events.filter((e) => e.isFeatured);
	const regularEvents = events;

	return (
		<div className="pb-24 md:pb-10 bg-gray-50">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center">
				<div>
					<h1 className="text-xl md:text-2xl font-bold text-blue-600">
						KampusEvent
					</h1>
					<p className="text-xs md:text-sm text-gray-500">
						Temukan kegiatan serumu
					</p>
				</div>
				<div className="flex gap-3">
					<button className="p-2 bg-gray-100 hover:bg-gray-200 transition rounded-full text-gray-600">
						<Search size={20} />
					</button>
					<button className="p-2 bg-gray-100 hover:bg-gray-200 transition rounded-full text-gray-600">
						<Bell size={20} />
					</button>
				</div>
			</header>

			{/* Featured Slider */}
			{featuredEvents.length > 0 && (
				<section className="mt-6 px-4 md:px-8">
					<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
						Highlight
					</h2>
					<div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
						{featuredEvents.map((event) => (
							<Link
								key={event.id}
								href={`/events/${event.id}`}
								className="snap-center shrink-0 w-72 md:w-96 h-44 md:h-56 relative rounded-xl overflow-hidden bg-gray-200 shadow-md hover:shadow-lg transition-shadow group"
							>
								{event.imageUrl && (
									<Image
										src={event.imageUrl}
										alt={event.title}
										fill
										className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
									/>
								)}
								<div className="absolute bottom-0 left-0 p-4 text-white w-full bg-gradient-to-t from-black/60 to-transparent">
									<span className="text-xs font-bold bg-blue-600 px-2 py-1 rounded-md mb-2 inline-block">
										Featured
									</span>
									<h3 className="font-bold truncate text-lg">{event.title}</h3>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* List Semua Event - RESPONSIVE GRID */}
			<section className="px-4 md:px-8 mt-8">
				<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
					Terbaru
				</h2>

				{/* Grid: 1 col mobile, 2 col tablet, 3 col desktop, 4 col large */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{regularEvents.length > 0 ? (
						regularEvents.map((event) => (
							<EventCard key={event.id} event={event} />
						))
					) : (
						<p className="col-span-full text-center text-gray-500 py-10">
							Belum ada event tersedia.
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
