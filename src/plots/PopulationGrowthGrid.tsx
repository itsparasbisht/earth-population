import { useEffect, useState } from "react";

type PopulationGrowth = {
  year: number;
  population: number;
  growth_rate: number | null;
};

export default function PopulationGrowthGrid({
  populationData,
}: {
  [key: string]: number;
}) {
  const [populationGrowthRate, setPopulationGrowthRate] = useState<
    PopulationGrowth[]
  >([]);

  useEffect(() => {
    if (populationData) {
      const response = objWithGrowthRate(populationData);
      setPopulationGrowthRate(response);
    }
  }, [populationData]);

  return (
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
  );
}

function objWithGrowthRate(data: { [key: string]: number }) {
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
  if (growthRate === null) return "bg-gray-300"; // Neutral color for no growth
  const intensity = Math.min(Math.max(growthRate, 0), 5) * 170; // Cap growth rate between 0 and 5
  const r = Math.min(255 - intensity);
  const g = Math.min(255 - intensity / 2);
  const b = Math.min(255 - intensity);
  return `rgb(${r}, ${g}, ${b})`;
}
