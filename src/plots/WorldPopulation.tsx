import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect } from "react";

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
      <div id="world-population" className="w-full h-full p-4"></div>
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
        left: "right",
        text: "World Population since 1960",
        textStyle: {
          color: "black",
          fontFamily: "Merriweather",
        },
      },
    ],
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
