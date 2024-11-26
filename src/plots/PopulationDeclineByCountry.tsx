import { PopulationDecline } from "@/functions/getPopulationData";
import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect } from "react";

type PopulationDeclineProps = {
  data: PopulationDecline[];
};

export default function PopulationDeclineByCountry({
  data,
}: PopulationDeclineProps) {
  useEffect(() => {
    if (data) {
      generatePlot(data[0]);
    }
  }, [data]);

  return (
    <div className="w-full h-full p-4">
      <div id="countries-population" className="w-full h-[80%] p-4"></div>
    </div>
  );
}

function generatePlot(data: PopulationDecline) {
  let plotEl = document.getElementById("countries-population");
  let plot = echarts.init(plotEl);

  const yearList = data.data.map((entry) => entry.year);
  const populationList = data.data.map((entry) => entry.population);
  const declineList = data.data.map((entry) => entry.decline);

  let option = {
    title: {
      show: true,
      left: "right",
      text: data.country,
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const year = yearList[dataIndex];
        const population = populationList[dataIndex];
        const decline = declineList[dataIndex];
        return `
          <b>Year:</b> ${year}<br/>
          <b>Population:</b> ${formatBigNumber(population, 0)}<br/>
          <b>Decline:</b> ${decline.toFixed(2)}%
        `;
      },
    },
    xAxis: {
      type: "category",
      data: yearList,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: function (value: number) {
          return formatBigNumber(value, 0, "short");
        },
      },
    },
    series: [
      {
        data: populationList,
        type: "line",
        smooth: true,
      },
    ],
  };

  option && plot.setOption(option);
}
