import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  usernameSchema,
  reserved,
  profileSchema,
  emptyProfile,
  safeUrl,
  profileValues,
  validationMessage,
} from "../lib/validation.ts";

test("username accepts exact boundary lengths and rejects illegal or reserved names", () => {
  for (const name of ["ali", "xabib-2003", "a".repeat(30)])
    assert.equal(usernameSchema.safeParse(name).success, true, name);
  for (const name of [
    "ab",
    "a".repeat(31),
    "Ali",
    "ali_123",
    "ali/test",
    "ali test",
    "o‘zbek",
    ...reserved,
  ])
    assert.equal(usernameSchema.safeParse(name).success, false, name);
});
test("database and application reserve the same names", () => {
  const sql = readFileSync(
    new URL("../supabase/migrations/001_profiles.sql", import.meta.url),
    "utf8",
  );
  const names = [...sql.match(/username not in \(([^)]+)\)/)[1].matchAll(/'([^']+)'/g)].map(
    (m) => m[1],
  );
  assert.deepEqual(names, reserved);
});
test("only http(s) external links without embedded credentials are accepted", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.test",
    "https://user:password@example.com",
    "ftp://example.com",
  ])
    assert.equal(safeUrl(value), "");
  assert.equal(safeUrl("https://example.com/project"), "https://example.com/project");
});
test("name is required; empty optional sections remain valid", () => {
  assert.equal(profileSchema.safeParse(emptyProfile).success, false);
  const profile = profileSchema.parse({ ...emptyProfile, full_name: "  Xabib  " });
  assert.equal(profile.full_name, "Xabib");
  assert.deepEqual(profile.projects, []);
});
test("dynamic rows require meaningful titles and enforce list limits", () => {
  const profile = { ...emptyProfile, full_name: "Xabib" };
  assert.equal(
    profileSchema.safeParse({
      ...profile,
      projects: [{ title: "", description: "", link: "", image_url: "" }],
    }).success,
    false,
  );
  assert.equal(
    profileSchema.safeParse({ ...profile, skills: Array(41).fill("TypeScript") }).success,
    false,
  );
  assert.equal(
    profileSchema.safeParse({
      ...profile,
      projects: [{ title: "Demo", description: "", link: "javascript:alert(1)", image_url: "" }],
    }).success,
    false,
  );
  assert.equal(
    profileSchema.safeParse({
      ...profile,
      education: [{ school: "Universitet", degree: "Bakalavr", period: "2022–2026" }],
    }).success,
    true,
  );
});
test("public data normalization drops malformed and unsafe rows", () => {
  const result = profileValues({
    full_name: "Xabib",
    avatar_url: "javascript:alert(1)",
    skills: ["React", 42],
    projects: [{ title: "Bad", description: "", link: "javascript:alert(1)", image_url: "" }],
    links: null,
    experience: null,
    education: {},
  });
  assert.equal(result.avatar_url, "");
  assert.deepEqual(result.skills, ["React"]);
  assert.deepEqual(result.projects, []);
  assert.deepEqual(result.links, emptyProfile.links);
});
test("mass assignment cannot change profile identity", () => {
  const result = profileSchema.parse({
    ...emptyProfile,
    full_name: "Xabib",
    user_id: "another-owner",
    username: "admin",
    id: "different-id",
  });
  assert.equal("user_id" in result, false);
  assert.equal("username" in result, false);
  assert.equal("id" in result, false);
});
test("validation errors include Uzbek field names and row positions", () => {
  const result = profileSchema.safeParse({
    ...emptyProfile,
    full_name: "Xabib",
    projects: [{ title: "", description: "", link: "", image_url: "" }],
  });
  assert.equal(result.success, false);
  assert.match(validationMessage(result.error.issues[0]), /Loyiha nomi 1:/);
});

test("invalid email produces an Uzbek error, and whitespace skills stay hidden", () => {
  const result = profileSchema.safeParse({
    ...emptyProfile,
    full_name: "Xabib",
    links: { ...emptyProfile.links, email: "not-email" },
  });
  assert.equal(result.success, false);
  assert.match(validationMessage(result.error.issues[0]), /To‘g‘ri email kiriting/);
  assert.deepEqual(profileValues({ skills: ["  ", " React "] }).skills, ["React"]);
});
