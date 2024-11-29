import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import { InfoIcon } from "lucide-react";

type PopulationGrowth = {
  year: number;
  population: number;
  growth_rate: number | null;
};

type WorldPopulation = {
  data: { [key: string]: number } | null;
};

export default function PopulationGrowthGrid({ data }: WorldPopulation) {
  const [populationGrowthRate, setPopulationGrowthRate] = useState<
    PopulationGrowth[]
  >([]);

  useEffect(() => {
    if (data) {
      const response = provideGrowthRate(data);
      setPopulationGrowthRate(response);
    }
  }, [data]);

  return (
    <div className="p-4 pt-0 w-full">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">
          Population growth rate over the years
        </h2>
        <div>
          <Popover>
            <PopoverTrigger className="flex gap-2 bg-gray-900 text-white p-2 rounded-sm hover:bg-gray-700">
              <InfoIcon /> Growth Rate Observations
            </PopoverTrigger>
            <PopoverContent className="w-[400px] bg-gray-800 text-white border-0">
              <p className="m-2">
                - The highest growth rates occurred during the early 1960s to
                1970, peaking at 2.13% in 1963.
              </p>
              <p className="m-2">
                - After the 1960s, the population growth rate shows a consistent
                decline, from 2.13% in 1963 to 0.92% in 2023.
              </p>
              <p className="m-2">
                - In the early 21st century (2000–2023), growth rates stabilized
                around 1.2%, followed by a sharper decline post-2015.
              </p>
              <p className="m-2">
                - The growth rate fell below 1% for the first time in 2021
                (0.87%).
              </p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-4">
        {populationGrowthRate.map((item) => (
          <div
            key={item.year}
            className="flex flex-col items-center text-sm p-1 font-semibold border-2"
          >
            <div
              key={item.year}
              className="w-12 h-12"
              style={{
                backgroundColor: getColorByGrowthRate(item.growth_rate),
              }}
            ></div>
            <span>{item.year}</span>
            <span>{item.growth_rate ? item.growth_rate + "%" : "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function provideGrowthRate(data: { [key: string]: number }) {
  const result = Object.keys(data).map((year, index, years) => {
    const population = data[year];
    const previousPopulation = index > 0 ? data[years[index - 1]] : null;
    const growthRate = previousPopulation
      ? (
          ((population - previousPopulation) / previousPopulation) *
          100
        ).toFixed(2)
      : null;

    return {
      year: parseInt(year),
      population: population,
      growth_rate: growthRate ? parseFloat(growthRate) : null,
    };
  });

  return result;
}

function getColorByGrowthRate(growthRate: number | null) {
  if (growthRate === null) return "gray";
  const intensity = Math.min(Math.max(growthRate, 0), 5) * 180;
  const r = Math.min(255 - intensity);
  const g = Math.min(255 - intensity / 1.8);
  const b = Math.min(255 - intensity);
  return `rgb(${r}, ${g}, ${b})`;
}
