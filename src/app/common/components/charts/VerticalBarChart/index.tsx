import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useChartHelpers } from "../chart-helpers";
import { useSelectedSeries } from "../selected-series";
import { ChartTooltip } from "../tooltip";
import { IBarChart } from "../types";
import "./style.scss";

const VerticalBarChart = <T = number, P = object>({
  data,
  valueSelector,
  height,
  unitOfMeasure,
  stacked,
  barSize = 6,
  customColors,
  customBarColorPicker,
  changeColorOnEachBar,
  hideLegend = false,
  hideUnitOfMeasure = false,
  yAxisMax,
  multipleSeriesSelection = false,
  onSeriesSelected,
  style,
}: IBarChart<T, P>) => {
  const { selectedSeries, hoveredSeries } = useSelectedSeries({
    onSeriesSelected,
    allowMultipleSelection: multipleSeriesSelection,
  });
  const { getColor, barChartDataAsRechartsData, isMonthValue } =
    useChartHelpers();

  return (
    <BarChart
      layout={"horizontal"}
      responsive
      height={height || 100}
      stackOffset="sign"
      data={barChartDataAsRechartsData(data, selectedSeries)}
      margin={
        //  TODO: -55 is not hiding the ticks just forcing graph to left alignment
        {
          top: hideUnitOfMeasure ? 0 : 40,
          left: hideLegend && hideUnitOfMeasure ? -55 : hideLegend ? -10 : 0,
          right: 0,
        }
      }
    >
      <Tooltip
        cursor={{ fill: "transparent" }}
        content={(props) => <ChartTooltip props={props} units={["Count"]} />}
      />
      <CartesianGrid horizontal={true} vertical={false} />
      {!hideLegend && <Legend />}
      <XAxis
        tickLine={false}
        axisLine={false}
        tick={true}
        dataKey={"name"}
        type={"category"}
        domain={[0, (dataMax: number) => dataMax]}
        interval={"preserveStartEnd"}
        tickFormatter={(val: string) => {
          let formatted = val;
          if (
            formatted &&
            isMonthValue(formatted) &&
            isFinite(Number(formatted))
          ) {
            formatted = format(new Date(val), "MMM yy");
          }
          return formatted;
        }}
      ></XAxis>
      <YAxis
        tickLine={false}
        axisLine={false}
        type={"number"}
        domain={["auto", (dataMax: number) => (yAxisMax ? yAxisMax : dataMax)]}
        interval="preserveStartEnd"
        minTickGap={0}
      ></YAxis>
      {data.series.map((s, index) => (
        <Bar
          isAnimationActive={false}
          opacity={hoveredSeries ? (s.name === hoveredSeries ? 1 : 0.2) : 1}
          key={s.name}
          dataKey={
            valueSelector ? (item) => valueSelector(item[s.name]) : s.name
          }
          stackId={stacked && !s.unstacked ? "stacked" : undefined}
          barSize={barSize}
          fill={getColor(index, customColors)}
          style={style}
        >
          {stacked &&
            data.common.map((c) => {
              return <Cell key={c + s.name} />;
            })}
          {!stacked &&
            changeColorOnEachBar &&
            data.common.map((c, index) => (
              <Cell
                key={c}
                fill={
                  customBarColorPicker
                    ? customBarColorPicker(c)
                    : getColor(index, customColors)
                }
              />
            ))}
        </Bar>
      ))}
    </BarChart>
  );
};

export default VerticalBarChart;
