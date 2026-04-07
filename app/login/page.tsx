"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login fallito");
      }
    } catch {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div
        className="w-full max-w-sm bg-white rounded p-8"
        style={{
          boxShadow: "2px 5px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e8e5df",
        }}
      >
        <h1 className="text-3xl font-bold text-[#2c3e50] text-center mb-1">
          AraNapkin
        </h1>
        <p className="text-sm text-[#95a5a6] text-center mb-6">
          Visual Thinking Agent
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2.5 text-base rounded border border-[#ddd] bg-white text-[#2c3e50] placeholder-[#bdc3c7] focus:outline-none focus:border-[#95a5a6]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-3 py-2.5 text-base rounded border border-[#ddd] bg-white text-[#2c3e50] placeholder-[#bdc3c7] focus:outline-none focus:border-[#95a5a6]"
          />

          {error && (
            <p className="text-sm text-[#c0392b] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-lg rounded bg-[#2c3e50] text-white hover:bg-[#34495e] disabled:opacity-40 transition-colors cursor-pointer"
          >
            {loading ? "..." : "Entra"}
          </button>
        </form>
      </div>
    </main>
  );
}
