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
	date: string;
	location: string;
	imageUrl?: string | null;
	isFeatured: boolean;
	category?: Category;
	organizer?: Organizer;
}

export interface FavoriteSnapshot {
	id: string;
	title: string;
	date: string;
	location: string;
	imageUrl?: string | null;
	category?: {
		name: string;
		icon: string;
	};
}
