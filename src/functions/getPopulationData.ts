import Papa from "papaparse";

export type CountryPopulation = {
  country: string;
  code: string;
  population: number;
};

export type PopulationData = {
  worldPopulation: { [key: string]: number };
  countriesPopulation: CountryPopulation[];
};

const HEADER_INDEX = 4;
const DATA_START_INDEX = 5;
const YEAR_START_INDEX = 4;

export async function getPopulationData(): Promise<PopulationData> {
  try {
    const response = await fetch("/data/total-population.csv");
    const csvText = await response.text();

    let headers: string[] = [];
    let data: string[][] = [];

    Papa.parse(csvText, {
      skipEmptyLines: true,
      complete: (result: { data: string[][] }) => {
        headers = result.data[HEADER_INDEX];
        data = result.data.slice(DATA_START_INDEX);
      },
      error: (error: any) => {
        console.error("error reading csv", error);
        throw error;
      },
    });

    if (!headers || headers.length <= YEAR_START_INDEX) {
      throw new Error("CSV headers are malformed or missing");
    }
    if (!data.length) {
      throw new Error("CSV data is empty");
    }

    // extract years and initialize worldPopulation
    const years = headers.slice(YEAR_START_INDEX);
    const worldPopulation: { [key: string]: number } = years.reduce(
      (acc, year) => {
        if (year) acc[year] = 0;
        return acc;
      },
      {} as { [key: string]: number }
    );

    // initialize countriesPopulation
    const countriesPopulation: CountryPopulation[] = [];

    data.forEach((country) => {
      // calculate world population
      country.slice(YEAR_START_INDEX).forEach((population, index) => {
        const year = years[index];
        const populationValue = parseInt(population, 10);
        if (!isNaN(populationValue)) {
          worldPopulation[year] += populationValue;
        }
      });

      // calculate country population
      const countryName = country[0];
      const countryCode = country[1];
      let countryPopulation = parseInt(country[country.length - 1], 10);

      if (countryName && countryCode && !isNaN(countryPopulation)) {
        countriesPopulation.push({
          country: countryName,
          code: countryCode,
          population: countryPopulation,
        });
      }
    });

    // console.log("country", countriesPopulation);

    return { worldPopulation, countriesPopulation };
  } catch (error) {
    console.error("failed to fetch and process CSV", error);
    throw error;
  }
}
