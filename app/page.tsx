import Link from "next/link";
import Image from "next/image";
import { Search, Bell } from "lucide-react";
import prisma from "@/lib/prisma";
import EventFeed from "@/components/EventFeed";
import { Event } from "@/types";
import { Prisma } from "@prisma/client"; // [1] Import namespace Prisma

// Revalidate data setiap 60 detik (ISR)
export const revalidate = 60;

// [2] Definisikan tipe spesifik dari hasil query Prisma
// Ini memberi tahu TS bahwa objek ini memiliki field 'category' di dalamnya
type EventWithCategory = Prisma.EventGetPayload<{
	include: { category: true };
}>;

// [3] Gunakan tipe tersebut di helper function, menggantikan 'any'
const serializeEvent = (event: EventWithCategory): Event => {
	// Kita destructure untuk membuang properti yang tidak perlu/konflik (seperti date asli yang bertipe Date)
	const { date, ...rest } = event;

	return {
		...rest,
		date: date.toISOString(), // Konversi Date -> String
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
		<div className="pb-24 md:pb-10 bg-gray-50">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center transition-all">
				<div>
					<h1 className="text-xl md:text-2xl font-bold text-blue-600 tracking-tight">
						KampusEvent
					</h1>
					<p className="text-xs md:text-sm text-gray-500 font-medium">
						Temukan kegiatan serumu
					</p>
				</div>
				<div className="flex gap-3">
					<button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors active:scale-95">
						<Search size={20} />
					</button>
					<button className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors active:scale-95">
						<Bell size={20} />
					</button>
				</div>
			</header>

			{/* Featured Slider */}
			{featuredEvents.length > 0 && (
				<section className="mt-6 px-4 md:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
						Highlight{" "}
						<span className="text-blue-500 text-xs px-2 py-0.5 bg-blue-50 rounded-full">
							Top Picks
						</span>
					</h2>
					<div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
						{featuredEvents.map((event) => (
							<Link
								key={event.id}
								href={`/events/${event.id}`}
								className="snap-center shrink-0 w-72 md:w-96 h-44 md:h-56 relative rounded-2xl overflow-hidden bg-gray-200 shadow-md hover:shadow-xl transition-all group"
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
					</div>
				</section>
			)}

			{/* List Semua Event (Client Component dengan Infinite Scroll) */}
			<section className="px-4 md:px-8 mt-8">
				<h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
					Terbaru
				</h2>

				{initialEvents.length > 0 ? (
					<EventFeed initialEvents={initialEvents} />
				) : (
					<div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
						<p>Belum ada event tersedia.</p>
					</div>
				)}
			</section>
		</div>
	);
}
