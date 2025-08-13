import { useEffect, useRef } from "react";
import worldFertilityData from "../assets/data/world-fertility.json";
import * as echarts from "echarts";

export default function WorldFertility() {
  const chartRef = useRef<echarts.ECharts>();

  useEffect(() => {
    const chart = generatePlot(worldFertilityData);
    chartRef.current = chart;

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="font-serif border-l-2 border-accent pl-4 mb-6">
        <p className="text-lg leading-relaxed text-muted-foreground">
          Fertility represents the average number of children born to a woman
          during her reproductive years (typically ages 15–49). This key
          indicator helps us understand population growth and demographic
          trends, influencing economic development, health policies, and
          resource planning.
        </p>
      </div>

      <div className="h-[500px]">
        <div id="world-fertility" className="w-full h-full"></div>
      </div>

      <div className="border-l-2 border-accent pl-4">
        <h4 className="font-display text-xl mb-3">Key Findings</h4>
        <ul className="font-serif text-muted-foreground space-y-3">
          <li>
            From 1960 to 2022, the global fertility rate declined dramatically
            from 4.70 to 2.26, reflecting a worldwide shift towards smaller
            families.
          </li>
          <li>
            The peak fertility rate of 5.32 was recorded in 1963, marking the
            beginning of a steady decline.
          </li>
          <li>
            By 2022, the rate (2.26) approached the replacement level of 2.1,
            suggesting potential population stabilization.
          </li>
          <li>
            This trend indicates a future slowdown in population growth across
            many regions.
          </li>
        </ul>
      </div>
    </div>
  );
}

function generatePlot(
  worldFertilityData: { year: number; fertility: number }[]
): echarts.ECharts {
  const plotEl = document.getElementById("world-fertility");
  if (!plotEl) throw new Error("Plot element not found");

  const plot = echarts.init(plotEl);

  const yearList: number[] = [];
  const fertilityList: number[] = [];

  for (let entry of worldFertilityData) {
    yearList.push(entry.year);
    fertilityList.push(entry.fertility);
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
      valueFormatter: (value: number) =>
        `${parseFloat(value.toString()).toFixed(2)}`,
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
    yAxis: [{}],
    series: [
      {
        type: "line",
        showSymbol: true,
        symbolSize: 6,
        data: fertilityList,
        lineStyle: {
          color: "black",
          width: 3,
        },
      },
    ],
    textStyle: {
      color: "black",
      fontFamily: "Merriweather",
    },
    color: "#ff2b6e",
  };

  option && plot.setOption(option);
  return plot;
}
