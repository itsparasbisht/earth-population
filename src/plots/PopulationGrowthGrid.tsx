import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
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
          Population growth rate over the years{" "}
          <span className="text-sm font-bold text-red-600">
            (hover over grid for growth rate)
          </span>
        </h2>
        <div>
          <HoverCard openDelay={300}>
            <HoverCardTrigger className="flex cursor-pointer bg-gray-900 p-2 gap-1 rounded-sm text-white">
              <InfoIcon /> Observations
            </HoverCardTrigger>
            <HoverCardContent className="w-[500px] bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div>
                <p className="m-2">
                  - The highest growth rates occurred during the early 1960s to
                  1970, peaking at 2.13% in 1963.
                </p>
                <p className="m-2">
                  - After the 1960s, the population growth rate shows a
                  consistent decline, from 2.13% in 1963 to 0.92% in 2023.
                </p>
                <p className="m-2">
                  - In the early 21st century (2000–2023), growth rates
                  stabilized around 1.2%, followed by a sharper decline
                  post-2015.
                </p>
                <p className="m-2">
                  - The growth rate fell below 1% for the first time in 2021
                  (0.87%).
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="flex flex-wrap gap-y-2 p-4">
        {populationGrowthRate.map((item) => (
          <TooltipProvider key={item.year} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  key={item.year}
                  className="flex-1 w-5 h-12"
                  style={{
                    backgroundColor: getColorByGrowthRate(item.growth_rate),
                  }}
                ></div>
              </TooltipTrigger>
              <TooltipContent>
                {`Year: ${item.year}, Growth Rate: ${
                  item.growth_rate ?? "N/A"
                }%`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
