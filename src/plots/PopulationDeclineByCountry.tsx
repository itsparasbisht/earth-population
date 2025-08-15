import { PopulationDecline } from "@/functions/getPopulationData";
import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect, useState } from "react";

type PopulationDeclineProps = {
  data: PopulationDecline[];
};

export default function PopulationDeclineByCountry({
  data,
}: PopulationDeclineProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const chartsPerPage = 6;

  const paginatedData = data.slice(
    currentPage * chartsPerPage,
    (currentPage + 1) * chartsPerPage
  );

  const totalPages = Math.ceil(data.length / chartsPerPage);

  useEffect(() => {
    if (paginatedData) {
      // A timeout ensures that the DOM elements are available before rendering the charts.
      const timer = setTimeout(() => {
        for (const item of paginatedData) {
          generatePlot(item);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [paginatedData]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((item) => (
            <div
              key={item.country}
              id={`${item.country}`}
              className="h-[300px] bg-white"
            ></div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-8 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="font-lora px-3 py-1 bg-transparent hover:bg-gray-100/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center uppercase text-xs tracking-widest text-gray-700"
        >
          <span className="mr-2 text-base font-normal">&larr;</span>
          Prev
        </button>
        <span className="font-lora text-xs text-gray-500 tracking-widest">
          {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className="font-lora px-3 py-1 bg-transparent hover:bg-gray-100/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center uppercase text-xs tracking-widest text-gray-700"
        >
          Next
          <span className="ml-2 text-base font-normal">&rarr;</span>
        </button>
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
            <span style="color: #B91C1C;">Decline:</span> ${decline.toFixed(2)}%
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
          borderColor: "#B91C1C",
          shadowBlur: 8,
          shadowColor: "rgba(185, 28, 28, 0.5)",
        },
        lineStyle: {
          color: "#B91C1C",
          width: 4,
          shadowColor: "rgba(185, 28, 28, 0.4)",
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
                color: "rgba(185, 28, 28, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(185, 28, 28, 0.01)",
              },
            ],
          },
        },
      },
    ],
    textStyle: {
      color: "#B91C1C",
      fontFamily: "Lora",
    },
  };

  option && plot.setOption(option);
}
