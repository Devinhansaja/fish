import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/adminAuth";
import { createSpecies, readSpecies } from "@/lib/speciesStore";

export const runtime = "nodejs";

const unauthorized = () => NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json({ ok: true, species: await readSpecies() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  const r = await createSpecies(body);
  if (!r.ok) return NextResponse.json({ ok: false, errors: r.errors }, { status: r.status });
  revalidatePath("/", "layout"); // refresh the public site
  return NextResponse.json({ ok: true, species: r.value }, { status: 201 });
}
