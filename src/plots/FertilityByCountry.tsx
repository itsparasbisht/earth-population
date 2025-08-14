import { FertilityEntry } from "@/functions/getFertilityData";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import fertilityLevels from "../assets/data/fertility-levels.json";
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
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
      }

      const option = generatePlotOption(data, selectedFertilityLevel);
      chartInstanceRef.current.setOption(option, true);

      const handleResize = () => {
        chartInstanceRef.current?.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [data, selectedFertilityLevel]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="space-y-4 p-4">
        {fertilityLevels.map((item) => (
          <div
            key={item.title}
            className="w-full flex flex-col md:flex-row items-start p-4 rounded-lg bg-white dark:bg-gray-900 shadow-md"
            style={{ borderLeft: `5px solid ${item["bg-color"]}` }}
          >
            <div className="w-full md:w-1/3 font-display pr-4 mb-4 md:mb-0">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                {item.rate}
              </span>
              <h3 className="text-xl mt-1 text-gray-700 dark:text-gray-300">
                {item.title}
              </h3>
            </div>
            <div className="w-full md:w-2/3 font-serif pl-4 border-l border-gray-200 dark:border-gray-700">
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 list-disc pl-5">
                {item.pointers.map((point, index) => (
                  <li key={index} className="leading-snug">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end px-4">
        <Select
          onValueChange={setSelectedFertilityLevel}
          value={selectedFertilityLevel}
        >
          <SelectTrigger className="w-[250px] border-2 relative top-7 z-50">
            <SelectValue placeholder={fertilityLevelsOption[0]} />
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
        ref={chartRef}
        className="w-full min-w-[600px] h-[800px] max-h-[800px] px-4"
      ></div>
    </div>
  );
}

function generatePlotOption(
  data: FertilityEntry[],
  selectedFertilityLevel: string
) {
  const countryList = data.map((entry) => entry.country);

  const plotData = data.map((entry) => {
    const fertility = entry.fertility;
    let isHighlighted = false;

    if (selectedFertilityLevel !== "All") {
      if (selectedFertilityLevel === "High Fertility")
        isHighlighted = fertility >= 4.0;
      else if (selectedFertilityLevel === "Moderate Fertility")
        isHighlighted = fertility > 2.1 && fertility < 4.0;
      else if (selectedFertilityLevel === "Replacement-Level Fertility")
        isHighlighted = fertility >= 2.0 && fertility <= 2.1;
      else if (selectedFertilityLevel === "Low Fertility")
        isHighlighted = fertility >= 1.5 && fertility < 2.0;
      else if (selectedFertilityLevel === "Extremely Low Fertility")
        isHighlighted = fertility < 1.5;
    }

    return {
      name: entry.country,
      value: [entry.country, fertility],
      symbolSize: isHighlighted ? 15 : 8,
      itemStyle: {
        color: isHighlighted ? "#de1b3b" : "#242323",
        opacity: isHighlighted ? 0.5 : 0.6,
      },
      zLevel: isHighlighted ? 10 : 1,
    };
  });

  let option = {
    title: [
      {
        show: true,
        left: "center",
        text: `Fertility Rate by Country`,
        subtext: `Highlighting: ${selectedFertilityLevel}`,
        textStyle: {
          fontSize: 24,
          fontFamily: "Abril Fatface",
          fontWeight: "normal",
          color: "#333",
        },
      },
    ],
    grid: {
      top: 80,
      left: 60,
      right: 40,
      bottom: 120,
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => `${params.name}: ${params.value[1]}`,
    },
    xAxis: [
      {
        type: "category",
        data: countryList,
        axisLabel: {
          interval: "auto",
          fontFamily: "Lora",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Fertility Rate",
        nameTextStyle: { fontFamily: "Lora" },
        axisLabel: { fontFamily: "Lora" },
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#eee",
          },
        },
      },
    ],
    series: [
      {
        type: "scatter",
        data: plotData,
        markArea: {
          itemStyle: {
            opacity: 0.2,
          },
          label: {
            position: "insideTopLeft",
            color: "#333",
            fontSize: 11,
            fontFamily: "Lora",
          },
        },
      },
    ],
  };

  return option;
}
