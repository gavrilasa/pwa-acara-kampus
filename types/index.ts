export interface Category {
	id: string;
	name: string;
	icon: string;
}

export interface Organizer {
	id: string;
	name: string;
	contact: string;
	description?: string;
}

export interface Event {
	id: string;
	title: string;
	description: string;
	date: string; // Dikirim sebagai string ISO dari API
	location: string;
	imageUrl?: string;
	isFeatured: boolean;
	category?: Category;
	organizer?: Organizer;
}
