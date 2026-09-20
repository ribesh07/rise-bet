'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface ChartLineSeries {
  key: string;
  label?: string;
  stroke: string;
  strokeWidth?: number;
  dot?: boolean;
}

export interface ChartLineProps {
  data: Record<string, any>[];
  xKey: string;
  series: ChartLineSeries[];
  height?: number;
  className?: string;
  showGrid?: boolean;
  gridColor?: string;
}

function GoldTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-gold/30 bg-surface/95 backdrop-blur-lg px-4 py-3 shadow-gold-lg">
      <p className="text-xs text-muted mb-2 font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-white/80">{p.name ?? p.dataKey}:</span>
          <span className="font-semibold text-white ml-auto">
            {typeof p.value === 'number' && p.value > 1000
              ? '$' + p.value.toLocaleString()
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartLine({
  data,
  xKey,
  series,
  height = 300,
  className,
  showGrid = true,
  gridColor = 'rgba(42,53,72,0.5)',
}: ChartLineProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          )}
          <XAxis
            dataKey={xKey}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(42,53,72,0.5)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v
            }
          />
          <Tooltip content={<GoldTooltip />} cursor={{ stroke: 'rgba(212,175,55,0.25)', strokeWidth: 1 }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.stroke}
              strokeWidth={s.strokeWidth ?? 2.5}
              dot={s.dot ?? false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface ChartBarSeries {
  key: string;
  label?: string;
  fill: string;
  radius?: number | [number, number, number, number];
}

export interface ChartBarProps {
  data: Record<string, any>[];
  xKey: string;
  series: ChartBarSeries[];
  height?: number;
  className?: string;
  showGrid?: boolean;
  gridColor?: string;
  layout?: 'vertical' | 'horizontal';
}

export function ChartBar({
  data,
  xKey,
  series,
  height = 300,
  className,
  showGrid = true,
  gridColor = 'rgba(42,53,72,0.5)',
  layout = 'horizontal',
}: ChartBarProps) {
  const defsId = 'bar-gold-grad-' + Math.random().toString(36).slice(2, 8);
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout={layout}>
          <defs>
            <linearGradient id={defsId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD700" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          )}
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey={xKey}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(42,53,72,0.5)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(42,53,72,0.5)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
            </>
          )}
          <Tooltip content={<GoldTooltip />} cursor={{ fill: 'rgba(212,175,55,0.08)' }} />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.fill.startsWith('url') ? s.fill : (s.fill.includes('gold') ? `url(#${defsId})` : s.fill)}
              radius={s.radius ?? [6, 6, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
