import { cookies } from "next/headers";

export async function POST(req: Request): Promise<Response> {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };

  if (
    email === process.env.AUTH_EMAIL &&
    password === process.env.AUTH_PASSWORD
  ) {
    const cookieStore = await cookies();
    cookieStore.set("aranapkin-session", process.env.AUTH_SESSION_TOKEN!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return Response.json({ ok: true });
  }

  return Response.json(
    { error: "Credenziali non valide" },
    { status: 401 }
  );
}
