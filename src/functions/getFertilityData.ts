import Papa from "papaparse";

const HEADER_INDEX = 4;
const DATA_START_INDEX = 5;
const YEAR_START_INDEX = 4;

export async function getFertilityData() {
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

        console.log(result);
        console.log(data);
      },
      error: (error: any) => {
        console.error("error reading csv", error);
        throw error;
      },
    });
  } catch (error) {
    console.log(error);
  }
}
