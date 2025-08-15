import { useEffect, useState } from "react";
import * as echarts from "echarts";
import {
  getFertilityShiftData,
  FertilityShiftData,
} from "../functions/getFertilityShiftData";
import fertilityLevels from "../assets/data/fertility-levels.json";
import { Loading } from "../components/ui/loading";

export default function FertilityShift() {
  const [data, setData] = useState<FertilityShiftData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFertilityShiftData()
      .then((res) => {
        console.log("Fertility Shift Data:", res);
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data) {
      const chartDom = document.getElementById("fertility-shift-chart");
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          title: {
            text: "The Global Shift to Low Fertility",
            left: "center",
            textStyle: {
              fontFamily: "Abril Fatface",
              fontSize: 24,
              color: "#333",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: { backgroundColor: "#6a7985" },
            },
            textStyle: { fontFamily: "Lora" },
          },
          legend: {
            data: fertilityLevels.map((l) => l.title),
            bottom: 0,
            textStyle: { fontFamily: "Lora" },
          },
          grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: data.map((d) => d.decade),
              axisLabel: { fontFamily: "Lora" },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "Number of Countries",
              nameTextStyle: { fontFamily: "Lora" },
              axisLabel: { fontFamily: "Lora" },
            },
          ],
          series: fertilityLevels.map((level) => ({
            name: level.title,
            type: "line",
            stack: "Total",
            areaStyle: { color: level["bg-color"] },
            emphasis: { focus: "series" },
            data: data.map((d) => d[level.title]),
            smooth: true,
            lineStyle: { width: 0 },
            itemStyle: { color: level["bg-color"] },
          })),
        };
        myChart.setOption(option);
      }
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <div
        id="fertility-shift-chart"
        style={{ width: "100%", height: "500px" }}
      ></div>
      <div className="font-serif text-[15px] leading-relaxed mt-4">
        <h4 className="font-display text-xl mb-3">Key Findings</h4>

        <div className="font-serif border-l-2 border-accent pl-4 mb-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            This chart dramatically visualizes the global shift towards lower
            fertility over the last 60 years. In 1960, a vast majority of
            countries had high fertility rates. Decade by decade, a growing
            number of nations have transitioned into moderate, low, and even
            extremely low fertility brackets. This trend underscores one of the
            most significant demographic shifts in human history, with profound
            implications for future population growth, aging, and economic
            development.
          </p>
        </div>
      </div>
    </div>
  );
}
