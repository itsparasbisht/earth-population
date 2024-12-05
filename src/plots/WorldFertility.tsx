import { useEffect } from "react";
import worldFertilityData from "../../data/world-fertility.json";
import * as echarts from "echarts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { InfoIcon } from "lucide-react";
import { FertilityEntry } from "@/functions/getFertilityData";

export default function WorldFertility() {
  useEffect(() => {
    generatePlot(worldFertilityData);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center p-2">
        <p>
          <b className="text-2xl">Fertility, </b>
          the average number of children born to a woman during her reproductive
          years (typically ages 15–49). Fertility is a key indicator used to
          understand population growth and demographic trends, influencing
          factors such as economic development, health policies, and resource
          planning.
        </p>
        <div>
          <Popover>
            <PopoverTrigger className="flex gap-2 bg-gray-900 text-white p-2 rounded-sm hover:bg-gray-700">
              <InfoIcon />
              Observations
            </PopoverTrigger>
            <PopoverContent className="w-[600px] bg-gray-800 text-white border-0">
              <p className="m-2">
                - From 1960 to 2022, the fertility rate shows a significant
                overall decline from 4.70 in 1960 to 2.26 in 2022, indicating a
                shift towards smaller family sizes globally.
              </p>
              <p className="m-2">
                - Fertility peaked at 5.32 in 1963 before gradually starting to
                decline.
              </p>
              <p className="m-2">
                - By 2022, the global fertility rate (2.26) is approaching the
                replacement-level fertility rate of 2.1, which is the level
                needed for a stable population without immigration.
              </p>
              <p className="m-2">
                - This trend suggests population growth may slow or decline in
                many regions.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div
        id="world-fertility"
        className="w-full min-w-[600px] h-[85%] max-h-[800px] p-4"
      ></div>
    </div>
  );
}

function generatePlot(
  worldFertilityData: { year: number; fertility: number }[]
) {
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
