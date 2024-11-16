import { useEffect } from "react";

import WorldPopulation from "./plots/WorldPopulation.js";
import { getPopulationData } from "./functions/getPopulationData.js";

function App() {
  async function getData() {
    const { worldPopulation } = await getPopulationData();
    console.log(worldPopulation);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-screen h-screen">
      <main className="flex h-full">
        <section className="w-1/4 border-r">Sidebar</section>
        <section className="w-3/4">
          <WorldPopulation />
        </section>
      </main>
    </div>
  );
}

export default App;
