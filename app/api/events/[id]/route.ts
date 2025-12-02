import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EventSchema } from "@/lib/validations";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const event = await prisma.event.findUnique({
			where: { id },
			include: {
				category: true,
				organizer: true,
			},
		});

		if (!event) {
			return NextResponse.json({ error: "Event not found" }, { status: 404 });
		}

		return NextResponse.json(event);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" + error },
			{ status: 500 }
		);
	}
}

// TAMBAHKAN METHOD INI
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;

	try {
		const body = await request.json();

		// Validasi input menggunakan Zod Schema yang sudah ada
		const validationResult = EventSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation Error",
					details: validationResult.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { data } = validationResult;

		const updatedEvent = await prisma.event.update({
			where: { id },
			data: {
				title: data.title,
				description: data.description,
				date: new Date(data.date),
				location: data.location,
				imageUrl: data.imageUrl || null,
				categoryId: data.categoryId,
				organizerId: data.organizerId,
				isFeatured: data.isFeatured,
			},
			include: {
				category: true,
				organizer: true,
			},
		});

		return NextResponse.json(updatedEvent);
	} catch (error) {
		console.error("Update Error:", error);
		return NextResponse.json(
			{ error: "Gagal mengupdate acara" },
			{ status: 500 }
		);
	}
}
