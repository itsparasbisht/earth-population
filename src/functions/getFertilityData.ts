import Papa from "papaparse";

const HEADER_INDEX = 4;
const DATA_START_INDEX = 5;
const YEAR_START_INDEX = 4;

export type FertilityEntry = {
  country: string;
  code: string;
  fertility: number;
};

export type FertilityData = {
  fertilityByCountry: FertilityEntry[];
};

export async function getFertilityData(): Promise<FertilityData> {
  try {
    const response = await fetch("src/assets/data/fertility-rate.csv");
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

    // determine latest fertility rate for all countries
    let fertilityByCountry: FertilityEntry[] = [];

    data.map((item: string[]) => {
      const countryName = item[0];
      const code = item[1];
      const latestFertility = parseFloat(item[item.length - 1]);

      if (latestFertility) {
        fertilityByCountry.push({
          country: countryName,
          code,
          fertility: latestFertility,
        });
      }
    });

    return { fertilityByCountry };
  } catch (error) {
    console.error("failed to fetch and process CSV", error);
    throw error;
  }
}
