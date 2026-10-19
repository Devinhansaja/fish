"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { availabilityLabel, categories, categoryLabel, type Availability, type CategoryId, type Species } from "@/lib/species";

type Errors = Record<string, string>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

type Draft = Omit<Species, "id"> & { id?: string };

const blank: Draft = {
  slug: "",
  commonName: "",
  scientificName: "",
  category: "livebearers",
  naturalRange: "",
  description: "",
  images: [],
  adultSize: "",
  temperature: "",
  ph: "",
  hardness: "",
  feeding: "",
  colorVarieties: "",
  availability: "on-request",
  featured: false,
  careVerified: false,
  accent: "#00b4c6",
  exportCheckRequired: false,
};

/* ------------------------------------------------------------------ */
/* Small form helpers                                                  */
/* ------------------------------------------------------------------ */
const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-navy placeholder:text-slate-400 focus:border-aqua focus:outline-none focus:ring-4 focus:ring-aqua/20";

function Field({ label, hint, error, children, className = "" }: { label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold text-navy">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-semibold text-[#b3261e]">{error}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */
function Login({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !json.ok) throw new Error(json.message ?? "Sign-in failed");
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl ring-1 ring-navy/10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua-700">Aquazone</p>
        <h1 className="mt-1 text-3xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Manage the fish catalog shown on the website.</p>
        <div className="mt-6 space-y-4">
          <Field label="User name">
            <input name="username" autoComplete="username" required autoFocus className={inputCls} />
          </Field>
          <Field label="Password">
            <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
          </Field>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-[#fde8e5] p-3 text-sm font-semibold text-[#8c2118]">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-cta mt-6 w-full justify-center disabled:opacity-70">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */
function Editor({
  initial,
  onCancel,
  onSaved,
  onUnauthorized,
}: {
  initial: Draft;
  onCancel: () => void;
  onSaved: (s: Species, created: boolean) => void;
  onUnauthorized: () => void;
}) {
  const [d, setD] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const isNew = !initial.id;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadMsg("");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (res.status === 401) return onUnauthorized();
        const json = (await res.json()) as { ok: boolean; url?: string; message?: string };
        if (!res.ok || !json.url) throw new Error(json.message ?? "Upload failed");
        urls.push(json.url);
      } catch (err) {
        setUploadMsg(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
    }
    if (urls.length) setD((p) => ({ ...p, images: [...p.images, ...urls].slice(0, 12) }));
    setUploading(false);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const res = await fetch(isNew ? "/api/admin/species" : `/api/admin/species/${initial.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      if (res.status === 401) return onUnauthorized();
      const json = (await res.json()) as { ok: boolean; species?: Species; errors?: Errors; message?: string };
      if (!res.ok || !json.species) {
        setErrors(json.errors ?? { _: json.message ?? "Could not save." });
        return;
      }
      onSaved(json.species, isNew);
    } catch {
      setErrors({ _: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  const grouped = useMemo(() => {
    const g: Record<string, typeof categories> = {};
    categories.forEach((c) => (g[c.group] ??= []).push(c));
    return g;
  }, []);

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-8 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl">{isNew ? "Add a fish" : `Edit: ${initial.commonName}`}</h2>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200">
          &larr; Back to list
        </button>
      </div>

      {errors._ && <p role="alert" className="rounded-xl bg-[#fde8e5] p-3 text-sm font-semibold text-[#8c2118]">{errors._}</p>}

      {/* basics */}
      <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10">
        <h3 className="text-lg">Basic details</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Common name *" error={errors.commonName}>
            <input
              className={inputCls}
              value={d.commonName}
              onChange={(e) => {
                set("commonName", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
              placeholder="e.g. Guppy"
              required
            />
          </Field>
          <Field label="Scientific name *" error={errors.scientificName} hint="Write TBC if you are not sure yet.">
            <input className={inputCls} value={d.scientificName} onChange={(e) => set("scientificName", e.target.value)} placeholder="e.g. Poecilia reticulata" required />
          </Field>
          <Field label="Page URL name *" error={errors.slug} hint={`Page address: /fish-collection/${d.slug || "..."}`}>
            <input
              className={inputCls}
              value={d.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field label="Category *" error={errors.category}>
            <select className={inputCls} value={d.category} onChange={(e) => set("category", e.target.value as CategoryId)}>
              {Object.entries(grouped).map(([group, cats]) => (
                <optgroup key={group} label={group}>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Availability *" error={errors.availability}>
            <select className={inputCls} value={d.availability} onChange={(e) => set("availability", e.target.value as Availability)}>
              {(Object.keys(availabilityLabel) as Availability[]).map((a) => (
                <option key={a} value={a}>
                  {availabilityLabel[a]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Natural range / origin" hint="Where the species naturally comes from.">
            <input className={inputCls} value={d.naturalRange} onChange={(e) => set("naturalRange", e.target.value)} placeholder="e.g. South America" />
          </Field>
        </div>
        <Field label="Description" hint="Shown on the fish page and when hovering the card.">
          <textarea className={`${inputCls} min-h-28`} value={d.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </section>

      {/* care */}
      <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10">
        <h3 className="text-lg">Size, water and feeding</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Adult size">
            <input className={inputCls} value={d.adultSize} onChange={(e) => set("adultSize", e.target.value)} placeholder="e.g. 4-6 cm" />
          </Field>
          <Field label="Water temperature">
            <input className={inputCls} value={d.temperature} onChange={(e) => set("temperature", e.target.value)} placeholder="e.g. 22-28 degC" />
          </Field>
          <Field label="pH range">
            <input className={inputCls} value={d.ph} onChange={(e) => set("ph", e.target.value)} placeholder="e.g. 6.8-7.8" />
          </Field>
          <Field label="Water hardness">
            <input className={inputCls} value={d.hardness} onChange={(e) => set("hardness", e.target.value)} placeholder="e.g. 8-12 dGH" />
          </Field>
          <Field label="Colour varieties">
            <input className={inputCls} value={d.colorVarieties} onChange={(e) => set("colorVarieties", e.target.value)} placeholder="e.g. Red, blue, albino" />
          </Field>
          <Field label="Feeding information">
            <input className={inputCls} value={d.feeding} onChange={(e) => set("feeding", e.target.value)} placeholder="e.g. Omnivore - flakes and pellets" />
          </Field>
        </div>
      </section>

      {/* images */}
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg">Photos</h3>
            <p className="text-sm text-slate-500">JPG, PNG or WebP, up to 6 MB each. The first photo is the main one. Use only photos you own or have a licence for.</p>
          </div>
          <label className={`btn-ghost cursor-pointer !py-2 text-sm ${uploading ? "pointer-events-none opacity-60" : ""}`}>
            {uploading ? "Uploading..." : "+ Upload photos"}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { void upload(e.target.files); e.target.value = ""; }} />
          </label>
        </div>
        {uploadMsg && <p className="text-sm font-semibold text-[#b3261e]">{uploadMsg}</p>}
        {errors.images && <p className="text-sm font-semibold text-[#b3261e]">{errors.images}</p>}
        {d.images.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No photos yet. The website will show a fish illustration marked &ldquo;Photo coming soon&rdquo;.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {d.images.map((url, i) => (
              <li key={url} className="overflow-hidden rounded-2xl ring-1 ring-navy/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Photo ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                <div className="flex items-center justify-between gap-1 bg-slate-50 px-2 py-1.5 text-xs font-semibold">
                  {i === 0 ? (
                    <span className="rounded-full bg-sun px-2 py-0.5 text-navy">Main</span>
                  ) : (
                    <button type="button" className="text-aqua-700 hover:underline" onClick={() => set("images", [url, ...d.images.filter((u) => u !== url)])}>
                      Make main
                    </button>
                  )}
                  <button type="button" className="text-[#b3261e] hover:underline" onClick={() => set("images", d.images.filter((u) => u !== url))}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* flags */}
      <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10">
        <h3 className="text-lg">Display options</h3>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[#00b4c6]" checked={d.featured} onChange={(e) => set("featured", e.target.checked)} />
          <span>
            <span className="block font-semibold">Featured on the home page</span>
            <span className="text-sm text-slate-500">Shows this fish in the home page carousel.</span>
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[#00b4c6]" checked={d.careVerified} onChange={(e) => set("careVerified", e.target.checked)} />
          <span>
            <span className="block font-semibold">Care and size details are confirmed</span>
            <span className="text-sm text-slate-500">Leave unticked to show a &ldquo;draft reference&rdquo; note on the fish page.</span>
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[#00b4c6]" checked={Boolean(d.exportCheckRequired)} onChange={(e) => set("exportCheckRequired", e.target.checked)} />
          <span>
            <span className="block font-semibold">Needs legal export check (native / endemic species)</span>
            <span className="text-sm text-slate-500">Shows a notice that export status is confirmed before shipment.</span>
          </span>
        </label>
        <Field label="Illustration colour (used when there is no photo)" error={errors.accent} className="max-w-xs">
          <span className="flex items-center gap-3">
            <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(d.accent) ? d.accent : "#00b4c6"} onChange={(e) => set("accent", e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1" />
            <input className={inputCls} value={d.accent} onChange={(e) => set("accent", e.target.value)} />
          </span>
        </Field>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-300 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" disabled={busy || uploading} className="btn-cta disabled:opacity-70">
            {busy ? "Saving..." : isNew ? "Add fish" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */
export function AdminApp({ initialAuthed, initialSpecies }: { initialAuthed: boolean; initialSpecies: Species[] }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [species, setSpecies] = useState<Species[]>(initialSpecies);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 4000);
  };

  async function loadList() {
    const res = await fetch("/api/admin/species");
    if (res.ok) setSpecies(((await res.json()) as { species: Species[] }).species);
  }

  function expired() {
    setEditing(null);
    setAuthed(false);
  }

  async function remove(s: Species) {
    if (!window.confirm(`Delete "${s.commonName}"? It will disappear from the website.`)) return;
    const res = await fetch(`/api/admin/species/${s.id}`, { method: "DELETE" });
    if (res.status === 401) return expired();
    if (res.ok) {
      setSpecies((p) => p.filter((x) => x.id !== s.id));
      flash(`Deleted ${s.commonName}.`);
    } else flash("Could not delete. Try again.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setSpecies([]);
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? species.filter((s) => `${s.commonName} ${s.scientificName} ${categoryLabel(s.category)}`.toLowerCase().includes(q)) : species;
  }, [species, query]);

  if (!authed) {
    return (
      <Login
        onDone={async () => {
          setAuthed(true);
          await loadList();
        }}
      />
    );
  }

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-slate-300 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <p className="text-lg font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
            Aquazone <span className="font-medium text-aqua-300">Admin</span>
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-1.5 hover:bg-white/10">
              View website &nearr;
            </a>
            <button type="button" onClick={logout} className="rounded-full border border-white/30 px-4 py-1.5 hover:bg-white/10">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {editing ? (
          <Editor
            key={editing.id ?? "new"}
            initial={editing}
            onCancel={() => setEditing(null)}
            onUnauthorized={expired}
            onSaved={(s, created) => {
              setSpecies((p) => (created ? [...p, s] : p.map((x) => (x.id === s.id ? s : x))));
              setEditing(null);
              flash(created ? `Added ${s.commonName}. It is live on the website.` : `Saved ${s.commonName}. Changes are live.`);
              window.scrollTo({ top: 0 });
            }}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl">Fish catalog</h1>
                <p className="text-slate-500">{species.length} fish on the website</p>
              </div>
              <button type="button" className="btn-cta" onClick={() => setEditing({ ...blank })}>
                + Add fish
              </button>
            </div>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category..."
              aria-label="Search fish"
              className={`${inputCls} mt-6 max-w-md`}
            />

            <ul className="mt-6 space-y-3">
              {shown.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-navy/10 sm:flex-nowrap">
                  {s.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.images[0]} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="grid h-16 w-24 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-400">No photo</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {s.commonName} {s.featured && <span className="ml-1 rounded-full bg-sun px-2 py-0.5 align-middle text-[0.65rem] font-bold uppercase">Featured</span>}
                    </p>
                    <p className="truncate text-sm italic text-slate-500">{s.scientificName}</p>
                    <p className="text-xs text-slate-500">
                      {categoryLabel(s.category)} &middot; {availabilityLabel[s.availability]} &middot; /fish-collection/{s.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => setEditing({ ...s })} className="rounded-full border-2 border-navy/20 px-4 py-1.5 text-sm font-semibold hover:border-aqua">
                      Edit
                    </button>
                    <button type="button" onClick={() => void remove(s)} className="rounded-full px-4 py-1.5 text-sm font-semibold text-[#b3261e] hover:bg-[#fde8e5]">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {shown.length === 0 && <li className="rounded-2xl bg-white p-8 text-center text-slate-500">No fish found.</li>}
            </ul>
          </>
        )}
      </main>

      {toast && (
        <p role="status" className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </p>
      )}
    </div>
  );
}
