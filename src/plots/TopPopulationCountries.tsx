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

  useEffect(() => {
    if (data) {
      const sortedData = data.sort((a, b) => a.population - b.population);
      generatePlot(sortedData, selectedItem);
      console.log(sortedData);
    }
  }, [data, selectedItem]);

  console.log("selected", selectedItem);

  return (
    <div className="w-full h-full">
      <Select onValueChange={setSelectedItem} value={selectedItem}>
        <SelectTrigger className="w-[180px]">
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
      <div id="countries-population" className="w-full h-[100%] p-4"></div>
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
      data: data
        .slice(data.length - limit, data.length)
        .map((item) => item.country),
    },
    series: [
      {
        type: "bar",
        data: data
          .slice(data.length - limit, data.length)
          .map((country) => country.population),
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
