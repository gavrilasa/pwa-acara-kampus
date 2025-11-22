import { Github, Instagram, Mail } from "lucide-react";

export default function AboutPage() {
	return (
		<div className="pb-24 min-h-screen bg-white w-full">
			<div className="bg-blue-600 h-48 w-full relative">
				<div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
					<div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 relative">
						<div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
							Foto
						</div>
					</div>
				</div>
			</div>

			<div className="mt-20 px-6 text-center max-w-prose mx-auto">
				<h1 className="text-2xl font-bold text-gray-900">
					Gavrila Samana Ahmad
				</h1>
				<p className="text-gray-500">NIM: 21120123130075</p>
				<span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
					Teknik Komputer
				</span>

				<div className="mt-8 text-left bg-gray-50 p-6 rounded-2xl">
					<h2 className="font-bold text-gray-900 mb-2">Tentang Aplikasi</h2>
					<p className="text-sm text-gray-600 leading-relaxed">
						Aplikasi ini dibuat sebagai Tugas Akhir Praktikum Pemrograman
						Perangkat Bergerak. Bertujuan untuk memudahkan mahasiswa mendapatkan
						informasi acara kampus terkini secara real-time dengan teknologi
						Progressive Web App (PWA).
					</p>
				</div>

				<div className="mt-8 flex justify-center gap-6">
					<a
						href="https://www.github.com/gavrilasa"
						target="_blank"
						className="text-gray-400 hover:text-gray-900"
					>
						<Github size={24} />
					</a>
					<a
						href="https://www.instagram.com/gavrila_sa"
						target="_blank"
						className="text-gray-400 hover:text-pink-600"
					>
						<Instagram size={24} />
					</a>
				</div>

				<footer className="mt-12 text-xs text-gray-400">
					&copy; 2025 AcaraKampus PWA. v1.0.0
				</footer>
			</div>
		</div>
	);
}
