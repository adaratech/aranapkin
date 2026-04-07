import { cookies } from "next/headers";

export async function POST(): Promise<Response> {
  const cookieStore = await cookies();
  cookieStore.delete("aranapkin-session");
  return Response.json({ ok: true });
}
