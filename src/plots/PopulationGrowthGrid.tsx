import { useEffect, useState } from "react";

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

  console.log(populationGrowthRate);

  return (
    <div className="p-4 pt-0">
      <h2 className="text-xl font-semibold">
        Population growth rate over the years{" "}
        <span className="text-lg font-normal text-red-600">
          (hover over grid for growth rate)
        </span>
      </h2>
      <div className="flex p-4">
        {populationGrowthRate.map((item) => (
          <div
            key={item.year}
            className="w-5 h-12"
            style={{ backgroundColor: getColorByGrowthRate(item.growth_rate) }}
            title={`Year: ${item.year}, Growth Rate: ${
              item.growth_rate ?? "N/A"
            }%`}
          >
            {/* Accessible content for screen readers */}
            <span className="sr-only">{`Year: ${item.year}, Growth Rate: ${
              item.growth_rate ?? "N/A"
            }%`}</span>
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
  if (growthRate === null) return "bg-gray-300";
  const intensity = Math.min(Math.max(growthRate, 0), 5) * 180;
  const r = Math.min(255 - intensity);
  const g = Math.min(255 - intensity / 1.8);
  const b = Math.min(255 - intensity);
  return `rgb(${r}, ${g}, ${b})`;
}
