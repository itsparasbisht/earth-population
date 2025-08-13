import { useEffect, useState } from "react";
import { Loading } from "./components/ui/loading";
import "./styles/charts.css";
import "./styles/newspaper.css";
import { FertilityData, getFertilityData } from "./functions/getFertilityData";
import {
  getPopulationData,
  PopulationData,
} from "./functions/getPopulationData";
import FertilityByCountry from "./plots/FertilityByCountry";
import PopulationDeclineByCountry from "./plots/PopulationDeclineByCountry";
import TopPopulationCountries from "./plots/TopPopulationCountries";
import WorldFertility from "./plots/WorldFertility";
import WorldPopulation from "./plots/WorldPopulation";

function App() {
  const [populationData, setPopulationData] = useState<PopulationData>({
    worldPopulation: {},
    countriesPopulation: [],
    populationDecline: [],
  });

  const [fertilityData, setFertilityData] = useState<FertilityData>({
    fertilityByCountry: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { worldPopulation, countriesPopulation, populationDecline } =
          await getPopulationData();
        setPopulationData({
          worldPopulation,
          countriesPopulation,
          populationDecline,
        });

        const { fertilityByCountry } = await getFertilityData();
        setFertilityData({ fertilityByCountry });
      } catch (err) {
        console.error("failed to fetch population data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen min-w-[900px] min-h-[700px] bg-background text-foreground">
      <header className="border-b border-gray-200 pt-8 pb-12 px-6 bg-gradient-to-b from-white to-[#FFFDF8]">
        <div className="max-w-[1500px] mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10 text-xs tracking-wide">
            <div className="font-lora">
              VOLUME I, NO. 1 •{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex gap-6 uppercase">
              <a
                href="https://databank.worldbank.org"
                target="_blank"
                className="text-gray-600 hover:text-accent transition-colors"
              >
                Data: World Bank
              </a>
              <a
                href="https://www.linkedin.com/in/paras-bisht"
                target="_blank"
                className="text-gray-600 hover:text-accent transition-colors"
              >
                By Paras Bisht
              </a>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center space-y-6">
            <div className="inline-block">
              <h1 className="font-abril text-7xl mb-2">Earth Chronicle</h1>
              <div className="w-full h-[3px] bg-black"></div>
              <div className="w-full h-[1px] bg-black mt-1"></div>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="font-abril text-2xl">The Demographics Report</h2>
              <p className="font-lora text-gray-600">
                An in-depth examination of global population trends, fertility
                patterns, and demographic shifts shaping our world's future
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full bg-[#FFFDF8] min-h-screen pb-16">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <article>
            {/* Lead Article */}
            <section className="mb-16">
              <div className="border-l-2 border-accent pl-6 mb-8">
                <h2 className="article-heading">
                  Global Population at a Glance
                </h2>
                <p className="article-subheading">
                  A comprehensive analysis of worldwide population trends and
                  their implications for our future
                </p>
              </div>
              <div className="chart-section">
                <WorldPopulation data={populationData?.worldPopulation} />
              </div>
            </section>

            {/* Full-width sections */}
            <section className="mb-16 border-column pl-4">
              <h3 className="article-heading">
                Population Centers of the World
              </h3>
              <p className="article-subheading">
                Examining the distribution of global population across major
                nations
              </p>
              <div className="chart-section">
                <TopPopulationCountries
                  data={populationData?.countriesPopulation}
                />
              </div>
            </section>

            <section className="mb-16 border-column pl-4">
              <h3 className="article-heading">Population Decline Trends</h3>
              <p className="article-subheading">
                Investigating regions experiencing significant demographic
                shifts
              </p>
              <div className="chart-section">
                <PopulationDeclineByCountry
                  data={populationData?.populationDecline}
                />
              </div>
            </section>

            <section className="mb-16 border-column pl-4">
              <h3 className="article-heading">Global Fertility Analysis</h3>
              <p className="article-subheading">
                Understanding worldwide fertility rates and their impact
              </p>
              <div className="chart-section">
                <WorldFertility />
              </div>
            </section>

            <section className="border-column pl-4">
              <h3 className="article-heading">Fertility Rates by Country</h3>
              <p className="article-subheading">
                A detailed look at fertility patterns across nations
              </p>
              <div className="chart-section">
                <FertilityByCountry data={fertilityData?.fertilityByCountry} />
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}

export default App;
