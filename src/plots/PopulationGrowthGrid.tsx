import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";

type PopulationGrowth = {
  year: number;
  population: number;
  growth_rate: number | null;
};

type WorldPopulation = {
  data: { [key: string]: number } | null;
};

export default function PopulationGrowthGrid({ data }: WorldPopulation) {
  const chartRef = useRef<echarts.ECharts>();
  const [populationGrowthRate, setPopulationGrowthRate] = useState<
    PopulationGrowth[]
  >([]);

  useEffect(() => {
    if (data) {
      const response = provideGrowthRate(data);
      setPopulationGrowthRate(response);
    }
  }, [data]);

  useEffect(() => {
    if (populationGrowthRate.length > 0) {
      const chart = generatePlot(populationGrowthRate);
      chartRef.current = chart;

      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.dispose();
      };
    }
  }, [populationGrowthRate]);

  return (
    <div className="space-y-8">
      <div className="h-[400px]">
        <div id="population-growth-chart" className="w-full h-full"></div>
      </div>

      <div className="flex justify-center items-center gap-x-6 gap-y-2 flex-wrap text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#b7e34f" }}
          ></div>
          <span>Low Growth (&lt;1%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#e3c14f" }}
          ></div>
          <span>Moderate Growth (1-2%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#e34f4f" }}
          ></div>
          <span>High Growth (&gt;2%)</span>
        </div>
      </div>

      <div className="border-l-2 border-accent pl-4">
        <h4 className="font-display text-xl mb-3">Key Observations</h4>
        <ul className="font-serif text-muted-foreground space-y-3">
          <li>
            The highest growth rates occurred during the early 1960s to 1970,
            peaking at 2.13% in 1963.
          </li>
          <li>
            After the 1960s, the population growth rate shows a consistent
            decline, from 2.13% in 1963 to 0.92% in 2023.
          </li>
          <li>
            In the early 21st century (2000–2023), growth rates stabilized
            around 1.2%, followed by a sharper decline post-2015.
          </li>
          <li>
            The growth rate fell below 1% for the first time in 2021 (0.87%).
          </li>
        </ul>
      </div>
    </div>
  );
}

function generatePlot(data: PopulationGrowth[]): echarts.ECharts {
  const plotEl = document.getElementById("population-growth-chart");
  if (!plotEl) throw new Error("Plot element not found");

  const plot = echarts.init(plotEl);

  const years = data.map((item) => item.year);
  const growthRates = data.map((item) => item.growth_rate);

  let option = {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c}%",
    },
    grid: { top: 20, right: 40, bottom: 50, left: 60 },
    xAxis: {
      type: "category",
      data: years,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: [
      {
        name: "Growth Rate",
        type: "line",
        smooth: 0.6,
        symbol: "none",
        data: growthRates,
        lineStyle: {
          width: 5,
          color: "#262626",
        },

        markArea: {
          silent: true,
          itemStyle: {
            color: "#f3f4f6",
          },
          data: [
            [
              { itemStyle: { color: "#e34f4f", opacity: 0.3 }, yAxis: 2 },
              { yAxis: 2.5 },
            ],
            [
              { itemStyle: { color: "#e3c14f", opacity: 0.3 }, yAxis: 1 },
              { yAxis: 2 },
            ],
            [
              { itemStyle: { color: "#b7e34f", opacity: 0.3 }, yAxis: 0 },
              { yAxis: 1 },
            ],
          ],
        },
        markPoint: {
          symbolSize: 60,
          label: {
            fontSize: 12,
          },
          itemStyle: {
            color: "#374151",
          },
          data: [
            { type: "max", name: "Peak" },
            { type: "min", name: "Lowest" },
          ],
        },
      },
    ],
  };

  plot.setOption(option);
  return plot;
}

function provideGrowthRate(data: { [key: string]: number }) {
  const result = Object.keys(data).map((year, index, years) => {
    const population = data[year];
    const previousPopulation = index > 0 ? data[years[index - 1]] : null;
    const growthRate = previousPopulation
      ? (
          ((population - previousPopulation) / previousPopulation) *
          100
        ).toFixed(2)
      : null;

    return {
      year: parseInt(year),
      population: population,
      growth_rate: growthRate ? parseFloat(growthRate) : null,
    };
  });

  return result;
}
