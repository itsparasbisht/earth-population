import { PopulationDecline } from "@/functions/getPopulationData";
import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";

type PopulationDeclineProps = {
  data: PopulationDecline[];
};

export default function PopulationDeclineByCountry({
  data,
}: PopulationDeclineProps) {
  useEffect(() => {
    if (data) {
      for (let item of data) generatePlot(item);
    }
  }, [data]);

  return (
    <div className="mt-6 space-y-8">
      {/* Analysis Section */}
      <div className="font-lora text-[15px] leading-relaxed">
        <div className="p-6 bg-[#FFFDF8] border-l-2 border-accent">
          <h3 className="font-abril text-xl mb-4 pb-2 border-b border-gray-300">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p>
                <strong className="text-red-700">Ukraine's Crisis:</strong>{" "}
                Facing the sharpest decline of -13.34%, Ukraine's population
                decrease stems from ongoing conflict, economic challenges, and
                forced displacement.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-red-700">Japan's Challenge:</strong>{" "}
                With 128 million people, Japan represents the largest population
                battling decline, primarily due to aging demographics and low
                birth rates.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-red-700">
                  Eastern European Pattern:
                </strong>{" "}
                A consistent trend emerges across Eastern Europe, with Bulgaria,
                Latvia, and Lithuania showing significant decreases, driven by
                westward migration and demographic shifts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.country}
              id={`${item.country}`}
              className="h-[300px] bg-white"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generatePlot(data: PopulationDecline) {
  let plotEl = document.getElementById(data.country);
  let plot = echarts.init(plotEl);

  const yearList = data.data.map((entry) => entry.year);
  const populationList = data.data.map((entry) => entry.population);
  const declineList = data.data.map((entry) => entry.decline);

  let option = {
    title: {
      show: true,
      text: data.country,
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 16,
        fontFamily: "Abril Fatface",
        fontWeight: "normal",
        color: "#1a1a1a",
      },
    },
    grid: {
      top: 50,
      left: 45,
      right: 20,
      bottom: 30,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontFamily: "Lora",
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const year = yearList[dataIndex];
        const population = populationList[dataIndex];
        const decline = declineList[dataIndex];
        return `
          <div style="font-family: Lora;">
            <span style="color: #666;">Year:</span> ${year}<br/>
            <span style="color: #666;">Population:</span> ${formatBigNumber(
              population,
              0
            )}<br/>
            <span style="color: #6A0572;">Decline:</span> ${decline.toFixed(2)}%
          </div>
        `;
      },
    },
    xAxis: {
      type: "category",
      data: yearList,
      axisLabel: {
        fontSize: 11,
        fontFamily: "Lora",
        interval: 2,
        color: "#666",
      },
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#f5f5f5",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: function (value: number) {
          return formatBigNumber(value, 0, "short");
        },
        fontSize: 11,
        fontFamily: "Lora",
        color: "#666",
      },
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#f5f5f5",
        },
      },
    },
    series: [
      {
        data: populationList,
        type: "line",
        smooth: true,
        showSymbol: true,
        symbolSize: 3,
        itemStyle: {
          color: "#fff",
          borderWidth: 2,
          borderColor: "#6A0572",
          shadowBlur: 8,
          shadowColor: "rgba(106, 5, 114, 0.5)",
        },
        lineStyle: {
          color: "#6A0572",
          width: 4,
          shadowColor: "rgba(106, 5, 114, 0.4)",
          shadowBlur: 10,
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
                color: "rgba(106, 5, 114, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(106, 5, 114, 0.01)",
              },
            ],
          },
        },
      },
    ],
    textStyle: {
      color: "#6A0572",
      fontFamily: "Lora",
    },
  };

  option && plot.setOption(option);
}
