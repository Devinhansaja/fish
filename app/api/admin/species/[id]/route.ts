import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/adminAuth";
import { deleteSpecies, updateSpecies } from "@/lib/speciesStore";

export const runtime = "nodejs";

const unauthorized = () => NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  const r = await updateSpecies(id, body);
  if (!r.ok) return NextResponse.json({ ok: false, errors: r.errors }, { status: r.status });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, species: r.value });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const ok = await deleteSpecies(id);
  if (!ok) return NextResponse.json({ ok: false, message: "Fish not found." }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
