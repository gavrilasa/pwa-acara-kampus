import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center animate-in fade-in zoom-in duration-500">
			<div className="relative">
				<div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-zinc-50">
					<FileQuestion className="h-10 w-10 text-zinc-400" />
				</div>
				<div className="absolute -bottom-2 -right-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600 ring-4 ring-white">
					404
				</div>
			</div>

			<div className="max-w-xs space-y-2">
				<h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
					Halaman Hilang?
				</h1>
				<p className="text-sm text-zinc-500 leading-relaxed">
					Maaf, halaman yang Anda cari sepertinya tidak ada atau telah
					dipindahkan ke alamat lain.
				</p>
			</div>

			<div className="flex gap-2">
				<Button
					asChild
					variant="default"
					className="gap-2 bg-indigo-600 hover:bg-indigo-700"
				>
					<Link href="/">
						<Home className="h-4 w-4" />
						Ke Beranda
					</Link>
				</Button>
			</div>
		</div>
	);
}
