import {
	Music,
	BookOpen,
	Briefcase,
	Trophy,
	Palette,
	Code,
	Heart,
	CircleHelp,
	LucideIcon,
} from "lucide-react";

export const IconMap: Record<string, LucideIcon> = {
	music: Music,
	education: BookOpen,
	career: Briefcase,
	sports: Trophy,
	art: Palette,
	tech: Code,
	health: Heart,
	default: CircleHelp,
};

export const getIconComponent = (iconName: string): LucideIcon => {
	return IconMap[iconName] || IconMap.default;
};
