"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";
import { getIconComponent } from "@/lib/icons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const CACHE_KEY = "categories-cache";

		try {
			const cachedData = localStorage.getItem(CACHE_KEY);
			if (cachedData) {
				setCategories(JSON.parse(cachedData));
				setIsLoading(false);
			}
		} catch (e) {
			console.error("Gagal membaca cache kategori", e);
		}

		const fetchData = async () => {
			try {
				const res = await fetch("/api/categories");
				if (res.ok) {
					const data: Category[] = await res.json();

					setCategories(data);
					localStorage.setItem(CACHE_KEY, JSON.stringify(data));
				}
			} catch (error) {
				console.log("Offline mode: Menggunakan data cache kategori." + error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="min-h-screen bg-zinc-50 pb-24">
			<div className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-30">
				<div className="container mx-auto px-4 py-4 md:px-6">
					<h1 className="text-xl font-bold text-zinc-900 tracking-tight">
						Kategori Acara
					</h1>
				</div>
			</div>

			<section className="py-6">
				<div className="container mx-auto px-4 md:px-6">
					{isLoading && categories.length === 0 ? (
						<div className="grid gap-6 lg:grid-cols-2">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-48 w-full rounded-2xl" />
							))}
						</div>
					) : categories.length === 0 ? (
						<div className="text-center py-20 text-zinc-500 bg-white rounded-2xl border border-dashed border-zinc-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
							<p>Tidak ada kategori ditemukan.</p>
							<p className="text-xs mt-2">
								Pastikan Anda terhubung ke internet untuk sinkronisasi pertama.
							</p>
						</div>
					) : (
						<div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
							{categories.map((cat, index) => {
								const IconComponent = getIconComponent(cat.icon);
								const placeholderImage = `https://images.unsplash.com/photo-${
									[
										"1519389950473-47ba0277781c",
										"1501504905252-473c47e087f8",
										"1523580494863-6f3031224c94",
										"1517245386807-bb43f82c33c4",
									][index % 4]
								}?q=80&w=400&auto=format&fit=crop`;

								return (
									<div
										key={cat.id}
										className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-indigo-200 group lg:min-h-88"
									>
										<div className="flex justify-between gap-6 border-b border-zinc-100 flex-1">
											<div className="flex flex-1 flex-col justify-between py-6 pb-2 pl-6 md:py-8 md:pl-8">
												<div className="space-y-4">
													<span className="text-xs font-mono font-medium uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
														KATEGORI {index + 1}
													</span>
													<Link href={`/categories/${cat.id}`}>
														<h3 className="mt-2 text-2xl font-medium text-zinc-900 transition-colors group-hover:text-indigo-600 sm:text-3xl">
															{cat.name}
														</h3>
													</Link>
												</div>
											</div>

											<div className="relative w-3/5 shrink-0 border-l border-zinc-100 bg-zinc-50">
												<Link
													href={`/categories/${cat.id}`}
													className="block h-full w-full"
												>
													<div className="relative h-full w-full grayscale transition-all duration-500 group-hover:grayscale-0">
														<Image
															src={placeholderImage}
															alt={cat.name}
															fill
															className="object-cover"
															sizes="(max-width: 768px) 40vw, 20vw"
														/>
														<div className="absolute inset-0 flex items-center justify-center bg-indigo-900/10 group-hover:bg-indigo-900/0 transition-colors">
															<div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
																<IconComponent
																	size={24}
																	className="text-indigo-600"
																/>
															</div>
														</div>
													</div>
												</Link>
											</div>
										</div>

										<div className="p-6 md:p-8 bg-zinc-50/50">
											<p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
												Temukan berbagai kegiatan seru seputar {cat.name} di
												kampus.
											</p>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
