import { FertilityEntry } from "@/functions/getFertilityData";
import * as echarts from "echarts";
import { useEffect } from "react";
import fertilityLevels from "../../data/fertility-levels.json";

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
