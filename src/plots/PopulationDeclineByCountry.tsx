import { PopulationDecline } from "@/functions/getPopulationData";
import { formatBigNumber } from "../utils/formatter";
import * as echarts from "echarts";
import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { InfoIcon } from "lucide-react";

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold py-5">
          Top Countries with Declining Populations
        </h2>
        <Popover>
          <PopoverTrigger className="flex gap-2 bg-gray-900 text-white p-2 rounded-sm hover:bg-gray-700">
            <InfoIcon /> Major Observations
          </PopoverTrigger>
          <PopoverContent className="w-[600px] bg-gray-800 text-white border-0">
            <p className="m-2 flex flex-col">
              <span className="text-lg font-semibold">
                - Ukraine: Sharpest Population Decline
              </span>
              Ukraine shows the most significant population decline of -13.34%,
              likely driven by a combination of factors such as conflict,
              economic instability, and emigration trends. The ongoing
              geopolitical tensions and war are significant contributors to this
              sharp decrease.
            </p>
            <p className="m-2 flex flex-col">
              <span className="text-lg font-semibold">
                - Japan: Largest Population with Declining Growth
              </span>
              Japan, with 128 million people, is the most populous country in
              the dataset. Despite its size, the country is facing a population
              decline due to a low birth rate, an aging population, and limited
              immigration policies.
            </p>
            <p className="m-2 flex flex-col">
              <span className="text-lg font-semibold">
                - Eastern European Trends
              </span>
              Countries such as Bulgaria, Latvia, and Lithuania display notable
              population decreases, a trend common across Eastern Europe. These
              declines are often due to high rates of emigration to Western
              Europe, combined with low birth rates.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap justify-center">
        {data.map((item) => (
          <div
            key={item.country}
            id={`${item.country}`}
            className="w-[450px] h-[450px] p-4"
          ></div>
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
