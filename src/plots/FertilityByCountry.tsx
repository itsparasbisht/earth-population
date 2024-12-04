import { FertilityEntry } from "@/functions/getFertilityData";
import * as echarts from "echarts";
import { useEffect } from "react";

type FertilityByCountryProps = {
  data: FertilityEntry[];
};

export default function FertilityByCountry({ data }: FertilityByCountryProps) {
  useEffect(() => {
    if (data) {
      generatePlot(data);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <div
        id="fertility-by-country"
        className="w-full min-w-[600px] h-[85%] max-h-[800px] p-4"
      ></div>
    </div>
  );
}

function generatePlot(data: FertilityEntry[]) {
  let plotEl = document.getElementById("fertility-by-country");
  let plot = echarts.init(plotEl);

  const countryList: string[] = [];
  const fertilityList: number[] = [];

  for (let entry of data) {
    countryList.push(entry.country);
    fertilityList.push(entry.fertility);
  }

  let option = {
    title: [
      {
        show: true,
        left: "right",
        text: "Fertility Rate by Country",
      },
    ],
    grid: {
      top: 60,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: [
      {
        data: countryList,
      },
    ],
    yAxis: [{}],
    series: [
      {
        type: "line",
        symbol: "circle",
        showSymbol: true,
        symbolSize: 5,
        showAllSymbol: true,
        data: fertilityList,
        lineStyle: {
          color: "black",
          width: 0,
        },
      },
    ],
    textStyle: {
      color: "black",
      fontFamily: "Merriweather",
    },
    color: "black",
  };

  option && plot.setOption(option);
}
