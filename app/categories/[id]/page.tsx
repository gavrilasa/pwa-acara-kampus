import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EventCard from "@/components/EventCard";
import { getBaseUrl } from "@/lib/utils";
import { Category, Event } from "@/types";

// Interface untuk respons API yang menggabungkan Kategori + Events
interface CategoryWithEvents extends Category {
	events: Event[];
}

async function getCategoryDetail(id: string) {
	const res = await fetch(`${getBaseUrl()}/api/categories/${id}`, {
		cache: "no-store",
	});
	if (!res.ok) return null;
	return res.json() as Promise<CategoryWithEvents>;
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
		<div className="pb-24 min-h-screen bg-gray-50">
			{/* Header Sticky */}
			<div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
				<Link href="/categories" className="p-2 hover:bg-gray-100 rounded-full">
					<ArrowLeft size={20} className="text-gray-700" />
				</Link>
				<h1 className="text-lg font-bold text-gray-800">{data.name}</h1>
			</div>

			<div className="p-4 space-y-4">
				{data.events.length > 0 ? (
					data.events.map((event) => <EventCard key={event.id} event={event} />)
				) : (
					<div className="text-center py-20 text-gray-500">
						<p>Belum ada acara di kategori ini.</p>
					</div>
				)}
			</div>
		</div>
	);
}
