import Link from "@/lib/navigation";
import type { ProfileInput } from "@/lib/validation";
import { uz } from "@/lib/text";
export type PublicProfile = ProfileInput & { id: string; username: string };
export default function Portfolio({ profile, user }: { profile: PublicProfile; user: { id: string } | null }) {
  const { links } = profile;
  const contacts = [
    { name: uz.fields.email, value: links.email, href: links.email ? `mailto:${links.email}` : "" },
    {
      name: uz.fields.phone,
      value: links.phone,
      href: links.phone ? `tel:${links.phone.replace(/[^+\d]/g, "")}` : "",
    },
    ...(["telegram", "linkedin", "github", "website"] as const).map((key) => ({
      name: uz.fields[key],
      value: links[key],
      href: links[key],
    })),
  ].filter((item) => item.value);
  return (
    <main className="shell max-w-4xl py-10 sm:py-16">
      <header className="mb-12 border-b border-stone-200 pb-12">
        {user?.id === profile.id && (
          <div className="mb-6 flex justify-end">
            <Link href="/edit" className="secondary">
              {uz.edit}
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              width={144}
              height={144}
              className="h-32 w-32 shrink-0 rounded-3xl object-cover sm:h-36 sm:w-36"
            />
          )}
          <div className="min-w-0">
            <h1 className="break-words text-4xl font-bold leading-tight sm:text-5xl">
              {profile.full_name || profile.username}
            </h1>
            {profile.headline && (
              <p className="mt-4 break-words text-xl font-medium text-emerald-800">
                {profile.headline}
              </p>
            )}
          </div>
        </div>
        {profile.bio && (
          <p className="mt-7 max-w-2xl whitespace-pre-line break-words text-lg leading-8 text-slate-600">
            {profile.bio}
          </p>
        )}
      </header>
      <div className="space-y-12">
        {!!profile.skills.length && (
          <section>
            <h2 className="section-title">{uz.skills}</h2>
            <ul className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <li
                  key={i}
                  className="max-w-full break-words rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-900"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}
        {!!profile.projects.length && (
          <section>
            <h2 className="section-title">{uz.projects}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {profile.projects.map((p, i) => (
                <article
                  key={i}
                  className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white"
                >
                  {p.image_url && (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      width={640}
                      height={400}
                      loading="lazy"
                      className="aspect-[8/5] w-full object-cover"
                    />
                  )}
                  <div className="space-y-3 p-6">
                    <h3 className="break-words text-xl font-semibold">{p.title}</h3>
                    {p.description && (
                      <p className="whitespace-pre-line break-words leading-7 text-slate-600">
                        {p.description}
                      </p>
                    )}
                    {p.link && (
                      <a
                        className="inline-block font-semibold text-emerald-800 underline-offset-4 hover:underline"
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {uz.viewProject} <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {!!profile.experience.length && (
          <section>
            <h2 className="section-title">{uz.experience}</h2>
            <div className="space-y-6">
              {profile.experience.map((e, i) => (
                <article key={i} className="border-l-2 border-emerald-200 pl-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="break-words text-lg font-semibold">{e.role}</h3>
                    {e.period && <p className="muted">{e.period}</p>}
                  </div>
                  {e.company && (
                    <p className="mt-1 break-words font-medium text-emerald-800">{e.company}</p>
                  )}
                  {e.description && (
                    <p className="mt-3 whitespace-pre-line break-words leading-7 text-slate-600">
                      {e.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
        {!!profile.education.length && (
          <section>
            <h2 className="section-title">{uz.education}</h2>
            <div className="space-y-6">
              {profile.education.map((e, i) => (
                <article key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="break-words text-lg font-semibold">{e.school}</h3>
                    {e.period && <p className="muted">{e.period}</p>}
                  </div>
                  {e.degree && <p className="mt-2 break-words text-slate-600">{e.degree}</p>}
                </article>
              ))}
            </div>
          </section>
        )}
        {!!contacts.length && (
          <section className="border-t border-stone-200 pt-8">
            <h2 className="section-title">{uz.contact}</h2>
            <ul className="flex flex-wrap gap-3">
              {contacts.map((item) => (
                <li key={item.name} className="min-w-0 max-w-full">
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="secondary max-w-full break-all"
                  >
                    {item.name}
                    {item.name === uz.fields.email || item.name === uz.fields.phone
                      ? `: ${item.value}`
                      : " ↗"}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
