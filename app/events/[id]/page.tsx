import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { getBaseUrl } from "@/lib/utils";
import { Event } from "@/types";
import FavoriteButton from "@/components/FavoriteButton";
import { notFound } from "next/navigation";

async function getEventDetail(id: string) {
	const res = await fetch(`${getBaseUrl()}/api/events/${id}`, {
		cache: "no-store",
	});
	if (!res.ok) return null;
	return res.json() as Promise<Event>;
}

export default async function EventDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const event = await getEventDetail(id);

	if (!event) return notFound();

	// Format tanggal untuk tampilan UI
	const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
	const eventTime = new Date(event.date).toLocaleTimeString("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="bg-white min-h-screen relative">
			{/* --- Mobile Nav (Hidden on Desktop) --- */}
			<div className="md:hidden absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-start pointer-events-none">
				<Link
					href="/"
					className="pointer-events-auto bg-white/70 backdrop-blur-md p-3 rounded-full shadow-sm text-gray-800 hover:bg-white"
				>
					<ArrowLeft size={24} />
				</Link>
				<div className="pointer-events-auto">
					{/* [FIX] Pass full event object instead of just ID */}
					<FavoriteButton event={event} />
				</div>
			</div>

			<div className="md:max-w-6xl md:mx-auto md:p-8 md:grid md:grid-cols-2 md:gap-12">
				{/* --- LEFT COLUMN (IMAGE) --- */}
				<div className="relative w-full h-80 md:h-[500px] md:rounded-3xl md:overflow-hidden md:shadow-xl">
					{event.imageUrl ? (
						<Image
							src={event.imageUrl}
							alt={event.title}
							fill
							className="object-cover"
							priority
						/>
					) : (
						<div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">
							No Image
						</div>
					)}
					<div className="md:hidden absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
				</div>

				{/* --- RIGHT COLUMN (CONTENT) --- */}
				<div className="px-5 py-8 -mt-8 md:mt-0 bg-white rounded-t-3xl md:rounded-none relative z-10 md:flex md:flex-col md:justify-center">
					{/* Desktop Header (Back & Favorite) */}
					<div className="hidden md:flex justify-between items-center mb-6">
						<Link
							href="/"
							className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition"
						>
							<ArrowLeft size={20} /> Kembali
						</Link>
						{/* [FIX] Pass full event object here too */}
						<FavoriteButton event={event} />
					</div>

					{/* Badge */}
					{event.category && (
						<span className="self-start inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full mb-4 border border-blue-100">
							{event.category.name}
						</span>
					)}

					<h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-snug">
						{event.title}
					</h1>

					{/* Info Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
						<div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
							<div className="text-blue-600">
								<Calendar size={24} />
							</div>
							<div>
								<p className="text-sm font-bold text-gray-900">{eventDate}</p>
								<p className="text-sm text-gray-500">{eventTime} WIB</p>
							</div>
						</div>

						<div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
							<div className="text-blue-600">
								<MapPin size={24} />
							</div>
							<div>
								<p className="text-sm font-bold text-gray-900">
									{event.location}
								</p>
								<p className="text-xs text-gray-500">Lokasi Kampus</p>
							</div>
						</div>

						{event.organizer && (
							<div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 md:col-span-2">
								<div className="text-blue-600">
									<User size={24} />
								</div>
								<div>
									<p className="text-sm font-bold text-gray-900">
										Penyelenggara
									</p>
									<p className="text-sm text-gray-500">
										{event.organizer.name}
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Deskripsi */}
					<div className="pt-6 border-t border-gray-100 mb-24 md:mb-0">
						<h3 className="text-lg font-bold text-gray-900 mb-3">
							Deskripsi Acara
						</h3>
						<p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
							{event.description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
