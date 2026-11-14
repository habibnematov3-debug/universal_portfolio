import { z } from "zod";
import { uz } from "./text.ts";
export function validationMessage(issue: z.core.$ZodIssue): string {
  const key = String(issue.path.at(-1));
  const group = String(issue.path[0]);
  const label =
    uz.fields[key as keyof typeof uz.fields] ||
    (
      {
        skills: uz.skills,
        projects: uz.projects,
        experience: uz.experience,
        education: uz.education,
      } as Record<string, string>
    )[group] ||
    uz.edit;
  const row = typeof issue.path[1] === "number" ? ` ${issue.path[1] + 1}` : "";
  const message =
    issue.code === "too_big"
      ? uz.validation.tooBig(issue.maximum)
      : issue.code === "invalid_type"
        ? uz.validation.invalidType
        : issue.code === "too_small"
          ? uz.validation.required
          : issue.code === "invalid_union"
            ? uz.invalidEmail
            : issue.message;
  return `${label}${row}: ${message}`;
}
export const reserved = [
  "edit",
  "login",
  "api",
  "admin",
  "auth",
  "onboarding",
  "logout",
  "portfolio",
  "www",
  "favicon",
  "robots",
  "sitemap",
  "settings",
  "account",
  "support",
];
export const usernameSchema = z
  .string()
  .min(3, uz.validation.usernameShort)
  .max(30, uz.validation.usernameLong)
  .regex(/^[a-z0-9-]+$/, uz.validation.usernameFormat)
  .refine((v) => !reserved.includes(v), uz.validation.reserved);
const text = z.string().trim().max(2000, uz.validation.textLong);
export const safeUrl = (v: string) => {
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol) && !u.username && !u.password ? u.href : "";
  } catch {
    return "";
  }
};
const url = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => !v || !!safeUrl(v), uz.validation.url);
export const projectSchema = z.object({
  title: z.string().trim().min(1, uz.validation.project).max(150),
  description: text,
  link: url,
  image_url: url,
});
export const experienceSchema = z.object({
  role: z.string().trim().min(1, uz.validation.role).max(150),
  company: text,
  period: z.string().max(100),
  description: text,
});
export const educationSchema = z.object({
  school: z.string().trim().min(1, uz.validation.school).max(200),
  degree: text,
  period: z.string().max(100),
});
export const linksSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254)
    .refine((value) => !value || z.email().safeParse(value).success, uz.invalidEmail),
  phone: z
    .string()
    .max(40)
    .regex(/^[+\d\s().-]*$/, uz.validation.phone),
  telegram: url,
  linkedin: url,
  github: url,
  website: url,
});
export const profileSchema = z.object({
  full_name: z.string().trim().min(1, uz.validation.fullName).max(120),
  headline: z.string().trim().max(180),
  bio: z.string().trim().max(2000),
  avatar_url: url,
  skills: z.array(z.string().trim().min(1, uz.validation.skill).max(60)).max(40),
  projects: z.array(projectSchema).max(30),
  experience: z.array(experienceSchema).max(30),
  education: z.array(educationSchema).max(20),
  links: linksSchema,
});
export type ProfileInput = z.infer<typeof profileSchema>;
export const emptyProfile: ProfileInput = {
  full_name: "",
  headline: "",
  bio: "",
  avatar_url: "",
  skills: [],
  projects: [],
  experience: [],
  education: [],
  links: { email: "", phone: "", telegram: "", linkedin: "", github: "", website: "" },
};
export function profileValues(row: Record<string, unknown>): ProfileInput {
  const list = <T>(value: unknown, schema: z.ZodType<T>): T[] =>
    Array.isArray(value)
      ? value.flatMap((x) => {
          const p = schema.safeParse(x);
          return p.success ? [p.data] : [];
        })
      : [];
  return {
    full_name: typeof row.full_name === "string" ? row.full_name : "",
    headline: typeof row.headline === "string" ? row.headline : "",
    bio: typeof row.bio === "string" ? row.bio : "",
    avatar_url: typeof row.avatar_url === "string" ? safeUrl(row.avatar_url) : "",
    skills: list(row.skills, z.string().trim().min(1).max(60)),
    projects: list(row.projects, projectSchema),
    experience: list(row.experience, experienceSchema),
    education: list(row.education, educationSchema),
    links: {
      ...emptyProfile.links,
      ...(linksSchema.safeParse({ ...emptyProfile.links, ...((row.links as object) || {}) }).data ||
        {}),
    },
  };
}
