import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q") || "";

	try {
		const events = await prisma.event.findMany({
			where: {
				OR: [
					{ title: { contains: query, mode: "insensitive" } },
					{ description: { contains: query, mode: "insensitive" } },
				],
			},
			include: {
				category: true, // Sertakan nama kategori untuk UI card
			},
			orderBy: { date: "asc" },
		});
		return NextResponse.json(events);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// Pastikan validasi data di sini sebelum masuk DB (misal pakai Zod)

		const event = await prisma.event.create({
			data: {
				title: body.title,
				description: body.description,
				date: new Date(body.date),
				location: body.location,
				imageUrl: body.imageUrl,
				categoryId: body.categoryId,
				organizerId: body.organizerId,
				isFeatured: body.isFeatured || false,
			},
		});
		return NextResponse.json(event, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to create event" },
			{ status: 500 }
		);
	}
}
