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
    <div className="w-full h-full">
      <div
        id="world-population"
        className="w-full min-w-[600px] h-[85%] max-h-[800px] p-4"
      ></div>
      <div className="w-full">
        <PopulationGrowthGrid data={data} />
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
        show: true,
        left: "right",
        text: "Total World Population (1960-2023)",
      },
    ],
    grid: {
      top: 60,
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
