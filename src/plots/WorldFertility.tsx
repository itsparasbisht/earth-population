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
        text: "Global Fertility Rate Trends",
        subtext: "Tracking the average number of children per woman (1960-2022)",
        left: "center",
        top: 10,
        textStyle: {
          fontSize: 24,
          fontFamily: "Abril Fatface",
          fontWeight: "normal",
          color: "#333",
        },
        subtextStyle: {
          fontSize: 14,
          fontFamily: "Lora",
          color: "#666",
        },
      },
    ],
    grid: {
      top: 100,
      right: 150,
      bottom: 60,
      left: 60,
      show: true,
      borderColor: "#f0f0f0",
      borderWidth: 1,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#bde0fe",
      borderWidth: 2,
      textStyle: {
        color: "#333",
        fontFamily: "Lora",
        fontSize: 13,
      },
      formatter: (params: any) => {
        const data = params[0];
        const year = data.name;
        const fertility = parseFloat(data.value).toFixed(2);
        let icon = "";
        if (parseFloat(fertility) > 2.1) {
          icon = "<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#e63946;\"></span>";
        } else if (parseFloat(fertility) < 2.1) {
          icon = "<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#457b9d;\"></span>";
        } else {
          icon = "<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#2a9d8f;\"></span>";
        }
        return `
          <div style=\"font-family: Lora; padding: 5px;">
            ${icon} <span style=\"color: #666;">Year:</span> <strong>${year}</strong><br/>
            <span style=\"color: #219ebc;">Fertility Rate:</span> <strong>${fertility}</strong>
          </div>
        `;
      },
    },
    xAxis: [
      {
        data: yearList,
        type: "category",
        boundaryGap: false,
        axisLabel: {
          fontFamily: "Lora",
          fontSize: 12,
          color: "#555",
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#f0f0f0",
            type: "solid",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Fertility Rate",
        nameTextStyle: {
          fontFamily: "Lora",
          fontSize: 14,
          color: "#555",
        },
        axisLabel: {
          fontFamily: "Lora",
          fontSize: 12,
          color: "#555",
          formatter: "{value}",
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#f0f0f0",
            type: "solid",
          },
        },
      },
    ],
    series: [
      {
        type: "line",
        showSymbol: false,
        symbolSize: 8,
        symbol: "circle",
        data: fertilityList,
        lineStyle: {
          width: 4,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#a2d2ff" },
            { offset: 0.5, color: "#8ecae6" },
            { offset: 1, color: "#219ebc" },
          ]),
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 5,
        },
        itemStyle: {
          color: "#219ebc",
          borderColor: "#fff",
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(142, 202, 230, 0.5)" },
            { offset: 1, color: "rgba(33, 158, 188, 0)" },
          ]),
        },
        markLine: {
          silent: true,
          lineStyle: {
            type: "dashed",
            color: "#e63946",
            width: 2,
          },
          label: {
            formatter: "Replacement Level (2.1)",
            position: "end",
            distance: 20, // Positive distance to push it outside
            fontFamily: "Lora",
            fontSize: 12,
            color: "#e63946",
          },
          data: [{ yAxis: 2.1 }],
        },
        animationDuration: 2000,
        animationEasing: "elasticOut",
      },
    ],
    textStyle: {
      color: "#333",
      fontFamily: "Lora",
    },
    color: "#219ebc",
  };

  option && plot.setOption(option);
  return plot;
}
