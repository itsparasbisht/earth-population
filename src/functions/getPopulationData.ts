import Papa from "papaparse";

const fetchCSV = async () => {
  const response = await fetch("/data/total-population.csv");
  const csvText = await response.text();

  let headers: string[] = [];
  let data: string[][] = [];

  Papa.parse(csvText, {
    skipEmptyLines: true,
    complete: (result: { data: string[][] }) => {
      headers = result.data[2];
      data = result.data.slice(3);
    },
    error: (error: any) => {
      console.error("error reading csv", error);
    },
  });

  // years array
  const years = headers.slice(4);

  const worldPopulation: { [key: string]: number } = {};
  years.forEach((year) => {
    if (year) {
      worldPopulation[year] = 0;
    }
  });

  data.map((country) => {
    /////////////// total world population by year ///////////////
    country.slice(4).map((population, j) => {
      if (parseInt(population)) {
        worldPopulation[years[j]] += parseInt(population);
      }
    });
    ////////////////////////////////////////////////////////////
  });
  return { worldPopulation };
};

export async function getPopulationData() {
  const { worldPopulation } = await fetchCSV();

  return {
    worldPopulation,
  };
}
