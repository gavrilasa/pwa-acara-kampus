import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, ArrowRight } from "lucide-react";
import { getBaseUrl } from "@/lib/utils";
import { Category, Event } from "@/types";
import { Badge } from "@/components/ui/badge"; // Assuming you have this from shadcn
import { Button } from "@/components/ui/button"; // Assuming you have this from shadcn

// Interface for API response combining Category + Events
interface CategoryWithEvents extends Category {
	events: Event[];
}

async function getCategoryDetail(id: string) {
	try {
		const res = await fetch(`${getBaseUrl()}/api/categories/${id}`, {
			cache: "no-store",
		});
		if (!res.ok) return null;
		return res.json() as Promise<CategoryWithEvents>;
	} catch (error) {
		console.error("Error fetching category detail:", error);
		return null;
	}
}

export default async function CategoryDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await getCategoryDetail(id);

	if (!data) return notFound();

	return (
		<div className="min-h-screen bg-zinc-50 pb-24">
			{/* Sticky Header */}
			<div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur-md transition-all">
				<div className="container mx-auto flex items-center gap-4">
					<Link
						href="/categories"
						className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
					>
						<ArrowLeft size={20} />
					</Link>
					<div>
						<h1 className="text-lg font-bold text-zinc-900 md:text-xl">
							{data.name}
						</h1>
						<p className="text-xs text-zinc-500 md:text-sm">
							{data.events.length} event{data.events.length !== 1 ? "s" : ""}{" "}
							available
						</p>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8 md:px-6 lg:py-12">
				{data.events.length > 0 ? (
					<div className="grid gap-6 md:gap-8 lg:grid-cols-1">
						{data.events.map((event) => {
							const eventDate = new Date(event.date).toLocaleDateString(
								"id-ID",
								{
									day: "numeric",
									month: "long",
									year: "numeric",
								}
							);

							return (
								<div
									key={event.id}
									className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md md:flex-row md:items-stretch"
								>
									{/* Image Section */}
									<div className="relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-100 md:w-1/3 lg:w-1/4">
										{event.imageUrl ? (
											<Image
												src={event.imageUrl}
												alt={event.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-zinc-400">
												No Image
											</div>
										)}
										{/* Mobile-only Category Badge */}
										<div className="absolute left-3 top-3 md:hidden">
											<Badge
												variant="secondary"
												className="bg-white/90 backdrop-blur-sm"
											>
												{data.name}
											</Badge>
										</div>
									</div>

									{/* Content Section */}
									<div className="flex flex-1 flex-col justify-between p-5 md:p-6 lg:p-8">
										<div className="space-y-3">
											<div className="hidden items-center justify-between md:flex">
												<Badge
													variant="outline"
													className="border-zinc-200 text-zinc-500"
												>
													{data.name}
												</Badge>
												<span className="text-xs font-medium text-zinc-400">
													{eventDate}
												</span>
											</div>

											<Link href={`/events/${event.id}`} className="block">
												<h3 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-indigo-600 md:text-2xl">
													{event.title}
												</h3>
											</Link>

											<p className="line-clamp-2 text-sm text-zinc-500 md:text-base">
												{event.description}
											</p>

											{/* Metadata Grid */}
											<div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
												<div className="flex items-center gap-2">
													<Calendar size={16} className="text-indigo-500" />
													<span className="md:hidden">{eventDate}</span>
													<span className="hidden md:inline">
														{new Date(event.date).toLocaleTimeString("id-ID", {
															hour: "2-digit",
															minute: "2-digit",
														})}{" "}
														WIB
													</span>
												</div>
												<div className="flex items-center gap-2">
													<MapPin size={16} className="text-emerald-500" />
													<span className="line-clamp-1">{event.location}</span>
												</div>
											</div>
										</div>

										{/* Action Area */}
										<div className="mt-6 flex items-center pt-4 md:mt-0 md:pt-0 md:justify-end">
											<Button
												asChild
												variant="ghost"
												className="group/btn gap-2 pl-0 hover:bg-transparent hover:text-indigo-600 md:pl-4"
											>
												<Link href={`/events/${event.id}`}>
													Lihat Detail
													<ArrowRight
														size={16}
														className="transition-transform group-hover/btn:translate-x-1"
													/>
												</Link>
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-center">
						<div className="mb-4 rounded-full bg-zinc-50 p-4">
							<Calendar size={40} className="text-zinc-300" />
						</div>
						<h3 className="text-lg font-medium text-zinc-900">
							Belum ada acara
						</h3>
						<p className="mt-2 max-w-sm text-sm text-zinc-500">
							Kategori{" "}
							<span className="font-semibold text-zinc-700">{data.name}</span>{" "}
							belum memiliki acara yang terdaftar saat ini.
						</p>
						<Button asChild variant="outline" className="mt-6">
							<Link href="/categories">Lihat Kategori Lain</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
