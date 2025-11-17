import { useCallback, useState } from "react";
import { Cell, Legend, Pie, PieChart } from "recharts";
import { useChartHelpers } from "../chart-helpers";
import "./style.scss";
import { IDonutChartData } from "../types/charts";
import { roundNumberToDecimals } from "@/app/common/utils/numbers";

const DonutChart = ({
  data,
  unitOfMeasure,
  valueDecimals = 0,
  size = 1,
  hideLegends,
}: {
  data: IDonutChartData[];
  unitOfMeasure?: string;
  onSeriesSelected?: (label: string) => void;
  valueDecimals?: number;
  size?: number;
  hideLegends?: boolean;
}) => {
  const { getColor } = useChartHelpers();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedSeries] = useState("");

  const onPieEnter = useCallback(
    (_: unknown, index: number) => {
      if (!selectedSeries) {
        setActiveIndex(index);
      }
    },
    [selectedSeries]
  );
  const onPieLeave = useCallback(() => {
    if (!selectedSeries) {
      setActiveIndex(-1);
    }
  }, [selectedSeries]);

  const getCenterValue = () => {
    if (selectedSeries) {
      return data
        .filter((d) => d.name === selectedSeries)
        .reduce((sum, element) => sum + element.value, 0);
    } else if (activeIndex >= 0) {
      const activeData = data.filter((d) =>
        selectedSeries ? d.name === selectedSeries : d
      )[activeIndex];
      return activeData?.value || 0;
    } else {
      return data.reduce((sum, element) => sum + element.value, 0);
    }
  };

  const getCenterLabel = () => {
    if (selectedSeries) return selectedSeries;
    if (activeIndex >= 0) {
      const activeData = data.filter((d) =>
        selectedSeries ? d.name === selectedSeries : d
      )[activeIndex];
      return activeData?.name || "";
    }
    return "";
  };

  return (
    <div style={{ position: "relative", height: "99%" }}>
      <PieChart
        responsive
        height="99%"
        onMouseLeave={() => !selectedSeries && setActiveIndex(-1)}
      >
        {!hideLegends && <Legend />}
        <Pie
          data={data
            .filter((d) => (selectedSeries ? d.name === selectedSeries : d))
            .map((d) => ({
              ...d,
              value: selectedSeries && d.value === 0 ? 1 : d.value,
            }))} // force a value when 0 otherwise nothing is rendered
          innerRadius={80 * size}
          outerRadius={100 * size}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          cx="50%"
          cy="50%"
        >
          {data
            .filter((d) => (selectedSeries ? d.name === selectedSeries : d))
            .map((d, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  selectedSeries
                    ? getColor(
                        data.findIndex((item) => item.name === selectedSeries)
                      )
                    : getColor(
                        selectedSeries
                          ? data.findIndex((item) => item.name === d.name)
                          : index
                      )
                }
                opacity={activeIndex >= 0 && activeIndex !== index ? 0.2 : 1}
              />
            ))}
        </Pie>
      </PieChart>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: `${28 * size}px`, fontWeight: "bold" }}>
          {roundNumberToDecimals(getCenterValue(), valueDecimals)}
        </div>
        <div style={{ fontSize: `${16 * size}px`, color: "#666" }}>
          {unitOfMeasure}
        </div>
        {getCenterLabel() && (
          <div
            style={{ fontSize: `${16 * size}px`, marginTop: `${8 * size}px` }}
          >
            {getCenterLabel()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
