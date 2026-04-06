"use client";

import { useEffect, useRef, useCallback } from "react";
import { createDrawingHelpers } from "@/lib/drawing-helpers";

interface NapkinCanvasProps {
  width: number;
  height: number;
  drawingCode: string;
}

export function NapkinCanvas({ width, height, drawingCode }: NapkinCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const render = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || !drawingCode) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const helpers = createDrawingHelpers(svg);

    const helperNames = Object.keys(helpers);
    const helperValues = Object.values(helpers);

    try {
      const fn = new Function(...helperNames, drawingCode);
      fn(...helperValues);
    } catch (err) {
      console.error("Drawing code execution error:", err);
      helpers.text(
        width / 2,
        height / 2,
        "Errore nel rendering del diagramma",
        16,
        "middle",
        true,
        "#c0392b"
      );
    }
  }, [drawingCode, width, height]);

  useEffect(() => {
    render();
  }, [render]);

  function handleDownload(): void {
    const svg = svgRef.current;
    if (!svg) return;

    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const styleEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style"
    );
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');
      text { font-family: 'Patrick Hand', cursive; }
    `;
    clone.insertBefore(styleEl, clone.firstChild);

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(clone);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "napkin.svg";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="bg-white rounded p-6 md:p-8"
        style={{
          boxShadow: "2px 5px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e8e5df",
          maxWidth: "95vw",
          overflowX: "auto",
        }}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 text-sm rounded border border-[#bdc3c7] text-[#2c3e50] hover:bg-[#f0ece6] transition-colors cursor-pointer"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        Scarica SVG
      </button>
    </div>
  );
}
