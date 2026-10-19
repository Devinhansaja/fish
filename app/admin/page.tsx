import { AdminApp } from "@/components/admin/AdminApp";
import { isAdmin } from "@/lib/adminAuth";
import { readSpecies } from "@/lib/speciesStore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();
  const species = authed ? await readSpecies() : [];
  return <AdminApp initialAuthed={authed} initialSpecies={species} />;
}
