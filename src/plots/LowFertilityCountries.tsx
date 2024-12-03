import { FertilityDecline, FertilityEntry } from "@/functions/getFertilityData";
import * as echarts from "echarts";
import { useEffect } from "react";

type FertilityDeclineProps = {
  data: FertilityDecline[];
};

export default function LowFertilityCountries({ data }: FertilityDeclineProps) {
  console.log(data);

  useEffect(() => {
    if (data) {
      let years: number[] = [];
      for (let i = 1960; i <= 2022; i++) {
        years.push(i);
      }

      const plotData = data.map((item: FertilityDecline) => {
        const countryName = item.country;

        const fertilityArr = years.map((year) => {
          const axisYear = year;
          let fertility;

          const index = item.data.findIndex((item) => item.year === axisYear);

          if (index > -1) {
            fertility = item.data[index].fertility;
          } else {
            fertility = "-";
          }

          return fertility;
        });

        return {
          name: countryName,
          type: "line",
          stack: "Total",
          data: fertilityArr,
        };
      });

      console.log(plotData);

      if (plotData.length > 0) generatePlot(years, plotData);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <div
        id="fertility-decline"
        className="w-full min-w-[600px] h-[85%] max-h-[800px] p-4"
      ></div>
    </div>
  );
}

function generatePlot(years: any, plotData: any) {
  let plotEl = document.getElementById("fertility-decline");
  let plot = echarts.init(plotEl);

  let option = {
    title: {
      text: "Stacked Line",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: plotData.map((item) => item.name),
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: years,
    },
    yAxis: {
      type: "value",
    },
    series: plotData,
  };

  option && plot.setOption(option);
}
