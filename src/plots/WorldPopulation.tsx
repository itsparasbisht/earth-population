import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

type WorldPopulationProps = {
  data: { [key: string]: number } | null;
};

export default function WorldPopulation({ data }: WorldPopulationProps) {
  const chartRef = useRef<echarts.ECharts>();

  useEffect(() => {
    const latestPopulation = data && data["2023"];
    if (latestPopulation) {
      const chart = generatePlot(data);
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
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="h-[500px]">
        <div id="world-population" className="w-full h-full"></div>
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
            The world population has grown from 3 billion in 1960 to over 8
            billion by 2023.
          </li>
        </ul>
      </div>
    </div>
  );
}

function generatePlot(data: { [key: string]: number } | null): echarts.ECharts {
  const plotEl = document.getElementById("world-population");
  if (!plotEl) throw new Error("Plot element not found");

  const plot = echarts.init(plotEl);
  const yearList: string[] = [];
  const valueList: number[] = [];

  for (let year in data) {
    yearList.push(year);
    valueList.push(data[year]);
  }

  let option = {
    title: [
      {
        show: false,
      },
    ],
    grid: {
      top: 40,
      right: 40,
      bottom: 60,
      left: 60,
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => `${formatBigNumber(value, 4)}`,
      backgroundColor: "white",
      borderColor: "#e2e8f0",
      textStyle: {
        color: "#334155",
        fontFamily: "Lora",
      },
    },
    xAxis: [
      {
        data: yearList,
        axisLabel: {
          fontFamily: "Lora",
          fontSize: 12,
          color: "#64748b",
        },
        axisLine: {
          lineStyle: {
            color: "#e2e8f0",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#f1f5f9",
            type: "dashed",
          },
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (value: number) {
            return formatBigNumber(value);
          },
          fontFamily: "Lora",
          fontSize: 12,
          color: "#64748b",
        },
        axisLine: {
          lineStyle: {
            color: "#e2e8f0",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#f1f5f9",
            type: "dashed",
          },
        },
      },
    ],
    series: [
      {
        type: "line",
        showSymbol: true,
        symbolSize: 6,
        data: valueList,
        lineStyle: {
          color: "#ef4444",
          width: 2,
        },
        symbol: "circle",
        itemStyle: {
          color: "#ef4444",
          borderWidth: 2,
          borderColor: "#fff",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(239, 68, 68, 0.2)",
              },
              {
                offset: 1,
                color: "rgba(239, 68, 68, 0)",
              },
            ],
          },
        },
      },
    ],
  };

  option && plot.setOption(option);
  return plot;
}
