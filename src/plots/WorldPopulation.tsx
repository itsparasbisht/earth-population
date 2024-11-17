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
    // Make gradient line here
    visualMap: [
      {
        show: false,
        type: "continuous",
        seriesIndex: 0,
        min: 0,
        max: 400,
      },
    ],
    title: [
      {
        left: "right",
        text: "World Population since 1960",
        textStyle: {
          color: "black",
          fontFamily: "monospace",
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => formatBigNumber.format(value),
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
          width: 4,
        },
      },
    ],
  };

  option && plot.setOption(option);
}
