"use client";

import { useState } from "react";
import { NapkinCanvas } from "@/components/napkin-canvas";
import type { NapkinResult } from "@/lib/types";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NapkinResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(): Promise<void> {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore nella generazione");
      }

      const data: NapkinResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      generate();
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2c3e50] mb-2">
          AraNapkin
        </h1>
        <p className="text-lg text-[#95a5a6]">
          Visual Thinking Agent — metodo Dan Roam
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descrivi cosa vuoi visualizzare..."
          rows={4}
          className="w-full px-4 py-3 text-lg rounded border border-[#ddd] bg-white text-[#2c3e50] placeholder-[#bdc3c7] focus:outline-none focus:border-[#95a5a6] resize-vertical"
          disabled={loading}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-[#bdc3c7]">Cmd+Enter per generare</span>
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="px-6 py-2.5 text-lg rounded bg-[#2c3e50] text-white hover:bg-[#34495e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Disegno..." : "Genera"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full max-w-2xl mb-6 px-4 py-3 rounded bg-red-50 border border-red-200 text-[#c0392b] text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mb-8 text-center text-[#95a5a6] animate-pulse">
          <p className="text-lg">Analizzo il problema e disegno il tovagliolo...</p>
        </div>
      )}

      {/* Analysis badge */}
      {result && !loading && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 text-sm rounded-full bg-[#f0ece6] text-[#2c3e50] border border-[#e0dbd4]">
            W: {result.analysis.dominantW} — {result.analysis.diagramType}
          </span>
          {result.analysis.sqvid.map((s) => (
            <span
              key={s}
              className="px-3 py-1 text-sm rounded-full bg-[#f5f5f0] text-[#7f8c8d] border border-[#e8e5df]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Canvas */}
      {result && !loading && (
        <NapkinCanvas
          width={result.canvas.width}
          height={result.canvas.height}
          drawingCode={result.drawingCode}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-4 text-center text-sm text-[#bdc3c7]">
        Metodo "The Back of the Napkin" di Dan Roam — powered by Claude
      </footer>
    </main>
  );
}
