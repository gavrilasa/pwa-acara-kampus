import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	request: Request,
	// PERBAIKAN 1: Tipe params dibungkus Promise
	{ params }: { params: Promise<{ id: string }> }
) {
	// PERBAIKAN 2: Await params
	const { id } = await params;

	try {
		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				events: {
					orderBy: { date: "asc" },
				},
			},
		});

		if (!category) {
			return NextResponse.json(
				{ error: "Category not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(category);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
