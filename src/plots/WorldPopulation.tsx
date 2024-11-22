import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect } from "react";
import PopulationGrowthGrid from "./PopulationGrowthGrid";

type WorldPopulationProps = {
  data: { [key: string]: number } | null;
};

export default function WorldPopulation({ data }: WorldPopulationProps) {
  useEffect(() => {
    const latestPopulation = data && data["2023"];
    if (latestPopulation) {
      generatePlot(data);
    }
  }, [data]);

  return (
    <div className="w-full h-screen">
      <div className="p-4">
        <h2 className="text-3xl font-semibold text-gray-900">
          Total World Population and Growth Rate (1960-2023)
        </h2>
      </div>
      <div id="world-population" className="w-full h-[70%] p-4"></div>
      <div>
        <PopulationGrowthGrid data={data} />
      </div>
      <div className="p-4">
        <section className="bg-gradient-to-r from-gray-800 to-gray-600 py-4 px-6 rounded-lg shadow-md text-white">
          <ul>
            <li className="flex items-start my-3">
              <p className="text-lg md:text-xl ml-2">
                1. The highest growth rates occurred during the early 1960s to
                1970, peaking at <span className="font-semibold">2.13%</span> in{" "}
                <span className="font-semibold">1963</span>.
              </p>
            </li>
            <li className="flex items-start my-3">
              <p className="text-lg md:text-xl ml-2">
                2. After the 1960s, the population growth rate shows a
                consistent decline, from{" "}
                <span className="font-semibold">2.13%</span> in{" "}
                <span className="font-semibold">1963</span> to{" "}
                <span className="font-semibold">0.92%</span> in{" "}
                <span className="font-semibold">2023</span>.
              </p>
            </li>
            <li className="flex items-start my-3">
              <p className="text-lg md:text-xl ml-2">
                3. In the early 21st century (
                <span className="font-semibold">2000–2023</span>), growth rates
                stabilized around <span className="font-semibold">1.2%</span>,
                followed by a sharper decline post-
                <span className="font-semibold">2015</span>.
              </p>
            </li>
            <li className="flex items-start my-3">
              <p className="text-lg md:text-xl ml-2">
                4. The growth rate fell below{" "}
                <span className="font-semibold">1%</span> for the first time in{" "}
                <span className="font-semibold">2021</span> (
                <span className="font-semibold">0.87%</span>).
              </p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function generatePlot(data: { [key: string]: number } | null) {
  let plotEl = document.getElementById("world-population");
  let plot = echarts.init(plotEl);

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
        left: "right",
        text: "World Population since 1960",
      },
    ],
    grid: {
      top: 30,
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => `${formatBigNumber(value, 4)}`,
    },
    xAxis: [
      {
        data: yearList,
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (value: number) {
            return formatBigNumber(value);
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
}
