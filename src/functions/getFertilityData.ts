import Papa from "papaparse";

const HEADER_INDEX = 4;
const DATA_START_INDEX = 5;
const YEAR_START_INDEX = 4;

export type FertilityEntry = {
  year: number;
  fertility: number;
};

export type FertilityDecline = {
  country: string;
  code: string;
  data: FertilityEntry[];
};

export type FertilityData = {
  fertilityDecline: FertilityDecline[];
};

export async function getFertilityData(): Promise<FertilityData> {
  try {
    const response = await fetch("/data/fertility-rate.csv");
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

    // determine countries below replacement-level fertility
    let fertilityDecline: FertilityDecline[] = [];

    const years = headers.slice(YEAR_START_INDEX);

    data.forEach((countryRow) => {
      const countryName = countryRow[0];
      const countryCode = countryRow[1];

      let fertilityDeclineData = countryRow
        .slice(YEAR_START_INDEX)
        .map((fertility, index) => {
          const year = years[index];

          const currentYearFertility = parseInt(fertility, 10);

          if (isNaN(currentYearFertility)) {
            return null;
          }

          return currentYearFertility < 1.5
            ? {
                year: parseInt(year, 10),
                fertility: parseFloat(fertility),
              }
            : null;
        })
        .filter((item): item is FertilityEntry => item !== null);

      if (fertilityDeclineData.length > 0) {
        fertilityDecline.push({
          country: countryName,
          code: countryCode,
          data: fertilityDeclineData,
        });
      }
    });

    return { fertilityDecline };
  } catch (error) {
    console.error("failed to fetch and process CSV", error);
    throw error;
  }
}
