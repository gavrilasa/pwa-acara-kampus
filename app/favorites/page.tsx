"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartOff, RefreshCw } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Event, FavoriteSnapshot } from "@/types";

export default function FavoritesPage() {
	const [favorites, setFavorites] = useState<FavoriteSnapshot[]>([]);
	const [isMounted, setIsMounted] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		const loadLocalFavorites = () => {
			try {
				const stored = localStorage.getItem("favorites");
				if (stored) {
					const parsed: FavoriteSnapshot[] = JSON.parse(stored);
					setFavorites(parsed);
					return parsed;
				}
			} catch (e) {
				console.error("Cache Error:", e);
			}
			return [];
		};

		const localData = loadLocalFavorites();

		if (localData.length > 0 && navigator.onLine) {
			const revalidateData = async () => {
				try {
					setIsSyncing(true);
					const ids = localData.map((f) => f.id).join(",");

					const res = await fetch(`/api/events?ids=${ids}`);

					if (res.ok) {
						const serverData: Event[] = await res.json();

						setFavorites(serverData as unknown as FavoriteSnapshot[]);

						const freshSnapshots: FavoriteSnapshot[] = serverData.map(
							(evt) => ({
								id: evt.id,
								title: evt.title,
								date: evt.date,
								location: evt.location,
								imageUrl: evt.imageUrl,
								category: evt.category
									? { name: evt.category.name, icon: evt.category.icon }
									: undefined,
							})
						);
						localStorage.setItem("favorites", JSON.stringify(freshSnapshots));
					}
				} catch (error) {
					console.warn("Sync gagal, tetap menggunakan data offline." + error);
				} finally {
					setIsSyncing(false);
				}
			};

			revalidateData();
		}
	}, []);

	if (!isMounted) {
		return <div className="min-h-screen bg-gray-50" />;
	}

	return (
		<div className="pb-24 min-h-screen bg-gray-50">
			<div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center transition-all">
				<h1 className="text-xl font-bold text-gray-900 tracking-tight">
					Favorit Saya
				</h1>

				<div
					className={`flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full transition-opacity duration-500 ${
						isSyncing ? "opacity-100" : "opacity-0"
					}`}
				>
					<RefreshCw size={12} className="animate-spin" />
					<span>Memperbarui...</span>
				</div>
			</div>

			<div className="p-4 md:p-6 max-w-7xl mx-auto">
				{favorites.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{favorites.map((fav) => (
							<EventCard key={fav.id} event={fav as unknown as Event} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
						<div className="bg-white p-6 rounded-full shadow-sm mb-6 ring-1 ring-gray-100">
							<HeartOff size={48} className="text-gray-300" />
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Belum ada favorit
						</h3>
						<p className="text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed text-sm">
							Simpan event yang kamu minati agar bisa diakses kapan saja, bahkan
							tanpa internet.
						</p>
						<Link
							href="/"
							className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
						>
							Jelajahi Event
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
