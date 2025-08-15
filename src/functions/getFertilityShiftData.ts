import Papa from "papaparse";

import fertilityLevels from "../assets/data/fertility-levels.json";

export type FertilityShiftData = {
  decade: number;
  [key: string]: number;
};

async function parseCsv(url: string): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const lines = text.split(/\r?\n/);
      const csvData = lines.slice(4).join("\n");

      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getFertilityCategory(rate: number): string {
  // The order of these checks is important to correctly categorize the rates.
  if (rate >= 4.0) return "High Fertility";
  if (rate > 2.1 && rate < 4.0) return "Moderate Fertility";
  if (rate === 2.1) return "Replacement-Level Fertility";
  if (rate < 1.5) return "Extremely Low Fertility";
  if (rate < 2.1) return "Low Fertility";
  return "Unknown"; // Should not be reached if the data is clean
}

export async function getFertilityShiftData(): Promise<FertilityShiftData[]> {
  const fertility = await parseCsv("/data/fertility-rate.csv");
  console.log("Parsed Fertility Shift Data:", fertility);
  console.log("Parsed Fertility Data:", fertility);

  const decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
  const categoryCountsByDecade: Record<number, Record<string, number>> = {};

  decades.forEach((decade) => {
    categoryCountsByDecade[decade] = {};
    fertilityLevels.forEach((level) => {
      categoryCountsByDecade[decade][level.title] = 0;
    });
  });

  fertility.forEach((row: any) => {
    decades.forEach((decade) => {
      const yearStr = decade.toString();
      const rate = parseFloat(row[yearStr]);
      if (!isNaN(rate)) {
        const category = getFertilityCategory(rate);
        if (categoryCountsByDecade[decade][category] !== undefined) {
          categoryCountsByDecade[decade][category]++;
        }
      }
    });
  });

  const result: FertilityShiftData[] = decades.map((decade) => {
    const decadeData: FertilityShiftData = { decade };
    fertilityLevels.forEach((level) => {
      decadeData[level.title] = categoryCountsByDecade[decade][level.title];
    });
    return decadeData;
  });

  return result;
}
