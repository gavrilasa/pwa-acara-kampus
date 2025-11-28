import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { EventSchema, PaginationSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: NextRequest) {
	const searchParams = Object.fromEntries(
		request.nextUrl.searchParams.entries()
	);

	try {
		const { page, limit, q, ids } = PaginationSchema.parse(searchParams);

		if (ids && ids.length > 0) {
			const events = await prisma.event.findMany({
				where: {
					id: { in: ids },
				},
				include: {
					category: true,
				},
				orderBy: { date: "asc" },
			});
			return NextResponse.json(events);
		}

		const whereClause: Prisma.EventWhereInput = {};

		if (q) {
			whereClause.OR = [
				{ title: { contains: q, mode: "insensitive" } },
				{ description: { contains: q, mode: "insensitive" } },
			];
		}

		const events = await prisma.event.findMany({
			where: whereClause,
			include: {
				category: true,
			},
			orderBy: { date: "asc" },
			skip: (page - 1) * limit,
			take: limit,
		});

		return NextResponse.json(events);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}

		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

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

		const event = await prisma.event.create({
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
		});

		return NextResponse.json(event, { status: 201 });
	} catch (error) {
		console.error("Create Event Error:", error);
		return NextResponse.json(
			{ error: "Failed to create event" },
			{ status: 500 }
		);
	}
}
