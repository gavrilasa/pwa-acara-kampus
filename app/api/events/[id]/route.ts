import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	request: Request,
	// PERBAIKAN 1: Tipe params dibungkus Promise
	{ params }: { params: Promise<{ id: string }> }
) {
	// PERBAIKAN 2: Await params sebelum akses properti
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
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
