import { useEffect } from "react";
import worldFertilityData from "../../data/world-fertility.json";
import * as echarts from "echarts";

type FertilityEntry = {
  year: number;
  fertility: number;
};

console.log(worldFertilityData);

export default function WorldFertility() {
  useEffect(() => {
    generatePlot(worldFertilityData);
  }, []);

  return (
    <div className="w-full h-full">
      <div>
        <p className="p-2">
          <b className="text-2xl">Fertility, </b>
          the average number of children born to a woman during her reproductive
          years (typically ages 15–49). Fertility is a key indicator used to
          understand population growth and demographic trends, influencing
          factors such as economic development, health policies, and resource
          planning.
        </p>
      </div>
      <div
        id="world-fertility"
        className="w-full min-w-[600px] h-[85%] max-h-[800px] p-4"
      ></div>
    </div>
  );
}

function generatePlot(worldFertilityData: FertilityEntry[]) {
  let plotEl = document.getElementById("world-fertility");
  let plot = echarts.init(plotEl);

  const yearList: number[] = [];
  const fertilityList: number[] = [];

  for (let entry of worldFertilityData) {
    yearList.push(entry.year);
    fertilityList.push(entry.fertility);
  }

  let option = {
    title: [
      {
        show: true,
        left: "right",
        text: "World Fertility Data (1960-2022)",
      },
    ],
    grid: {
      top: 60,
    },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) =>
        `${parseFloat(value.toString()).toFixed(2)}`,
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
        data: fertilityList,
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
