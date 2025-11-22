import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { Event } from "@/types";
import EventDetailClient from "@/components/EventDetailClient";

// Server Component: Handle Data Fetching
// Tidak menggunakan "use client" agar tetap bisa async dan SEO friendly

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

	// Render Client Component untuk interaksi dan animasi
	return <EventDetailClient event={event} />;
}
