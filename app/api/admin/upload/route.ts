import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isAdmin } from "@/lib/adminAuth";
import { UPLOAD_DIR } from "@/lib/speciesStore";

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024;

/** Detect the real image type from magic bytes (never trust the file name or declared type). */
function sniff(buf: Buffer): { ext: string } | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg" };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png" };
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return { ext: "webp" };
  return null;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "No file received." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, message: "Image is larger than 6 MB." }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type) return NextResponse.json({ ok: false, message: "Only JPG, PNG or WebP images are allowed." }, { status: 415 });

  const name = `${Date.now().toString(36)}-${randomBytes(5).toString("hex")}.${type.ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
