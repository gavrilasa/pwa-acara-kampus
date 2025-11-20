"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { FavoriteSnapshot } from "@/types";

// [REF] Props diubah menerima objek, bukan cuma ID string
interface FavoriteButtonProps {
	event: FavoriteSnapshot;
}

export default function FavoriteButton({ event }: FavoriteButtonProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		// Cek status awal saat komponen mount
		const checkFavorite = () => {
			try {
				const storedFavorites = localStorage.getItem("favorites");
				const favorites: FavoriteSnapshot[] = storedFavorites
					? JSON.parse(storedFavorites)
					: [];

				// [LOGIKA BARU] Cek keberadaan ID dalam array objek
				const exists = favorites.some((fav) => fav.id === event.id);
				setIsFavorite(exists);
			} catch (e) {
				console.error("Gagal membaca status favorit:", e);
			}
		};
		checkFavorite();
	}, [event.id]);

	const toggleFavorite = (e: React.MouseEvent) => {
		// Mencegah navigasi jika tombol berada di dalam Link (misal di Card)
		e.preventDefault();
		e.stopPropagation();

		try {
			const storedFavorites = localStorage.getItem("favorites");
			let favorites: FavoriteSnapshot[] = storedFavorites
				? JSON.parse(storedFavorites)
				: [];

			if (isFavorite) {
				// [LOGIKA BARU] Hapus: Filter array untuk membuang objek dengan ID yang sama
				favorites = favorites.filter((fav) => fav.id !== event.id);
			} else {
				// [LOGIKA BARU] Tambah: Buat snapshot data minimal untuk disimpan
				// Kita buat objek baru eksplisit agar tidak menyimpan properti berlebih (seperti description panjang)
				const snapshot: FavoriteSnapshot = {
					id: event.id,
					title: event.title,
					date: event.date,
					location: event.location,
					imageUrl: event.imageUrl,
					category: event.category
						? {
								name: event.category.name,
								icon: event.category.icon,
						  }
						: undefined,
				};
				favorites.push(snapshot);
			}

			// Simpan kembali ke LocalStorage
			localStorage.setItem("favorites", JSON.stringify(favorites));
			setIsFavorite(!isFavorite);
		} catch (e) {
			console.error("Gagal mengubah status favorit:", e);
			// Optional: Tambahkan toast notification di sini jika ada
		}
	};

	return (
		<button
			onClick={toggleFavorite}
			className="group bg-white/70 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white transition-all active:scale-90 cursor-pointer"
			aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
			title={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
		>
			<Heart
				size={24}
				className={`transition-colors duration-300 ${
					isFavorite
						? "fill-red-500 text-red-500"
						: "text-gray-700 group-hover:text-red-500"
				}`}
			/>
		</button>
	);
}
