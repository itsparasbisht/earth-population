import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect } from "react";
import PopulationGrowthGrid from "./PopulationGrowthGrid";

type WorldPopulation = {
  data: { [key: string]: number } | null;
};

export default function WorldPopulation({ data }: WorldPopulation) {
  useEffect(() => {
    if (data) {
      generatePlot(data);
    }
  }, [data]);

  return (
    <>
      <div className="p-4">
        <h2 className="text-3xl font-semibold text-gray-900">
          Total World Population and Growth Rate (1960-2023)
        </h2>
        <p className="max-w-[70%] pt-1 text-gray-900">
          The graph below illustrates the remarkable expansion of the global
          population since 1960, starting at 3 billion and surging to nearly 8
          billion by 2023—an astonishing threefold increase over 63 years.
        </p>
      </div>
      <div id="world-population" className="w-full h-[74%] p-4"></div>
      <PopulationGrowthGrid data={data} />
    </>
  );
}

function generatePlot(data: { [key: string]: number } | null) {
  console.log(data);
  let plotEl = document.getElementById("world-population");
  let plot = echarts.init(plotEl);

  const yearList: string[] = [];
  const valueList: number[] = [];

  for (let year in data) {
    yearList.push(year);
    valueList.push(data[year]);
  }

  console.log(yearList, valueList);

  let option = {
    title: [
      {
        show: false,
        left: "right",
        text: "World Population since 1960",
        textStyle: {
          color: "black",
          fontFamily: "Merriweather",
        },
      },
    ],
    grid: {
      top: 30,
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => `${formatBigNumber(value, 4)}`,
      color: "black",
      fontFamily: "Merriweather",
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
