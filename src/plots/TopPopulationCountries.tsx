import { CountryPopulation } from "@/functions/getPopulationData";
import { useEffect } from "react";
import * as echarts from "echarts";
import { formatBigNumber } from "../utils/formatter";

type TopPopulationCountriesProps = {
  data: CountryPopulation[];
};

export default function TopPopulationCountries({
  data,
}: TopPopulationCountriesProps) {
  useEffect(() => {
    if (data) {
      const sortedData = data.sort((a, b) => a.population - b.population);
      generatePlot(sortedData);
      console.log(sortedData);
    }
  }, [data]);

  return (
    <div className="w-full h-full">
      <div id="countries-population" className="w-full h-[100%] p-4"></div>
    </div>
  );
}

function generatePlot(data: CountryPopulation[]) {
  let plotEl = document.getElementById("countries-population");
  let plot = echarts.init(plotEl);

  let option = {
    title: [
      {
        show: true,
        left: "right",
        text: "Countries Population 1960-2023",
      },
    ],
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: number) => `${formatBigNumber(value, 4)}`,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: data.map((item) => item.country),
    },
    series: [
      {
        type: "bar",
        data: data.map((country) => country.population),
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
