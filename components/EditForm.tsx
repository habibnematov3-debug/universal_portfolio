"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveProfile, signOut } from "@/app/actions";
import { browserClient } from "@/lib/supabase/browser";
import { profileSchema, type ProfileInput, validationMessage } from "@/lib/validation";
import { uz } from "@/lib/text";

type FieldName = keyof typeof uz.fields;
function Field({
  name,
  value,
  onChange,
  multiline = false,
}: {
  name: FieldName;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const props = {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };
  return (
    <label>
      {uz.fields[name]}
      {multiline ? (
        <textarea {...props} />
      ) : (
        <input {...props} type={name === "email" ? "email" : name === "phone" ? "tel" : "text"} />
      )}
    </label>
  );
}

export default function EditForm({
  initial,
  username,
  userId,
}: {
  initial: ProfileInput;
  username: string;
  userId: string;
}) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [copyMessage, setCopyMessage] = useState("");
  const [fallbackLink, setFallbackLink] = useState("");
  const router = useRouter();
  function change<K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) {
    setData((old) => ({ ...old, [key]: value }));
    setMessage("");
    setErrors([]);
  }
  async function upload(file: File | undefined, projectIndex?: number) {
    if (!file) return;
    setMessage("");
    setErrors([]);
    const extensions: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    if (!extensions[file.type] || file.size > 5 * 1024 * 1024) {
      setErrors([uz.imageRule]);
      return;
    }
    setBusy(true);
    try {
      // Decode before storing so a renamed non-image is rejected by the editor.
      const bitmap = await createImageBitmap(file);
      bitmap.close();
      const client = browserClient();
      const bucket = projectIndex === undefined ? "avatars" : "project-images";
      const path = `${userId}/${crypto.randomUUID()}.${extensions[file.type]}`;
      const { error } = await client.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        setErrors([uz.uploadError]);
        return;
      }
      const { data: uploaded } = client.storage.from(bucket).getPublicUrl(path);
      if (projectIndex === undefined) change("avatar_url", uploaded.publicUrl);
      else
        setData((old) => ({
          ...old,
          projects: old.projects.map((p, i) =>
            i === projectIndex ? { ...p, image_url: uploaded.publicUrl } : p,
          ),
        }));
      setMessage(uz.uploaded);
    } catch {
      setErrors([uz.uploadError]);
    } finally {
      setBusy(false);
    }
  }
  function ImageField({ value, index }: { value: string; index?: number }) {
    return (
      <div className="space-y-3">
        {value && (
          <img
            src={value}
            alt={index === undefined ? uz.fields.avatar_url : uz.fields.image_url}
            className={
              index === undefined
                ? "h-24 w-24 rounded-2xl object-cover"
                : "max-h-48 w-full rounded-xl object-cover"
            }
            width={index === undefined ? 96 : 640}
            height={index === undefined ? 96 : 360}
          />
        )}
        <label className="w-fit cursor-pointer rounded-xl focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-emerald-700">
          {index === undefined ? uz.fields.avatar_url : uz.fields.image_url}
          <span className="secondary">{uz.upload}</span>
          <input
            className="sr-only"
            aria-label={index === undefined ? uz.fields.avatar_url : uz.fields.image_url}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              void upload(e.target.files?.[0], index);
              e.target.value = "";
            }}
          />
        </label>
        <p className="muted">{uz.imageRule}</p>
        {value && (
          <button
            type="button"
            className="secondary"
            onClick={() =>
              index === undefined
                ? change("avatar_url", "")
                : change(
                    "projects",
                    data.projects.map((p, i) => (i === index ? { ...p, image_url: "" } : p)),
                  )
            }
          >
            {uz.removeImage}
          </button>
        )}
      </div>
    );
  }
  return (
    <main className="shell max-w-3xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link className="text-xl font-bold" href="/">
          {uz.brand}
        </Link>
        <button
          className="secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const result = await signOut();
              if (result.error) setErrors([result.error]);
              else {
                router.replace("/login");
                router.refresh();
              }
            } catch {
              setErrors([uz.networkError]);
            } finally {
              setBusy(false);
            }
          }}
        >
          {uz.logout}
        </button>
      </header>
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold">{uz.edit}</h1>
        <p className="muted">/{username}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="secondary"
            onClick={async () => {
              const url = window.location.origin + "/" + username;
              try {
                await navigator.clipboard.writeText(url);
                setCopyMessage(uz.copied);
              } catch {
                setFallbackLink(url);
                setCopyMessage(uz.copyManually);
              }
            }}
          >
            {uz.copy}
          </button>
          <Link
            className="secondary"
            target="_blank"
            rel="noopener noreferrer"
            href={"/" + username}
          >
            {uz.view} ↗
          </Link>
        </div>
        <p role="status" className="muted">
          {copyMessage}
        </p>
        {fallbackLink && (
          <input
            aria-label={uz.copy}
            readOnly
            value={fallbackLink}
            onFocus={(e) => e.target.select()}
          />
        )}
      </div>
      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          setErrors([]);
          setMessage("");
          const parsed = profileSchema.safeParse(data);
          if (!parsed.success) {
            setErrors(parsed.error.issues.map(validationMessage));
            return;
          }
          setBusy(true);
          try {
            const result = await saveProfile(parsed.data);
            if (result.error) setErrors([result.error]);
            else {
              setData(parsed.data);
              setMessage(uz.saved);
              router.refresh();
            }
          } catch {
            setErrors([uz.networkError]);
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy} className="min-w-0 space-y-6">
          <section className="panel space-y-5">
            <h2 className="section-title">{uz.about}</h2>
            <ImageField value={data.avatar_url} />
            {(["full_name", "headline", "bio"] as const).map((name) => (
              <Field
                key={name}
                name={name}
                value={data[name]}
                multiline={name === "bio"}
                onChange={(v) => change(name, v)}
              />
            ))}
          </section>
          <section className="panel">
            <h2 className="section-title">{uz.skills}</h2>
            <div className="space-y-3">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-end gap-2">
                  <label className="min-w-0 flex-1">
                    {uz.skill} {i + 1}
                    <input
                      value={skill}
                      maxLength={60}
                      onChange={(e) =>
                        change(
                          "skills",
                          data.skills.map((v, n) => (n === i ? e.target.value : v)),
                        )
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="secondary"
                    aria-label={`${uz.remove} ${uz.skill} ${i + 1}`}
                    onClick={() =>
                      change(
                        "skills",
                        data.skills.filter((_, n) => n !== i),
                      )
                    }
                  >
                    {uz.remove}
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="secondary mt-4"
              disabled={data.skills.length >= 40}
              onClick={() => change("skills", [...data.skills, ""])}
            >
              + {uz.add}
            </button>
          </section>
          <section className="panel">
            <h2 className="section-title">{uz.projects}</h2>
            <div className="space-y-6">
              {data.projects.map((project, i) => (
                <div key={i} className="space-y-4 rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      {uz.project} {i + 1}
                    </h3>
                    <button
                      className="secondary"
                      type="button"
                      aria-label={`${uz.remove} ${uz.project} ${i + 1}`}
                      onClick={() =>
                        change(
                          "projects",
                          data.projects.filter((_, n) => n !== i),
                        )
                      }
                    >
                      {uz.remove}
                    </button>
                  </div>
                  {(["title", "description", "link"] as const).map((name) => (
                    <Field
                      key={name}
                      name={name}
                      value={project[name]}
                      multiline={name === "description"}
                      onChange={(v) =>
                        change(
                          "projects",
                          data.projects.map((p, n) => (n === i ? { ...p, [name]: v } : p)),
                        )
                      }
                    />
                  ))}
                  <ImageField value={project.image_url} index={i} />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="secondary mt-4"
              disabled={data.projects.length >= 30}
              onClick={() =>
                change("projects", [
                  ...data.projects,
                  { title: "", description: "", link: "", image_url: "" },
                ])
              }
            >
              + {uz.add}
            </button>
          </section>
          <section className="panel">
            <h2 className="section-title">{uz.experience}</h2>
            <div className="space-y-6">
              {data.experience.map((item, i) => (
                <div key={i} className="space-y-4 rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      {uz.experience} {i + 1}
                    </h3>
                    <button
                      className="secondary"
                      type="button"
                      aria-label={`${uz.remove} ${uz.experience} ${i + 1}`}
                      onClick={() =>
                        change(
                          "experience",
                          data.experience.filter((_, n) => n !== i),
                        )
                      }
                    >
                      {uz.remove}
                    </button>
                  </div>
                  {(["role", "company", "period", "description"] as const).map((name) => (
                    <Field
                      key={name}
                      name={name}
                      value={item[name]}
                      multiline={name === "description"}
                      onChange={(v) =>
                        change(
                          "experience",
                          data.experience.map((p, n) => (n === i ? { ...p, [name]: v } : p)),
                        )
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="secondary mt-4"
              disabled={data.experience.length >= 30}
              onClick={() =>
                change("experience", [
                  ...data.experience,
                  { role: "", company: "", period: "", description: "" },
                ])
              }
            >
              + {uz.add}
            </button>
          </section>
          <section className="panel">
            <h2 className="section-title">{uz.education}</h2>
            <div className="space-y-6">
              {data.education.map((item, i) => (
                <div key={i} className="space-y-4 rounded-xl border border-stone-200 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">
                      {uz.education} {i + 1}
                    </h3>
                    <button
                      className="secondary"
                      type="button"
                      aria-label={`${uz.remove} ${uz.education} ${i + 1}`}
                      onClick={() =>
                        change(
                          "education",
                          data.education.filter((_, n) => n !== i),
                        )
                      }
                    >
                      {uz.remove}
                    </button>
                  </div>
                  {(["school", "degree", "period"] as const).map((name) => (
                    <Field
                      key={name}
                      name={name}
                      value={item[name]}
                      onChange={(v) =>
                        change(
                          "education",
                          data.education.map((p, n) => (n === i ? { ...p, [name]: v } : p)),
                        )
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="secondary mt-4"
              disabled={data.education.length >= 20}
              onClick={() =>
                change("education", [...data.education, { school: "", degree: "", period: "" }])
              }
            >
              + {uz.add}
            </button>
          </section>
          <section className="panel space-y-5">
            <h2 className="section-title">{uz.contact}</h2>
            <p className="muted">{uz.publicContacts}</p>
            {(["email", "phone", "telegram", "linkedin", "github", "website"] as const).map(
              (name) => (
                <Field
                  key={name}
                  name={name}
                  value={data.links[name]}
                  onChange={(v) => change("links", { ...data.links, [name]: v })}
                />
              ),
            )}
          </section>
          <div aria-live="polite" className="space-y-3">
            {!!errors.length && (
              <div role="alert" className="error">
                <ul className="list-inside list-disc">
                  {[...new Set(errors)].map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
            {message && (
              <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-900">
                {message}
              </p>
            )}
            <button className="btn w-full" disabled={busy}>
              {busy ? uz.saving : uz.save}
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  );
}
