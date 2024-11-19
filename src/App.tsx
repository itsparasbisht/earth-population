import { useEffect, useState } from "react";
import { getPopulationData } from "./functions/getPopulationData";
import TopPopulationCountries from "./plots/TopPopulationCountries";
import WorldPopulation from "./plots/WorldPopulation";

const sidebarOptions = [
  {
    title: "Total World Population and Growth Rate (1960-2023)",
    id: "world-population",
  },
  { title: "Top 50 countries by population", id: "top-50" },
];

function App() {
  const [worldPopulation, setWorldPopulation] = useState<{
    [key: string]: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selectedOption, setSelectedOption] = useState(sidebarOptions[0].id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { worldPopulation } = await getPopulationData();
        setWorldPopulation(worldPopulation);
      } catch (err) {
        console.error("failed to fetch population data", err);
        setError("Failed to load population data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen">
      <main className="flex h-full">
        <section className="w-1/4 border-r p-2">
          {sidebarOptions.map((item) => (
            <p
              className={`${
                selectedOption === item.id
                  ? "bg-gray-900 text-gray-100"
                  : "bg-gray-100 text-gray-900"
              } text-xl p-4 rounded-md cursor-pointer mb-2 border`}
              onClick={() => setSelectedOption(item.id)}
            >
              {item.title}
            </p>
          ))}
        </section>
        <section className="w-3/4">
          {selectedOption === "world-population" && (
            <WorldPopulation data={worldPopulation} />
          )}
          {selectedOption === "top-50" && <TopPopulationCountries />}
        </section>
      </main>
    </div>
  );
}

export default App;
