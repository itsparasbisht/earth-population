import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getPopulationData,
  PopulationData,
} from "./functions/getPopulationData";
import PopulationDeclineByCountry from "./plots/PopulationDeclineByCountry";
import TopPopulationCountries from "./plots/TopPopulationCountries";
import WorldPopulation from "./plots/WorldPopulation";

const sidebarOptions = [
  {
    title: "Total Population",
    id: "total-population",
  },
  { title: "Population by Country", id: "country-population" },
  { title: "Population Decline", id: "population-decline" },
];

function App() {
  const [populationData, setPopulationData] = useState<PopulationData>({
    worldPopulation: {},
    countriesPopulation: [],
    populationDecline: [],
  });
  const [error, setError] = useState<string | null>(null);

  const [selectedOption, setSelectedOption] = useState(sidebarOptions[0].id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { worldPopulation, countriesPopulation, populationDecline } =
          await getPopulationData();
        setPopulationData({
          worldPopulation,
          countriesPopulation,
          populationDecline,
        });
      } catch (err) {
        console.error("failed to fetch population data", err);
        setError("Failed to load population data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen min-w-[800px]">
      <nav className="bg-gray-900 flex justify-between items-center p-4 text-white">
        <div className="flex items-center">
          <Globe size={30} />
          <h1 className="text-2xl ml-2">Earth Population</h1>
        </div>
        <div className="italic underline flex gap-2">
          <a href="https://www.worldbank.org/ext/en/home" target="_blank">
            Data source
          </a>
          <a href="https://www.linkedin.com/in/paras-bisht" target="_blank">
            Developed by
          </a>
        </div>
      </nav>
      <main className="w-full h-full">
        <section className="flex p-1 gap-1 sticky top-0 bg-white z-10">
          {sidebarOptions.map((item) => (
            <p
              key={item.id}
              className={`${
                selectedOption === item.id
                  ? "bg-gray-900 text-gray-100"
                  : "text-gray-900"
              } text-lg px-2 py-1 rounded-sm cursor-pointer mb-1 border border-gray-900`}
              onClick={() => setSelectedOption(item.id)}
            >
              {item.title}
            </p>
          ))}
        </section>
        <section className="w-full h-full max-w-[1500px] mx-auto bg-gray-50 overflow-auto">
          {selectedOption === "total-population" && (
            <WorldPopulation data={populationData?.worldPopulation} />
          )}
          {selectedOption === "country-population" && (
            <TopPopulationCountries
              data={populationData?.countriesPopulation}
            />
          )}
          {selectedOption === "population-decline" && (
            <PopulationDeclineByCountry
              data={populationData?.populationDecline}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
