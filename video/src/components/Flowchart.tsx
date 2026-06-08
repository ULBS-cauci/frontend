import { interpolate } from "remotion";
import { brand } from "../brand";

/**
 * Self-drawing Mermaid-style flowchart (binary search). Shared by the vertical
 * composition. Nodes spring in, edges reveal via stroke-dashoffset.
 */
const NODE = brand.violet;
const SUCCESS = "#34d399";

const Node: React.FC<{
  frame: number; at: number; x: number; y: number; w: number; h: number;
  label: string; diamond?: boolean; accent?: string;
}> = ({ frame, at, x, y, w, h, label, diamond, accent }) => {
  const t = Math.max(0, Math.min(1, (frame - at) / 12));
  const eased = 1 - Math.pow(1 - t, 3);
  const scale = 0.7 + eased * 0.3;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const stroke = accent ?? NODE;
  return (
    <g opacity={eased} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      {diamond ? (
        <polygon points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`} fill="rgba(124,106,247,0.12)" stroke={stroke} strokeWidth={2.5} />
      ) : (
        <rect x={x} y={y} width={w} height={h} rx={14} fill="rgba(255,255,255,0.05)" stroke={stroke} strokeWidth={2.5} />
      )}
      <text x={cx} y={cy + 7} textAnchor="middle" fill={brand.text} fontSize={21} fontFamily={brand.fontFamily} fontWeight={500}>
        {label}
      </text>
    </g>
  );
};

const Edge: React.FC<{ frame: number; at: number; d: string; label?: string; lx?: number; ly?: number }> = ({ frame, at, d, label, lx, ly }) => {
  const draw = interpolate(frame, [at, at + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [at + 6, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(167,139,250,0.85)" strokeWidth={2.2} pathLength={1} strokeDasharray={1} strokeDashoffset={draw} markerEnd="url(#fc-arrow)" />
      {label && (
        <g opacity={labelOpacity}>
          <rect x={(lx ?? 0) - 18} y={(ly ?? 0) - 16} width={36} height={26} rx={6} fill="#15131c" stroke="rgba(124,106,247,0.3)" strokeWidth={1} />
          <text x={lx} y={(ly ?? 0) + 2} textAnchor="middle" fill={brand.textMuted} fontSize={15} fontFamily={brand.fontFamily}>{label}</text>
        </g>
      )}
    </g>
  );
};

export const Flowchart: React.FC<{ frame: number; drawStart: number }> = ({ frame, drawStart }) => {
  const s = drawStart;
  return (
    <svg viewBox="0 0 1040 600" width="100%" style={{ display: "block" }}>
      <defs>
        <marker id="fc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="rgba(167,139,250,0.9)" />
        </marker>
      </defs>
      <Edge frame={frame} at={s + 12} d="M520,74 L520,104" />
      <Edge frame={frame} at={s + 24} d="M520,164 L520,196" />
      <Edge frame={frame} at={s + 40} d="M610,250 L800,250" />
      <Edge frame={frame} at={s + 40} d="M520,300 L520,352" />
      <Edge frame={frame} at={s + 56} d="M430,410 L300,410 L300,452" />
      <Edge frame={frame} at={s + 56} d="M610,410 L740,410 L740,452" />
      <Edge frame={frame} at={s + 72} d="M120,478 C40,478 40,140 410,140" />
      <Node frame={frame} at={s} x={430} y={22} w={180} h={52} label="Start" />
      <Node frame={frame} at={s + 12} x={410} y={108} w={220} h={56} label="Pick middle" />
      <Node frame={frame} at={s + 24} x={420} y={200} w={200} h={100} label="target == mid?" diamond />
      <Node frame={frame} at={s + 36} x={800} y={224} w={200} h={52} label="Return index" accent={SUCCESS} />
      <Node frame={frame} at={s + 40} x={420} y={360} w={200} h={100} label="target < mid?" diamond />
      <Node frame={frame} at={s + 56} x={200} y={452} w={200} h={52} label="Search left" />
      <Node frame={frame} at={s + 56} x={640} y={452} w={200} h={52} label="Search right" />
    </svg>
  );
};
