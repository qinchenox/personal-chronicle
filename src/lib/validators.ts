import { z } from "zod";

const basicsSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  summary: z.string(),
  avatar: z.string(),
  media: z.array(z.any()).optional(),
}).passthrough();

export const resumeDataSchema = z.object({
  basics: basicsSchema,
  skills: z.array(z.object({
    id: z.string(), category: z.string(), items: z.array(z.string()),
  }).passthrough()),
  experience: z.array(z.object({
    id: z.string(), company: z.string(), position: z.string(),
    startDate: z.string(), endDate: z.string(), summary: z.string(),
    highlights: z.array(z.string()),
  }).passthrough()),
  education: z.array(z.object({
    id: z.string(), institution: z.string(), degree: z.string(),
    field: z.string(), startDate: z.string(), endDate: z.string(),
  })),
  projects: z.array(z.object({
    id: z.string(), name: z.string(), description: z.string(),
    url: z.string(), highlights: z.array(z.string()),
  }).passthrough()),
  languages: z.array(z.object({
    id: z.string(), language: z.string(), proficiency: z.string(),
  })),
  certifications: z.array(z.object({
    id: z.string(), name: z.string(), issuer: z.string(), date: z.string(),
  })),
  themeId: z.string(),
}).passthrough();
