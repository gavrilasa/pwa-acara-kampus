import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/types";

export default function EventCard({ event }: { event: Event }) {
	const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return (
		<Link href={`/events/${event.id}`} className="block group">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
				{/* Image Placeholder / Actual Image */}
				<div className="relative h-40 w-full bg-gray-200">
					{event.imageUrl ? (
						<Image
							src={event.imageUrl}
							alt={event.title}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex items-center justify-center h-full text-gray-400">
							No Image
						</div>
					)}
				</div>

				<div className="p-4">
					{/* Kategori Badge */}
					{event.category && (
						<span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
							{event.category.name}
						</span>
					)}

					<h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600">
						{event.title}
					</h3>

					<div className="mt-3 space-y-1 text-sm text-gray-500">
						<div className="flex items-center gap-2">
							<Calendar size={16} />
							<span>{eventDate}</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin size={16} />
							<span className="line-clamp-1">{event.location}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
