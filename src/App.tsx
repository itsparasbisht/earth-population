import { useEffect, useState } from "react";
import "./styles/charts.css";
import "./styles/newspaper.css";
import { FertilityData, getFertilityData } from "./functions/getFertilityData";
import {
  getPopulationData,
  PopulationData,
} from "./functions/getPopulationData";
import FertilityByCountry from "./plots/FertilityByCountry";
import PopulationDeclineByCountry from "./plots/PopulationDeclineByCountry";
import PopulationGrowthGrid from "./plots/PopulationGrowthGrid";
import TopPopulationCountries from "./plots/TopPopulationCountries";
import WorldFertility from "./plots/WorldFertility";
import WorldPopulation from "./plots/WorldPopulation";
import FertilityShift from "./plots/FertilityShift";

function App() {
  const [populationData, setPopulationData] = useState<PopulationData>({
    worldPopulation: {},
    countriesPopulation: [],
    populationDecline: [],
  });

  const [fertilityData, setFertilityData] = useState<FertilityData>({
    fertilityByCountry: [],
  });

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

        const { fertilityByCountry } = await getFertilityData();
        setFertilityData({ fertilityByCountry });
      } catch (err) {
        console.error("failed to fetch population data", err);
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
            <div className="font-serif">
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
                Data: <span className="font-bold">World Bank</span>
              </a>
              <a
                href="https://www.linkedin.com/in/paras-bisht"
                target="_blank"
                className="text-gray-600 hover:text-accent transition-colors"
              >
                By <span className="font-bold">Paras Bisht</span>
              </a>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center space-y-6">
            <div className="inline-block">
              <h1 className="font-display text-7xl mb-2">Earth Chronicle</h1>
              <div className="w-full h-[3px] bg-black"></div>
              <div className="w-full h-[1px] bg-black mt-1"></div>
            </div>
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="font-display text-2xl">The Demographics Report</h2>
              <p className="font-serif text-gray-600">
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
                  An overview of global population trends since 1960.
                </p>
              </div>
              <div className="chart-section">
                <WorldPopulation data={populationData?.worldPopulation} />
              </div>
            </section>

            <section className="mb-16 border-column pl-4">
              <h3 className="article-heading">Population Growth Rate</h3>
              <p className="article-subheading">
                An interactive chart of population growth trends.
              </p>
              <div className="chart-section">
                <PopulationGrowthGrid data={populationData?.worldPopulation} />
              </div>
            </section>

            {/* Full-width sections */}
            <section className="mb-16 border-column pl-4">
              <h3 className="article-heading">
                Population Centers of the World
              </h3>
              <p className="article-subheading">
                Examining the distribution of global population across major
                nations.
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
                shifts.
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
                Understanding worldwide fertility rates and their impact.
              </p>
              <div className="chart-section">
                <WorldFertility />
              </div>
            </section>

            <section className="mb-16 border-column pl-4">
              <h3 className="article-heading">
                The Global Shift to Low Fertility
              </h3>
              <p className="article-subheading">
                A visualization of how countries have transitioned between
                fertility levels over the decades.
              </p>
              <div className="chart-section">
                <FertilityShift />
              </div>
            </section>

            <section className="border-column pl-4">
              <h3 className="article-heading">Fertility Rates by Country</h3>
              <p className="article-subheading">
                A detailed look at fertility patterns across nations.
              </p>
              <div className="chart-section">
                <FertilityByCountry data={fertilityData?.fertilityByCountry} />
              </div>
            </section>
          </article>
        </div>
      </main>
      <footer className="text-gray-800 py-8 px-6 bg-[#FFFDF8]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center border-t border-b border-gray-700 py-6 mb-6">
            <h3 className="font-display text-2xl text-gray-900 mb-2">
              Earth Chronicle
            </h3>
            <div className="text-sm font-serif text-center max-w-md">
              <p className="mb-2">
                An in-depth look at global population trends, fertility
                patterns, and demographic shifts.
              </p>
              <p>
                Developed by:{" "}
                <a
                  href="https://www.linkedin.com/in/paras-bisht"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Paras Bisht
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
