import rough from "roughjs";
import type { RoughSVG } from "roughjs/bin/svg";

interface DrawOpts {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillStyle?: string;
  fillWeight?: number;
  hachureGap?: number;
  roughness?: number;
}

export function createDrawingHelpers(svgElement: SVGSVGElement) {
  const rc: RoughSVG = rough.svg(svgElement);
  const pen: DrawOpts = {
    stroke: "#2c3e50",
    strokeWidth: 1.5,
    roughness: 1.5,
  };

  function addSvg(node: SVGElement): void {
    svgElement.appendChild(node);
  }

  // ── Text ──────────────────────────────────

  function text(
    x: number,
    y: number,
    content: string,
    size = 15,
    anchor = "middle",
    bold = false,
    color = "#2c3e50"
  ): void {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", String(x));
    t.setAttribute("y", String(y));
    t.setAttribute("text-anchor", anchor);
    t.setAttribute("font-size", size + "px");
    t.setAttribute("fill", color);
    t.setAttribute("font-family", "'Patrick Hand', cursive");
    if (bold) t.setAttribute("font-weight", "bold");
    t.textContent = content;
    addSvg(t);
  }

  // ── People & Faces ────────────────────────

  function stick(cx: number, cy: number): void {
    addSvg(rc.circle(cx, cy - 22, 16, pen));
    addSvg(rc.line(cx, cy - 14, cx, cy + 5, pen));
    addSvg(rc.line(cx - 11, cy - 6, cx + 11, cy - 6, pen));
    addSvg(rc.line(cx, cy + 5, cx - 9, cy + 18, pen));
    addSvg(rc.line(cx, cy + 5, cx + 9, cy + 18, pen));
  }

  function face(
    cx: number,
    cy: number,
    d: number,
    emotion: "happy" | "sad" | "neutral" = "neutral"
  ): void {
    addSvg(rc.circle(cx, cy, d, pen));
    const r = d / 2;
    addSvg(
      rc.circle(cx - r * 0.35, cy - r * 0.2, 3, {
        ...pen,
        fill: "#2c3e50",
        fillStyle: "solid",
      })
    );
    addSvg(
      rc.circle(cx + r * 0.35, cy - r * 0.2, 3, {
        ...pen,
        fill: "#2c3e50",
        fillStyle: "solid",
      })
    );
    const my = cy + r * 0.25;
    const mw = r * 0.4;
    if (emotion === "happy") {
      addSvg(
        rc.path(
          `M ${cx - mw} ${my} Q ${cx} ${my + r * 0.35}, ${cx + mw} ${my}`,
          pen
        )
      );
    } else if (emotion === "sad") {
      addSvg(
        rc.path(
          `M ${cx - mw} ${my + r * 0.2} Q ${cx} ${my - r * 0.15}, ${cx + mw} ${my + r * 0.2}`,
          pen
        )
      );
    } else {
      addSvg(rc.line(cx - mw, my + r * 0.05, cx + mw, my + r * 0.05, pen));
    }
  }

  // ── Shapes ────────────────────────────────

  function box(
    cx: number,
    cy: number,
    w: number,
    h: number,
    label?: string,
    fill?: string,
    fillStyle?: string
  ): void {
    const opts: DrawOpts = { ...pen };
    if (fill) {
      opts.fill = fill;
      opts.fillStyle = fillStyle || "hachure";
      opts.fillWeight = 0.4;
      opts.hachureGap = 6;
    }
    addSvg(rc.rectangle(cx - w / 2, cy - h / 2, w, h, opts));
    if (label) text(cx, cy + 5, label, 13);
  }

  function circle(
    cx: number,
    cy: number,
    d: number,
    label?: string,
    fill?: string,
    fillStyle?: string
  ): void {
    const opts: DrawOpts = { ...pen };
    if (fill) {
      opts.fill = fill;
      opts.fillStyle = fillStyle || "hachure";
      opts.fillWeight = 0.4;
      opts.hachureGap = 6;
    }
    addSvg(rc.circle(cx, cy, d, opts));
    if (label) text(cx, cy + 5, label, 14, "middle", true);
  }

  function diamond(cx: number, cy: number, s: number, label?: string): void {
    addSvg(
      rc.path(
        `M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`,
        pen
      )
    );
    if (label) text(cx, cy + 4, label, 12, "middle", true);
  }

  // ── Connections ───────────────────────────

  function arr(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string
  ): void {
    const p: DrawOpts = color ? { ...pen, stroke: color } : pen;
    addSvg(rc.line(x1, y1, x2, y2, p));
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = 9;
    addSvg(
      rc.line(
        x2,
        y2,
        x2 - h * Math.cos(a - 0.4),
        y2 - h * Math.sin(a - 0.4),
        p
      )
    );
    addSvg(
      rc.line(
        x2,
        y2,
        x2 - h * Math.cos(a + 0.4),
        y2 - h * Math.sin(a + 0.4),
        p
      )
    );
  }

  function bigArr(x1: number, y: number, x2: number): void {
    const thick = { ...pen, strokeWidth: 2.5 };
    addSvg(rc.line(x1, y, x2, y, thick));
    addSvg(rc.line(x2, y, x2 - 14, y - 9, thick));
    addSvg(rc.line(x2, y, x2 - 14, y + 9, thick));
  }

  function loopBack(
    fromX: number,
    toX: number,
    y: number,
    height: number,
    color = "#c0392b"
  ): void {
    const lp = { ...pen, stroke: color };
    addSvg(
      rc.path(
        `M ${fromX} ${y - 18} C ${fromX} ${y - height}, ${toX} ${y - height}, ${toX} ${y - 18}`,
        lp
      )
    );
    addSvg(rc.line(toX, y - 18, toX + 5, y - 26, lp));
    addSvg(rc.line(toX, y - 18, toX - 5, y - 26, lp));
  }

  // ── Compound Diagrams ─────────────────────

  function barChart(
    ox: number,
    oy: number,
    width: number,
    height: number,
    bars: Array<{ h: number; label: string; highlight?: boolean }>
  ): void {
    addSvg(rc.line(ox, oy, ox, oy - height, pen));
    addSvg(rc.line(ox, oy, ox + width, oy, pen));
    const barW = Math.min(35, width / (bars.length * 1.8));
    const gap = (width - barW * bars.length) / (bars.length + 1);
    const maxH = Math.max(...bars.map((b) => b.h));
    bars.forEach((b, i) => {
      const bx = ox + gap + i * (barW + gap);
      const bh = (b.h / maxH) * (height - 10);
      const opts: DrawOpts = b.highlight
        ? {
            ...pen,
            fill: "#dfe6e9",
            fillStyle: "hachure",
            fillWeight: 0.5,
            hachureGap: 5,
          }
        : pen;
      addSvg(rc.rectangle(bx, oy - bh, barW, bh, opts));
      text(bx + barW / 2, oy + 15, b.label, 11);
    });
  }

  function timelineDiagram(
    tx: number,
    ty: number,
    width: number,
    events: Array<{ x: number; label: string; above?: boolean }>
  ): void {
    arr(tx, ty, tx + width, ty);
    events.forEach((e) => {
      const ex = tx + e.x;
      addSvg(
        rc.circle(ex, ty, 10, {
          ...pen,
          fill: "#2c3e50",
          fillStyle: "solid",
        })
      );
      const offset = e.above !== false ? -20 : 25;
      addSvg(rc.line(ex, ty, ex, ty + (e.above !== false ? -12 : 12), pen));
      text(ex, ty + offset, e.label, 12);
    });
  }

  function vennDiagram(
    cx: number,
    cy: number,
    radius: number,
    sets: Array<{ label: string; offsetX: number }>
  ): void {
    sets.forEach((s) => {
      addSvg(
        rc.circle(cx + s.offsetX, cy, radius * 2, {
          ...pen,
          fill: "#f5f5f0",
          fillStyle: "hachure",
          fillWeight: 0.2,
          hachureGap: 9,
        })
      );
      text(cx + s.offsetX, cy + 4, s.label, 13, "middle", true);
    });
  }

  function quadrant(
    cx: number,
    cy: number,
    size: number,
    xLabel: string,
    yLabel: string,
    items: Array<{
      qx: number;
      qy: number;
      label: string;
      filled?: boolean;
    }>
  ): void {
    arr(cx - size, cy, cx + size + 10, cy);
    arr(cx, cy + size, cx, cy - size - 10);
    text(cx + size + 15, cy + 4, xLabel, 11, "start");
    text(cx + 5, cy - size - 14, yLabel, 11, "start");
    items.forEach((item) => {
      addSvg(
        rc.circle(cx + item.qx, cy - item.qy, 14, {
          ...pen,
          ...(item.filled
            ? { fill: "#2c3e50", fillStyle: "solid" }
            : {}),
        })
      );
      text(cx + item.qx + 12, cy - item.qy + 4, item.label, 11, "start");
    });
  }

  // ── Decorative ────────────────────────────

  function panel(x: number, y: number, w: number, h: number): void {
    addSvg(
      rc.rectangle(x, y, w, h, {
        ...pen,
        strokeWidth: 0.8,
        roughness: 2,
        stroke: "#bdc3c7",
      })
    );
  }

  function dashedLine(y: number, fromX = 20, toX = 920): void {
    for (let x = fromX; x < toX; x += 18) {
      addSvg(rc.line(x, y, x + 9, y, { ...pen, strokeWidth: 0.6 }));
    }
  }

  function paperStack(
    cx: number,
    cy: number,
    w = 70,
    h = 40,
    label?: string
  ): void {
    const x = cx - w / 2;
    const y = cy - h / 2;
    addSvg(rc.rectangle(x + 6, y - 4, w, h, { ...pen, stroke: "#aaa", strokeWidth: 1 }));
    addSvg(rc.rectangle(x + 3, y - 2, w, h, { ...pen, stroke: "#bbb", strokeWidth: 1 }));
    addSvg(rc.rectangle(x, y, w, h, pen));
    if (label) text(cx, cy + h / 2 + 15, label, 11);
  }

  function gridBox(
    cx: number,
    cy: number,
    w = 60,
    h = 42,
    label?: string
  ): void {
    const x = cx - w / 2;
    const y = cy - h / 2;
    addSvg(rc.rectangle(x, y, w, h, pen));
    addSvg(rc.line(x + w / 3, y, x + w / 3, y + h, { ...pen, strokeWidth: 0.7 }));
    addSvg(rc.line(x + (2 * w) / 3, y, x + (2 * w) / 3, y + h, { ...pen, strokeWidth: 0.7 }));
    addSvg(rc.line(x, y + h / 3, x + w, y + h / 3, { ...pen, strokeWidth: 0.7 }));
    addSvg(rc.line(x, y + (2 * h) / 3, x + w, y + (2 * h) / 3, { ...pen, strokeWidth: 0.7 }));
    if (label) text(cx, cy + h / 2 + 15, label, 11);
  }

  function monitorIcon(
    cx: number,
    cy: number,
    w = 65,
    h = 38,
    label?: string
  ): void {
    const x = cx - w / 2;
    const y = cy - h / 2;
    addSvg(rc.rectangle(x, y, w, h, pen));
    addSvg(rc.line(cx, y + h, cx, y + h + 10, pen));
    addSvg(rc.line(cx - 15, y + h + 10, cx + 15, y + h + 10, pen));
    addSvg(
      rc.path(
        `M ${x + 8} ${cy} L ${x + 18} ${cy - 8} L ${x + 28} ${cy + 4} L ${x + 40} ${cy - 10} L ${x + w - 8} ${cy - 2}`,
        { ...pen, strokeWidth: 1, stroke: "#27ae60" }
      )
    );
    if (label) text(cx, y + h + 25, label, 11);
  }

  function crossMark(cx: number, cy: number): void {
    const s = 6;
    addSvg(rc.line(cx - s, cy - s, cx + s, cy + s, { ...pen, stroke: "#c0392b", strokeWidth: 1.2 }));
    addSvg(rc.line(cx + s, cy - s, cx - s, cy + s, { ...pen, stroke: "#c0392b", strokeWidth: 1.2 }));
  }

  function checkMark(cx: number, cy: number, color = "#27ae60"): void {
    addSvg(
      rc.path(`M ${cx - 6} ${cy} L ${cx - 1} ${cy + 6} L ${cx + 8} ${cy - 5}`, {
        ...pen,
        stroke: color,
        strokeWidth: 2,
      })
    );
  }

  function speechBubble(
    cx: number,
    cy: number,
    w: number,
    content: string
  ): void {
    const h = 24;
    addSvg(
      rc.rectangle(cx - w / 2, cy, w, h, {
        ...pen,
        strokeWidth: 0.8,
        roughness: 2,
      })
    );
    addSvg(rc.line(cx - 3, cy, cx - 8, cy - 7, { ...pen, strokeWidth: 0.8 }));
    addSvg(rc.line(cx + 3, cy, cx - 8, cy - 7, { ...pen, strokeWidth: 0.8 }));
    text(cx, cy + 17, content, 11);
  }

  // ── Low-Level ─────────────────────────────

  const draw = {
    rect: (x: number, y: number, w: number, h: number, opts?: DrawOpts) =>
      addSvg(rc.rectangle(x, y, w, h, { ...pen, ...opts })),
    circle: (cx: number, cy: number, d: number, opts?: DrawOpts) =>
      addSvg(rc.circle(cx, cy, d, { ...pen, ...opts })),
    line: (x1: number, y1: number, x2: number, y2: number, opts?: DrawOpts) =>
      addSvg(rc.line(x1, y1, x2, y2, { ...pen, ...opts })),
    path: (d: string, opts?: DrawOpts) =>
      addSvg(rc.path(d, { ...pen, ...opts })),
  };

  return {
    text,
    stick,
    face,
    box,
    circle,
    diamond,
    arr,
    bigArr,
    loopBack,
    barChart,
    timelineDiagram,
    vennDiagram,
    quadrant,
    panel,
    dashedLine,
    paperStack,
    gridBox,
    monitorIcon,
    crossMark,
    checkMark,
    speechBubble,
    draw,
  };
}

export type DrawingHelpers = ReturnType<typeof createDrawingHelpers>;
