import { FertilityEntry } from "@/functions/getFertilityData";
import * as echarts from "echarts";
import { useEffect, useState } from "react";
import fertilityLevels from "../../data/fertility-levels.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type FertilityByCountryProps = {
  data: FertilityEntry[];
};

const fertilityLevelsOption = [
  "All",
  "High Fertility",
  "Moderate Fertility",
  "Replacement-Level Fertility",
  "Low Fertility",
  "Extremely Low Fertility",
];

export default function FertilityByCountry({ data }: FertilityByCountryProps) {
  const [selectedFertilityLevel, setSelectedFertilityLevel] = useState(
    fertilityLevelsOption[0]
  );

  useEffect(() => {
    if (data) {
      generatePlot(data, selectedFertilityLevel);
    }
  }, [data, selectedFertilityLevel]);

  return (
    <div className="w-full h-full">
      <div className="flex flex-wrap p-4 gap-4">
        {fertilityLevels.map((item) => (
          <div
            key={item.title}
            className="w-[400px] flex-col items-center justify-center p-4 rounded-lg"
            style={{
              backgroundColor: item["bg-color"],
              color: item["text-color"],
            }}
          >
            <div className="font-bold">
              <span className="text-2xl">{item.rate}</span>
              <span className="text-xl ml-2">({item.title})</span>
            </div>
            <div
              className="w-full h-[1px] mt-2"
              style={{ backgroundColor: item["text-color"] }}
            ></div>
            <ul className="px-6 py-3 list-disc">
              {item.pointers.map((point) => (
                <li key={point} className="mb-1">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-end px-4">
        <Select
          onValueChange={setSelectedFertilityLevel}
          value={selectedFertilityLevel}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue
              placeholder={fertilityLevelsOption[0]}
              defaultValue={fertilityLevelsOption[0]}
            />
          </SelectTrigger>
          <SelectContent>
            {fertilityLevelsOption.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        id="fertility-by-country"
        className="w-full min-w-[600px] h-[85%] max-h-[800px] px-4"
      ></div>
    </div>
  );
}

function generatePlot(data: FertilityEntry[], selectedFertilityLevel: string) {
  let plotEl = document.getElementById("fertility-by-country");
  let plot = echarts.init(plotEl);

  const countryList: string[] = [];
  const fertilityList: number[] = [];
  const symbolSizeList: number[] = [];
  const colorList: string[] = [];

  for (let entry of data) {
    countryList.push(entry.country);
    fertilityList.push(entry.fertility);

    // determine if the entry is part of the selected fertility level
    const isHighlighted =
      (selectedFertilityLevel === "High Fertility" && entry.fertility >= 4.0) ||
      (selectedFertilityLevel === "Moderate Fertility" &&
        entry.fertility > 2.1 &&
        entry.fertility <= 3.9) ||
      (selectedFertilityLevel === "Replacement-Level Fertility" &&
        entry.fertility >= 2.0 &&
        entry.fertility <= 2.1) ||
      (selectedFertilityLevel === "Low Fertility" &&
        entry.fertility < 2.1 &&
        entry.fertility >= 1.5) ||
      (selectedFertilityLevel === "Extremely Low Fertility" &&
        entry.fertility < 1.5);

    // assign styles based on the highlighted status
    if (selectedFertilityLevel === "All" || isHighlighted) {
      colorList.push(isHighlighted ? "#ff2b6e" : "#212121");
      symbolSizeList.push(isHighlighted ? 14 : 7);
    } else {
      colorList.push("#212121");
      symbolSizeList.push(7);
    }
  }

  let option = {
    title: [
      {
        show: true,
        left: "left",
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
        type: "scatter",
        symbol: "circle",
        showSymbol: true,
        data: fertilityList.map((value, index) => ({
          value,
          itemStyle: { color: colorList[index] },
          symbolSize: symbolSizeList[index],
        })),
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
