import { useEffect, useState } from "react";
import { getPopulationData } from "./functions/getPopulationData";
import WorldPopulation from "./plots/WorldPopulation";

function App() {
  const [worldPopulation, setWorldPopulation] = useState<{
    [key: string]: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <section className="w-1/4 border-r">Sidebar</section>
        <section className="w-3/4">
          <WorldPopulation data={worldPopulation} />
        </section>
      </main>
    </div>
  );
}

export default App;
