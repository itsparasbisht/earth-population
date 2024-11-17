import Papa from "papaparse";

type PopulationData = {
  worldPopulation: { [key: string]: number };
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
        console.log(result.data);
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

    // calculate world population
    data.forEach((country) => {
      country.slice(YEAR_START_INDEX).forEach((population, index) => {
        const year = years[index];
        const populationValue = parseInt(population, 10);
        console.log(year, populationValue);
        if (!isNaN(populationValue)) {
          worldPopulation[year] += populationValue;
        }
      });
    });

    console.log(">>>", worldPopulation);

    return { worldPopulation };
  } catch (error) {
    console.error("failed to fetch and process CSV", error);
    throw error;
  }
}
