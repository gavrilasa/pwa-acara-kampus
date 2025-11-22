"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event } from "@/types";
import EventDetailClient from "@/components/EventDetailClient";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventDetailPage() {
	// Ambil ID dari URL (Client Side)
	const params = useParams();
	const id = params.id as string;

	const [event, setEvent] = useState<Event | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (!id) return;

		const CACHE_KEY = `event_detail_${id}`;

		// 1. Load Cache Lokal
		try {
			const cachedData = localStorage.getItem(CACHE_KEY);
			if (cachedData) {
				setEvent(JSON.parse(cachedData));
				setIsLoading(false); // Tampilkan konten cache segera
			}
		} catch (e) {
			console.error("Cache read error", e);
		}

		// 2. Fetch Data Network (Background Update)
		const fetchEvent = async () => {
			try {
				const res = await fetch(`/api/events/${id}`);
				if (!res.ok) {
					// Jika 404 dan tidak ada cache, maka error
					if (!localStorage.getItem(CACHE_KEY)) setIsError(true);
					return;
				}

				const data: Event = await res.json();
				setEvent(data);

				// 3. Simpan ke Cache
				localStorage.setItem(CACHE_KEY, JSON.stringify(data));
				setIsError(false);
			} catch (error) {
				console.log("Offline: Menampilkan data event dari cache jika ada.");
				// Jika fetch gagal dan tidak ada cache sama sekali, set error
				if (!localStorage.getItem(CACHE_KEY)) setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvent();
	}, [id]);

	if (isLoading && !event) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<Loader2 className="size-8 animate-spin text-indigo-600" />
			</div>
		);
	}

	if (isError || !event) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 text-center">
				<div className="bg-red-50 p-4 rounded-full mb-4">
					<AlertCircle className="size-8 text-red-500" />
				</div>
				<h2 className="text-xl font-bold text-zinc-900">Gagal Memuat Acara</h2>
				<p className="text-zinc-500 mt-2 mb-6 max-w-xs">
					Acara tidak ditemukan atau Anda sedang offline dan belum pernah
					membuka acara ini sebelumnya.
				</p>
				<Button asChild>
					<Link href="/">Kembali ke Beranda</Link>
				</Button>
			</div>
		);
	}

	// Render komponen presentasi yang sudah ada
	return <EventDetailClient event={event} />;
}
