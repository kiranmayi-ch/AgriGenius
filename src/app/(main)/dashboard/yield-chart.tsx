
"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", yield: 0 },
  { month: "February", yield: 0 },
  { month: "March", yield: 0 },
  { month: "April", yield: 0 },
  { month: "May", yield: 0 },
  { month: "June", yield: 0 },
];

const chartConfig = {
  yield: {
    label: "Yield (kg)",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function YieldChart() {
  const hasData = chartData.some(d => d.yield > 0);
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={350}>
        {hasData ? (
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="yield" fill="var(--color-yield)" radius={4} />
          </BarChart>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No yield data available.
          </div>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  )
}

    