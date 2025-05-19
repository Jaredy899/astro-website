import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.date(),
		// Add optional fields for better organization
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = {
	blog: blogCollection,
} as const; 