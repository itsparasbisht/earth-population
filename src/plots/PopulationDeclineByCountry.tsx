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
      for (let item of data) generatePlot(item);
    }
  }, [data]);

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-10">
        Top Countries with Declining Populations
      </h2>
      <div className="flex flex-wrap justify-center">
        {data.map((item) => (
          <div id={`${item.country}`} className="w-[450px] h-[450px] p-4"></div>
        ))}
      </div>
    </div>
  );
}

function generatePlot(data: PopulationDecline) {
  let plotEl = document.getElementById(data.country);
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
        showSymbol: true,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color: "black",
        },
        lineStyle: {
          color: "#ff2b6e",
          width: 3,
        },
      },
    ],
    textStyle: {
      color: "black",
      fontFamily: "Merriweather",
    },
  };

  option && plot.setOption(option);
}
