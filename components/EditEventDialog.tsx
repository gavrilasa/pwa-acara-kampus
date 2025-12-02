"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Loader2, Save } from "lucide-react";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"; // Pastikan install komponen Dialog shadcn
import { Input } from "@/components/ui/input";
// Menggunakan label HTML biasa karena komponen Label tidak ada di file list
import { cn } from "@/lib/utils";

interface EditEventDialogProps {
	event: Event;
	onUpdate: (updatedEvent: Event) => void;
}

export default function EditEventDialog({
	event,
	onUpdate,
}: EditEventDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Konversi tanggal ISO ke format datetime-local input (YYYY-MM-DDTHH:mm)
	const defaultDate = new Date(event.date).toISOString().slice(0, 16);

	const [formData, setFormData] = useState({
		title: event.title,
		description: event.description,
		date: defaultDate,
		location: event.location,
		imageUrl: event.imageUrl || "",
		categoryId: event.category?.id || "", // Membutuhkan ID kategori yang valid
		organizerId: event.organizer?.id || "", // Membutuhkan ID organizer yang valid
		isFeatured: event.isFeatured,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Format tanggal kembali ke ISO string penuh untuk API
			const payload = {
				...formData,
				date: new Date(formData.date).toISOString(),
			};

			const res = await fetch(`/api/events/${event.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const err = await res.json();
				alert("Gagal update: " + JSON.stringify(err));
				return;
			}

			const updatedEvent = await res.json();
			onUpdate(updatedEvent);
			setOpen(false);
			router.refresh(); // Refresh data server component jika perlu
		} catch (error) {
			console.error("Error updating event:", error);
			alert("Terjadi kesalahan saat menyimpan perubahan.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					size="icon"
					className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md text-zinc-800 hover:bg-white shadow-sm transition-all"
				>
					<Pencil size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Acara</DialogTitle>
					<DialogDescription>
						Ubah detail acara di bawah ini. Klik simpan setelah selesai.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="grid gap-4 py-4">
					<div className="grid gap-2">
						<label htmlFor="title" className="text-sm font-medium">
							Judul Acara
						</label>
						<Input
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							minLength={5}
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="date" className="text-sm font-medium">
							Tanggal & Waktu
						</label>
						<Input
							id="date"
							name="date"
							type="datetime-local"
							value={formData.date}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="location" className="text-sm font-medium">
							Lokasi
						</label>
						<Input
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="imageUrl" className="text-sm font-medium">
							URL Gambar (Opsional)
						</label>
						<Input
							id="imageUrl"
							name="imageUrl"
							type="url"
							value={formData.imageUrl}
							onChange={handleChange}
							placeholder="https://..."
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="description" className="text-sm font-medium">
							Deskripsi
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							required
							minLength={20}
							className={cn(
								"flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							)}
						/>
					</div>
					{/* Hidden fields untuk ID relasi agar validasi schema lulus */}
					<input type="hidden" name="categoryId" value={formData.categoryId} />
					<input
						type="hidden"
						name="organizerId"
						value={formData.organizerId}
					/>
				</form>
				<DialogFooter>
					<Button type="submit" onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Menyimpan...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Simpan Perubahan
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
