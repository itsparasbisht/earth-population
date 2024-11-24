import Papa from "papaparse";

export type CountryPopulation = {
  country: string;
  code: string;
  population: number;
};

export type PopulationDeclineEntry = {
  year: number;
  decline: number;
};

export type PopulationDecline = {
  country: string;
  code: string;
  data: PopulationDeclineEntry[];
};

export type PopulationData = {
  worldPopulation: { [key: string]: number };
  countriesPopulation: CountryPopulation[];
  populationDecline: PopulationDecline[];
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

    // initialize populationDecline
    let populationDecline: PopulationDecline[] = [];

    data.forEach((countryRow) => {
      // calculate world population by year
      countryRow.slice(YEAR_START_INDEX).forEach((population, index) => {
        const year = years[index];
        const populationValue = parseInt(population, 10);
        if (!isNaN(populationValue)) {
          worldPopulation[year] += populationValue;
        }
      });

      // calculate country population
      const countryName = countryRow[0];
      const countryCode = countryRow[1];
      let mostRecentPopulation = parseInt(
        countryRow[countryRow.length - 1],
        10
      );

      if (countryName && countryCode && !isNaN(mostRecentPopulation)) {
        countriesPopulation.push({
          country: countryName,
          code: countryCode,
          population: mostRecentPopulation,
        });
      }

      // calculate population decline since 2000

      // calculate the starting index for the year 2000
      const year2000Index = years.findIndex(
        (year) => parseInt(year, 10) === 2000
      );
      if (year2000Index === -1) {
        throw new Error("year 2000 is missing in the dataset headers");
      }

      let populationDeclineData = countryRow
        .slice(YEAR_START_INDEX + year2000Index)
        .map((population, index) => {
          const year = years[index + year2000Index];

          const previousYearPopulation = parseInt(
            countryRow[YEAR_START_INDEX + year2000Index + index - 1],
            10
          );
          const currentYearPopulation = parseInt(population, 10);

          if (isNaN(previousYearPopulation) || isNaN(currentYearPopulation)) {
            return null;
          }

          const changeInPopulation =
            ((currentYearPopulation - previousYearPopulation) /
              previousYearPopulation) *
            100;

          return changeInPopulation < 0
            ? {
                year: parseInt(year, 10),
                decline: parseFloat(changeInPopulation.toFixed(2)),
              }
            : null;
        })
        .filter((item): item is PopulationDeclineEntry => item !== null);

      if (populationDeclineData.length > 0) {
        populationDecline.push({
          country: countryName,
          code: countryCode,
          data: populationDeclineData,
        });
      }

      // sort by the number of decline entries and take the top 25
      populationDecline.sort((a, b) => b.data.length - a.data.length);
      populationDecline = populationDecline.slice(0, 25);
    });

    console.log("country", populationDecline);

    return { worldPopulation, countriesPopulation, populationDecline };
  } catch (error) {
    console.error("failed to fetch and process CSV", error);
    throw error;
  }
}
