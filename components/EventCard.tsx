import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Event } from "@/types";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function EventCard({ event }: { event: Event }) {
	const eventDate = new Date(event.date).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	return (
		<Link href={`/events/${event.id}`} className="block group h-full">
			<Card className="pt-0 h-full gap-0 overflow-hidden border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200 hover:-translate-y-1">
				<CardHeader className="p-0">
					<AspectRatio ratio={16 / 9}>
						{event.imageUrl ? (
							<Image
								src={event.imageUrl}
								alt={event.title}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-400">
								<span className="text-sm font-medium">No Image</span>
							</div>
						)}
					</AspectRatio>
				</CardHeader>

				<CardContent className="px-4 py-2 flex flex-col gap-2">
					<h3 className="font-bold text-lg text-zinc-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
						{event.title}
					</h3>

					<div className="flex items-center gap-2 text-sm text-zinc-500">
						<MapPin size={14} className="shrink-0 text-indigo-500" />
						<span className="line-clamp-1">{event.location}</span>
					</div>
				</CardContent>

				<CardFooter className="px-4 py-2 flex justify-between items-center">
					{event.category ? (
						<Badge
							variant="secondary"
							className="font-medium bg-zinc-100 text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600"
						>
							{event.category.name}
						</Badge>
					) : (
						<div />
					)}

					<div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
						<Calendar size={12} />
						<span>{eventDate}</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}
