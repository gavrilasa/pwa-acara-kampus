import Link from "next/link";
import { getBaseUrl } from "@/lib/utils";
import { Category } from "@/types";
import { getIconComponent } from "@/lib/icons";

export const dynamic = "force-dynamic";

async function getCategories() {
	try {
		const res = await fetch(`${getBaseUrl()}/api/categories`, {
			cache: "no-store",
		});
		if (!res.ok) return [];
		return res.json() as Promise<Category[]>;
	} catch {
		return [];
	}
}

export default async function CategoriesPage() {
	const categories = await getCategories();

	return (
		<div className="pb-24 min-h-screen bg-gray-50 p-4">
			<h1 className="text-2xl font-bold mb-6 text-gray-800 mt-4">
				Kategori Acara
			</h1>

			{categories.length === 0 ? (
				<div className="text-center py-10 text-gray-500">
					<p>Tidak ada kategori ditemukan.</p>
					<p className="text-xs mt-2">Coba jalankan seed database lagi.</p>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4">
					{categories.map((cat) => {
						const IconComponent = getIconComponent(cat.icon);

						return (
							<Link
								key={cat.id}
								href={`/categories/${cat.id}`}
								className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group"
							>
								<div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
									<IconComponent size={32} />
								</div>
								<span className="font-semibold text-gray-700 text-center group-hover:text-blue-700">
									{cat.name}
								</span>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
