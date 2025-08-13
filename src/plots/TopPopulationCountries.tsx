import { CountryPopulation } from "@/functions/getPopulationData";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import { formatBigNumber } from "../utils/formatter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type TopPopulationCountriesProps = {
  data: CountryPopulation[];
};

export default function TopPopulationCountries({
  data,
}: TopPopulationCountriesProps) {
  const [selectedItem, setSelectedItem] = useState("Top 10");
  const [analysedData, setAnalysedData] = useState({
    populationOfTop10: 0,
    totalPopulation: 0,
    populationOfTop10InPercentage: 0,
  });

  useEffect(() => {
    if (data) {
      const sortedData = data.sort((a, b) => a.population - b.population);
      generatePlot(sortedData, selectedItem);
      const res = populationContributors(sortedData);
      setAnalysedData(res);
    }
  }, [data, selectedItem]);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-abril text-xl">
          Population by Country (1960-2023)
        </h3>
        <Select onValueChange={setSelectedItem} value={selectedItem}>
          <SelectTrigger className="w-[180px] bg-white border border-gray-200">
            <SelectValue placeholder="Top 10" defaultValue="Top 10" />
          </SelectTrigger>
          <SelectContent>
            {["Top 10", "Top 50", "Top 100", "All Countries"].map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-8">
        {/* Chart */}
        <div id="countries-population" className="w-full h-[500px]"></div>

        {/* Population Split */}
        {analysedData.populationOfTop10 > 0 && (
          <div className="font-lora">
            <h4 className="text-lg font-abril mb-4">
              Global Population Distribution
            </h4>
            <div className="space-y-3">
              <div className="relative h-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 transition-all duration-500 ease-in-out"
                  style={{
                    width: analysedData.populationOfTop10InPercentage + "%",
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-blue-800">
                    Top 10 Countries:
                  </span>{" "}
                  {analysedData.populationOfTop10InPercentage}% (
                  {formatBigNumber(analysedData.populationOfTop10, 2)})
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Rest of World:
                  </span>{" "}
                  {100 - analysedData.populationOfTop10InPercentage}% (
                  {formatBigNumber(
                    analysedData.totalPopulation -
                      analysedData.populationOfTop10,
                    2
                  )}
                  )
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generatePlot(data: CountryPopulation[], selectedItem: string) {
  let plotEl = document.getElementById("countries-population");
  let plot = echarts.init(plotEl);

  let limit = 10;

  if (selectedItem === "Top 10") limit = 10;
  else if (selectedItem === "Top 50") limit = 50;
  else if (selectedItem === "Top 100") limit = 100;
  else limit = data.length;

  let option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ddd",
      borderWidth: 1,
      textStyle: {
        color: "#333",
        fontFamily: "Lora",
      },
      valueFormatter: (value: number) => formatBigNumber(value, 2),
    },
    grid: {
      top: "40px",
      left: "15%",
      right: "8%",
      bottom: "20px",
      containLabel: true,
    },
    title: {
      // text: "Population by Country (1960-2023)",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 16,
        fontFamily: "Abril Fatface",
        color: "#333",
      },
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLabel: {
        formatter: (value: number) => formatBigNumber(value, 0, "short"),
        fontFamily: "Lora",
        fontSize: 11,
        color: "#666",
      },
      splitLine: {
        lineStyle: {
          color: "#f5f5f5",
        },
      },
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
    },
    yAxis: {
      type: "category",
      data: data
        .slice(data.length - limit, data.length)
        .map((item) => item.country),
      axisLabel: {
        fontFamily: "Lora",
        fontSize: 12,
        color: "#333",
        padding: [0, 20, 0, 0],
      },
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
    },
    series: [
      {
        type: "bar",
        data: data
          .slice(data.length - limit, data.length)
          .map((country) => country.population),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "#1a365d",
              },
              {
                offset: 0.3,
                color: "#2c5282",
              },
              {
                offset: 1,
                color: "#3182ce",
              },
            ],
          },
          borderRadius: [0, 4, 4, 0],
          shadowBlur: 10,
          shadowColor: "rgba(49, 130, 206, 0.2)",
        },
        barWidth: "60%",
        label: {
          show: true,
          position: "right",
          formatter: (params: any) => formatBigNumber(params.value, 0, "short"),
          fontFamily: "Lora",
          fontSize: 11,
          color: "#666",
        },
      },
    ],
  };

  option && plot.setOption(option);
}

function populationContributors(data: CountryPopulation[]) {
  const populationOfTop10 = data
    .slice(data.length - 10, data.length)
    .reduce((acc, country) => acc + country.population, 0);

  const totalPopulation = data.reduce(
    (acc, country) => acc + country.population,
    0
  );

  const populationOfTop10InPercentage = Math.round(
    (populationOfTop10 / totalPopulation) * 100
  );

  return {
    populationOfTop10,
    totalPopulation,
    populationOfTop10InPercentage,
  };
}
