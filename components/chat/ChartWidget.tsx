"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartConfig {
  type: "bar" | "line" | "pie";
  data: Record<string, unknown>[];
  xKey?: string;
  yKey?: string;
  title?: string;
  valueKey?: string; // for pie charts
  nameKey?: string;  // for pie charts
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

const formatValue = (v: number) => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return v.toLocaleString("en-IN");
};

interface ChartWidgetProps {
  config: ChartConfig;
}

export function ChartWidget({ config }: ChartWidgetProps) {
  const { type, data, xKey = "name", yKey = "value", title, valueKey, nameKey } = config;

  if (!data || data.length === 0) return null;

  return (
    <div className="my-3 bg-white border rounded-xl p-4 shadow-sm">
      {title && <p className="text-sm font-medium text-slate-700 mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={240}>
        {type === "bar" ? (
          <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatValue} tick={{ fontSize: 11 }} width={70} />
            <Tooltip formatter={(v) => (typeof v === "number" ? formatValue(v) : String(v))} />
            <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === "line" ? (
          <LineChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatValue} tick={{ fontSize: 11 }} width={70} />
            <Tooltip formatter={(v) => (typeof v === "number" ? formatValue(v) : String(v))} />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey ?? yKey}
              nameKey={nameKey ?? xKey}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => (typeof v === "number" ? formatValue(v) : String(v))} />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export function parseChartBlocks(content: string): Array<{ type: "text" | "chart"; value: string | ChartConfig }> {
  const parts: Array<{ type: "text" | "chart"; value: string | ChartConfig }> = [];
  const regex = /:::chart\n([\s\S]*?)\n:::/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    try {
      const config = JSON.parse(match[1]) as ChartConfig;
      parts.push({ type: "chart", value: config });
    } catch {
      parts.push({ type: "text", value: match[0] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}
