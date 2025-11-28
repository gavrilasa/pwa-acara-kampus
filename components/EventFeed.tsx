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
	const [isMounted, setIsMounted] = useState(false);

	const sentinelRef = useRef<HTMLDivElement>(null);
	const CACHE_KEY = "event-feed-cache";

	useEffect(() => {
		setIsMounted(true);

		try {
			const cached = localStorage.getItem(CACHE_KEY);
			if (cached) {
				const parsedCache = JSON.parse(cached);
				if (initialEvents.length === 0 && parsedCache.length > 0) {
					setEvents(parsedCache);
				}
			}

			if (initialEvents.length > 0) {
				localStorage.setItem(CACHE_KEY, JSON.stringify(initialEvents));
			}
		} catch (error) {
			console.error("Cache initialization error:", error);
		}
	}, [initialEvents]);

	useEffect(() => {
		if (events.length > 0 && isMounted) {
			localStorage.setItem(CACHE_KEY, JSON.stringify(events));
		}
	}, [events, isMounted]);

	useEffect(() => {
		if (initialEvents.length < 10) {
			setHasMore(false);
		}
	}, [initialEvents]);

	useEffect(() => {
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
			if (sentinelEl) {
				observer.unobserve(sentinelEl);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasMore, isLoading, page]);

	const loadMoreEvents = async () => {
		setIsLoading(true);
		try {
			const res = await fetch(`/api/events?page=${page}&limit=10`);
			if (!res.ok) throw new Error("Gagal mengambil data");

			const newEvents: Event[] = await res.json();

			if (newEvents.length === 0) {
				setHasMore(false);
			} else {
				setEvents((prev) => {
					const updatedEvents = [...prev, ...newEvents];
					return updatedEvents;
				});
				setPage((prev) => prev + 1);

				if (newEvents.length < 10) {
					setHasMore(false);
				}
			}
		} catch (error) {
			console.error("Infinite Scroll Error:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isMounted) {
		return <div className="space-y-6 opacity-0">Loading...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{events.map((event, index) => (
					<EventCard key={`${event.id}-${index}`} event={event} />
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
