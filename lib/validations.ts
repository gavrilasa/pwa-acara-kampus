import { z } from "zod";

/**
 * =========================================
 * PAGINATION & FILTER SCHEMA
 * =========================================
 * Digunakan untuk memvalidasi query parameters pada GET request.
 * Menggunakan z.coerce untuk mengubah string dari URL menjadi tipe data yang sesuai.
 */
export const PaginationSchema = z.object({
	// Mengubah string "1" menjadi number 1. Default ke halaman 1.
	page: z.coerce.number().int().min(1).default(1),

	// Batasi limit agar user tidak bisa meminta terlalu banyak data sekaligus
	limit: z.coerce.number().int().min(1).max(100).default(10),

	// Pencarian teks (opsional)
	q: z.string().optional(),

	// Mendukung Bulk Fetching: "id1,id2,id3" -> ["id1", "id2", "id3"]
	// Berguna untuk fitur Favorit saat sinkronisasi data
	ids: z
		.string()
		.optional()
		.transform((val) =>
			val
				? val
						.split(",")
						.map((id) => id.trim())
						.filter(Boolean)
				: undefined
		),
});

// Tipe TypeScript otomatis (inferred)
export type PaginationParams = z.infer<typeof PaginationSchema>;

/**
 * =========================================
 * EVENT SCHEMA
 * =========================================
 * Digunakan untuk validasi payload saat POST (Create) atau PUT (Update).
 * Menjamin integritas data sebelum masuk ke Prisma.
 */
export const EventSchema = z.object({
	title: z
		.string()
		.min(5, { message: "Judul acara minimal 5 karakter" })
		.max(150, { message: "Judul acara maksimal 150 karakter" }),

	description: z
		.string()
		.min(20, { message: "Deskripsi minimal 20 karakter agar informatif" }),

	// Validasi string ISO 8601 (contoh: "2023-10-25T10:00:00Z")
	date: z
		.string()
		.datetime({ message: "Format tanggal tidak valid, gunakan ISO 8601" }),

	location: z.string().min(3, { message: "Lokasi wajib diisi" }),

	// URL gambar valid, opsional, atau string kosong diperbolehkan
	imageUrl: z
		.string()
		.url({ message: "URL gambar tidak valid" })
		.optional()
		.or(z.literal("")),

	isFeatured: z.boolean().default(false),

	// Validasi ID relasi (menggunakan format CUID default Prisma)
	categoryId: z.string().cuid({ message: "ID Kategori tidak valid" }),
	organizerId: z.string().cuid({ message: "ID Penyelenggara tidak valid" }),
});

// Tipe TypeScript otomatis untuk Payload API
export type EventInput = z.infer<typeof EventSchema>;

/**
 * =========================================
 * FAVORITE SNAPSHOT SCHEMA
 * =========================================
 * Skema untuk data minimal yang disimpan di LocalStorage (Offline Mode).
 * Subset dari data Event lengkap.
 */
export const FavoriteSnapshotSchema = z.object({
	id: z.string(),
	title: z.string(),
	date: z.string(),
	location: z.string(),
	imageUrl: z.string().nullable().optional(),
	category: z
		.object({
			name: z.string(),
			icon: z.string(),
		})
		.optional(),
});

export type FavoriteSnapshot = z.infer<typeof FavoriteSnapshotSchema>;
