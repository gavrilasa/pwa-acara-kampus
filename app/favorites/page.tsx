"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartOff } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types";

export default function FavoritesPage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchFavorites() {
			try {
				// 1. Ambil ID dari LocalStorage
				const storedIds = JSON.parse(localStorage.getItem("favorites") || "[]");

				if (storedIds.length === 0) {
					setLoading(false);
					return;
				}

				// 2. Fetch detail event dari API (Client-side Fetching)
				// Kita gunakan Promise.all untuk fetch paralel
				const promises = storedIds.map((id: string) =>
					fetch(`/api/events/${id}`).then((res) => {
						if (res.ok) return res.json();
						return null;
					})
				);

				const results = await Promise.all(promises);
				// Filter yang null (jika event sudah dihapus admin tapi masih ada di storage user)
				setEvents(results.filter((e) => e !== null));
			} catch (error) {
				console.error("Failed to load favorites", error);
			} finally {
				setLoading(false);
			}
		}

		fetchFavorites();
	}, []);

	return (
		<div className="pb-24 min-h-screen bg-gray-50">
			<div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-30">
				<h1 className="text-xl font-bold text-gray-800">Favorit Saya</h1>
			</div>

			<div className="p-4 space-y-4">
				{loading ? (
					// Skeleton Loading Sederhana
					[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-28 bg-gray-200 rounded-xl animate-pulse"
						/>
					))
				) : events.length > 0 ? (
					events.map((event) => <EventCard key={event.id} event={event} />)
				) : (
					<div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
						<HeartOff size={48} className="mb-4 opacity-50" />
						<p className="text-lg font-medium">Belum ada favorit</p>
						<p className="text-sm mb-6">Simpan event yang kamu suka di sini.</p>
						<Link
							href="/"
							className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold"
						>
							Cari Event
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
