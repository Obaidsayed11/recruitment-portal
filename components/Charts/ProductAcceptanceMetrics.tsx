"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Driver", desktop: 186 },
  { month: "Driver", desktop: 305 },
  { month: "Driver", desktop: 237 },
  { month: "Driver", desktop: 73 },
  { month: "Driver 3", desktop: 209 },
  { month: "Driver 2", desktop: 209 },
  { month: "Driver 1", desktop: 214 },
];

const chartConfig = {
  deliveries: {
    label: "Deriver",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProductAcceptanceMetrics() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-none bg-white gap-2">
      <CardHeader>
        <CardTitle className="text-text font-medium text-lg">
          Number of Deliveries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="bg-secondary max-h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              barSize={20}
              dataKey="desktop"
              fill="var(--color-primary)"
              radius={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
