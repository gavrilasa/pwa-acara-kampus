"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { FavoriteSnapshot } from "@/types";

interface FavoriteButtonProps {
	event: FavoriteSnapshot;
}

export default function FavoriteButton({ event }: FavoriteButtonProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const checkFavorite = () => {
			try {
				const storedFavorites = localStorage.getItem("favorites");
				const favorites: FavoriteSnapshot[] = storedFavorites
					? JSON.parse(storedFavorites)
					: [];

				const exists = favorites.some((fav) => fav.id === event.id);
				setIsFavorite(exists);
			} catch (e) {
				console.error("Gagal membaca status favorit:", e);
			}
		};
		checkFavorite();
	}, [event.id]);

	const toggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			const storedFavorites = localStorage.getItem("favorites");
			let favorites: FavoriteSnapshot[] = storedFavorites
				? JSON.parse(storedFavorites)
				: [];

			if (isFavorite) {
				favorites = favorites.filter((fav) => fav.id !== event.id);
			} else {
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

			localStorage.setItem("favorites", JSON.stringify(favorites));
			setIsFavorite(!isFavorite);
		} catch (e) {
			console.error("Gagal mengubah status favorit:", e);
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
