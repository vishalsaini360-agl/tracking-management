import React from "react";
import { MOCK_EVENTS_BY_PRODUCT } from "./mockTrackerData";

// Helper to calculate SVG path for donut slice
const getDonutSlicePath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
  const rad = Math.PI / 180;
  const x1Outer = cx + rOuter * Math.cos(startAngle * rad);
  const y1Outer = cy + rOuter * Math.sin(startAngle * rad);
  const x2Outer = cx + rOuter * Math.cos(endAngle * rad);
  const y2Outer = cy + rOuter * Math.sin(endAngle * rad);

  const x1Inner = cx + rInner * Math.cos(endAngle * rad);
  const y1Inner = cy + rInner * Math.sin(endAngle * rad);
  const x2Inner = cx + rInner * Math.cos(startAngle * rad);
  const y2Inner = cy + rInner * Math.sin(startAngle * rad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${x1Outer} ${y1Outer}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
    `L ${x1Inner} ${y1Inner}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
    "Z",
  ].join(" ");
};

const ProductDonutChart = ({ data = MOCK_EVENTS_BY_PRODUCT }) => {
  const cx = 95;
  const cy = 95;
  const rOuter = 82;
  const rInner = 52;

  // Precomputed slice angles starting from top (-90 deg)
  let currentAngle = -90;
  const slices = data.segments.map((seg) => {
    const sweep = (seg.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    const midAngle = startAngle + sweep / 2;
    currentAngle = endAngle;

    // Label position inside slice
    const rLabel = (rOuter + rInner) / 2;
    const rad = Math.PI / 180;
    const labelX = cx + rLabel * Math.cos(midAngle * rad);
    const labelY = cy + rLabel * Math.sin(midAngle * rad);

    return {
      ...seg,
      path: getDonutSlicePath(cx, cy, rOuter, rInner, startAngle + 0.5, endAngle - 0.5),
      labelX,
      labelY,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-3">
        Events by Product
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
        {/* SVG Donut Chart */}
        <div className="relative w-48 h-48 shrink-0">
          <svg viewBox="0 0 190 190" className="w-full h-full transform transition-transform">
            {slices.map((slice) => (
              <path
                key={slice.id}
                d={slice.path}
                fill={slice.color}
                className="hover:opacity-90 transition-opacity cursor-pointer"
              />
            ))}

            {/* Percentage text labels right on the slices */}
            {slices.map((slice) => (
              <text
                key={`label-${slice.id}`}
                x={slice.labelX}
                y={slice.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#ffffff"
                className="text-[11px] font-bold select-none pointer-events-none drop-shadow-xs"
              >
                {slice.percentage}%
              </text>
            ))}

            {/* Center cutout */}
            <circle cx={cx} cy={cy} r={rInner - 2} fill="#ffffff" />

            {/* Center Label */}
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              className="text-base font-bold fill-gray-900 select-none"
            >
              {data.total.toLocaleString()}
            </text>
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              className="text-[10px] font-medium fill-gray-400 select-none"
            >
              Total Events
            </text>
          </svg>
        </div>

        {/* Legend list on the right */}
        <div className="space-y-3 w-full max-w-[210px]">
          {data.segments.map((seg) => (
            <div
              key={seg.id}
              className="flex items-center justify-between text-xs text-gray-700"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-medium truncate">{seg.label}</span>
              </div>
              <span className="font-semibold text-gray-900 pl-2 font-mono">
                {seg.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDonutChart;
