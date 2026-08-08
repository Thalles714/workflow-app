"use client";

import { createNoise2D } from "simplex-noise";
import { useEffect, useRef, type CSSProperties } from "react";

interface Point {
  cursor: { vx: number; vy: number; x: number; y: number };
  wave: { x: number; y: number };
  x: number;
  y: number;
}

interface WavesProps {
  backgroundColor?: string;
  className?: string;
  pointerSize?: number;
  strokeColor?: string;
}

export function Waves({
  backgroundColor = "#070708",
  className = "",
  pointerSize = 0.42,
  strokeColor = "#343438",
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const linesRef = useRef<Point[][]>([]);
  const noiseRef = useRef<ReturnType<typeof createNoise2D> | null>(null);
  const rafRef = useRef<number | null>(null);
  const boundingRef = useRef<DOMRect | null>(null);
  const reducedMotionRef = useRef(false);
  const mouseRef = useRef({
    a: 0,
    lx: 0,
    ly: 0,
    set: false,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    x: -10,
    y: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;
    const containerElement = container;
    const svgElement = svg;

    noiseRef.current = createNoise2D();
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function setSize() {
      boundingRef.current = containerElement.getBoundingClientRect();
      svgElement.style.width = `${boundingRef.current.width}px`;
      svgElement.style.height = `${boundingRef.current.height}px`;
    }

    function moved(point: Point, withCursorForce = true) {
      return {
        x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
      };
    }

    function drawLines() {
      linesRef.current.forEach((points, lineIndex) => {
        const path = pathsRef.current[lineIndex];
        if (points.length < 2 || !path) return;
        const first = moved(points[0]!, false);
        let data = `M ${first.x} ${first.y}`;
        for (let index = 1; index < points.length; index += 1) {
          const current = moved(points[index]!);
          data += `L ${current.x} ${current.y}`;
        }
        path.setAttribute("d", data);
      });
    }

    function movePoints(time: number) {
      const noise = noiseRef.current;
      if (!noise) return;
      const mouse = mouseRef.current;
      for (const points of linesRef.current) {
        for (const point of points) {
          const move =
            noise((point.x + time * 0.008) * 0.003, (point.y + time * 0.003) * 0.002) * 8;
          point.wave.x = Math.cos(move) * 12;
          point.wave.y = Math.sin(move) * 6;
          const dx = point.x - mouse.sx;
          const dy = point.y - mouse.sy;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(175, mouse.vs);
          if (!reducedMotionRef.current && distance < influence) {
            const strength = 1 - distance / influence;
            const force = Math.cos(distance * 0.001) * strength;
            point.cursor.vx += Math.cos(mouse.a) * force * influence * mouse.vs * 0.00035;
            point.cursor.vy += Math.sin(mouse.a) * force * influence * mouse.vs * 0.00035;
          }
          point.cursor.vx = (point.cursor.vx - point.cursor.x * 0.01) * 0.95;
          point.cursor.vy = (point.cursor.vy - point.cursor.y * 0.01) * 0.95;
          point.cursor.x = Math.min(50, Math.max(-50, point.cursor.x + point.cursor.vx));
          point.cursor.y = Math.min(50, Math.max(-50, point.cursor.y + point.cursor.vy));
        }
      }
    }

    function setLines() {
      if (!boundingRef.current) return;
      pathsRef.current.forEach((path) => path.remove());
      pathsRef.current = [];
      linesRef.current = [];
      const { height, width } = boundingRef.current;
      const xGap = 11;
      const yGap = 10;
      const totalLines = Math.ceil((width + 180) / xGap);
      const totalPoints = Math.ceil((height + 40) / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;
      for (let column = 0; column < totalLines; column += 1) {
        const points: Point[] = [];
        for (let row = 0; row < totalPoints; row += 1) {
          points.push({
            cursor: { vx: 0, vy: 0, x: 0, y: 0 },
            wave: { x: 0, y: 0 },
            x: xStart + xGap * column,
            y: yStart + yGap * row,
          });
        }
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", strokeColor);
        path.setAttribute("stroke-width", "1");
        svgElement.appendChild(path);
        pathsRef.current.push(path);
        linesRef.current.push(points);
      }
      movePoints(0);
      drawLines();
    }

    function updatePointer(x: number, y: number) {
      if (!boundingRef.current) return;
      const mouse = mouseRef.current;
      mouse.x = x - boundingRef.current.left;
      mouse.y = y - boundingRef.current.top;
      if (!mouse.set) {
        mouse.sx = mouse.lx = mouse.x;
        mouse.sy = mouse.ly = mouse.y;
        mouse.set = true;
      }
    }

    function onMouseMove(event: MouseEvent) {
      updatePointer(event.clientX, event.clientY);
    }
    function onTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    }
    function onResize() {
      setSize();
      setLines();
    }
    function tick(time: number) {
      const mouse = mouseRef.current;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const distance = Math.hypot(dx, dy);
      mouse.v = distance;
      mouse.vs = Math.min(100, mouse.vs + (distance - mouse.vs) * 0.1);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);
      containerElement.style.setProperty("--wave-x", `${mouse.sx}px`);
      containerElement.style.setProperty("--wave-y", `${mouse.sy}px`);
      movePoints(time);
      drawLines();
      rafRef.current = requestAnimationFrame(tick);
    }

    setSize();
    setLines();
    window.addEventListener("resize", onResize);
    if (!reducedMotionRef.current) {
      window.addEventListener("mousemove", onMouseMove);
      containerElement.addEventListener("touchmove", onTouchMove, { passive: true });
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      containerElement.removeEventListener("touchmove", onTouchMove);
      pathsRef.current.forEach((path) => path.remove());
      pathsRef.current = [];
      linesRef.current = [];
    };
  }, [strokeColor]);

  return (
    <div
      aria-hidden="true"
      className={`waves-component ${className}`}
      ref={containerRef}
      style={
        {
          "--wave-x": "50%",
          "--wave-y": "50%",
          backgroundColor,
        } as CSSProperties
      }
    >
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" />
      <i
        className="waves-pointer"
        style={{ height: `${pointerSize}rem`, width: `${pointerSize}rem` }}
      />
    </div>
  );
}
