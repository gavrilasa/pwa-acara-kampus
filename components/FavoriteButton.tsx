"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function FavoriteButton({ eventId }: { eventId: string }) {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const checkFavorite = () => {
			try {
				const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
				// eslint-disable-next-line react-hooks/set-state-in-effect
				if (favorites.includes(eventId)) {
					setIsFavorite(true);
				}
			} catch (e) {
				console.error(e);
			}
		};
		checkFavorite();
	}, [eventId]);

	const toggleFavorite = () => {
		try {
			const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
			let newFavorites;

			if (isFavorite) {
				newFavorites = favorites.filter((id: string) => id !== eventId);
			} else {
				newFavorites = [...favorites, eventId];
			}

			localStorage.setItem("favorites", JSON.stringify(newFavorites));
			setIsFavorite(!isFavorite);
		} catch (e) {
			console.error("Gagal menyimpan favorit", e);
		}
	};

	return (
		<button
			onClick={toggleFavorite}
			className="group bg-white/70 backdrop-blur-md p-3 rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
			aria-label={isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"}
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
