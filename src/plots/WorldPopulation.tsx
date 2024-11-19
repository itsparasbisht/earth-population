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
      const growthRate = objWithGrowthRate(data);
      console.log(growthRate);
    }
  }, [data]);

  return (
    <>
      <div className="p-4">
        <h2 className="text-3xl font-semibold text-gray-900">
          Total World Population and Growth Rate
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
      valueFormatter: (value: number) => `${formatBigNumber.format(value)}`,
      color: "black",
      fontFamily: "Merriweather",
    },
    xAxis: [
      {
        data: yearList,
      },
    ],
    yAxis: [{}],
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

function objWithGrowthRate(data: { [key: string]: number }) {
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
