"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types";

interface EventFeedProps {
	initialEvents: Event[];
}

export default function EventFeed({ initialEvents }: EventFeedProps) {
	const [events, setEvents] = useState<Event[]>(initialEvents);
	const [page, setPage] = useState(2);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (initialEvents.length < 10) {
			setHasMore(false);
		}
	}, [initialEvents]);

	useEffect(() => {
		// [FIX]: Simpan ref.current ke variabel lokal agar aman saat cleanup
		const sentinelEl = sentinelRef.current;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !isLoading) {
					loadMoreEvents();
				}
			},
			{
				root: null,
				rootMargin: "100px",
				threshold: 0.1,
			}
		);

		if (sentinelEl) {
			observer.observe(sentinelEl);
		}

		return () => {
			// Gunakan variabel lokal 'sentinelEl', bukan 'sentinelRef.current'
			if (sentinelEl) {
				observer.unobserve(sentinelEl);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasMore, isLoading, page]); // 'loadMoreEvents' stabil karena ada di scope komponen

	const loadMoreEvents = async () => {
		setIsLoading(true);
		try {
			const res = await fetch(`/api/events?page=${page}&limit=10`);
			if (!res.ok) throw new Error("Gagal mengambil data");

			const newEvents: Event[] = await res.json();

			if (newEvents.length === 0) {
				setHasMore(false);
			} else {
				setEvents((prev) => [...prev, ...newEvents]);
				setPage((prev) => prev + 1);

				if (newEvents.length < 10) {
					setHasMore(false);
				}
			}
		} catch (error) {
			console.error("Infinite Scroll Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{events.map((event) => (
					<EventCard key={`${event.id}-${page}`} event={event} />
				))}
			</div>

			<div ref={sentinelRef} className="flex justify-center py-8 w-full">
				{isLoading && (
					<div className="flex items-center gap-2 text-blue-600 animate-pulse">
						<Loader2 size={24} className="animate-spin" />
						<span className="text-sm font-medium">Memuat acara lainnya...</span>
					</div>
				)}

				{!hasMore && events.length > 0 && (
					<p className="text-gray-400 text-sm italic">
						Semua acara telah ditampilkan.
					</p>
				)}
			</div>
		</div>
	);
}
