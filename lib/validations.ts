import { z } from "zod";

export const PaginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	q: z.string().optional(),
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

export type PaginationParams = z.infer<typeof PaginationSchema>;

export const EventSchema = z.object({
	title: z
		.string()
		.min(5, { message: "Judul acara minimal 5 karakter" })
		.max(150, { message: "Judul acara maksimal 150 karakter" }),

	description: z
		.string()
		.min(20, { message: "Deskripsi minimal 20 karakter agar informatif" }),

	date: z
		.string()
		.datetime({ message: "Format tanggal tidak valid, gunakan ISO 8601" }),

	location: z.string().min(3, { message: "Lokasi wajib diisi" }),

	imageUrl: z
		.string()
		.url({ message: "URL gambar tidak valid" })
		.optional()
		.or(z.literal("")),

	isFeatured: z.boolean().default(false),

	categoryId: z.string().cuid({ message: "ID Kategori tidak valid" }),
	organizerId: z.string().cuid({ message: "ID Penyelenggara tidak valid" }),
});

export type EventInput = z.infer<typeof EventSchema>;

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
