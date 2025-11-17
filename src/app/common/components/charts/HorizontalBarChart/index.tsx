import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { useChartHelpers } from "../chart-helpers";
import { ChartTooltip } from "../tooltip";
import { useSelectedSeries } from "../selected-series";
import { IBarChart } from "../types";

const HorizontalBarChart = <T = number, P = object>({
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
  customTooltip,
  customTooltipProps,
}: IBarChart<T, P>) => {
  const { selectedSeries, hoveredSeries } = useSelectedSeries({
    onSeriesSelected,
    allowMultipleSelection: multipleSeriesSelection,
  });

  const { getColor, barChartDataAsRechartsData } = useChartHelpers();
  return (
    <BarChart
      layout={"vertical"}
      responsive
      height={height || 100}
      data={barChartDataAsRechartsData(data, selectedSeries)}
      margin={{
        top: 0,
        left: -55,
        right: 60,
        bottom: !hideUnitOfMeasure ? 10 : 0,
      }}
    >
      <Tooltip
        cursor={{ fill: "transparent" }}
        content={(props) => {
          const TooltipComponent = customTooltip || ChartTooltip;
          return (
            <TooltipComponent
              props={props}
              units={[unitOfMeasure]}
              customProps={customTooltipProps}
            />
          );
        }}
      />
      <CartesianGrid vertical={true} horizontal={false} />
      {!hideLegend && <Legend />}
      <XAxis
        orientation={"bottom"}
        xAxisId={"bottom"}
        tickLine={false} //eds alignment
        axisLine={false} //eds alignment
        tick={true}
        type={"number"}
        domain={[0, (dataMax: number) => (yAxisMax ? yAxisMax : dataMax)]}
        interval={"preserveStartEnd"}
        padding={{ right: 8, left: 0 }}
      >
        {!hideUnitOfMeasure && (
          <Label
            value={unitOfMeasure}
            dy={10}
            dx={30}
            position="insideBottomRight"
          />
        )}
      </XAxis>
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={false}
        dataKey={"name"}
        type={"category"}
        domain={[0, (dataMax: number) => dataMax]}
        interval="preserveStartEnd"
        minTickGap={20}
      ></YAxis>
      {data.series.map((s, index) => (
        <Bar
          xAxisId={"bottom"}
          isAnimationActive={false}
          opacity={hoveredSeries ? (s.name === hoveredSeries ? 1 : 0.2) : 1}
          key={s.name}
          dataKey={
            valueSelector ? (item) => valueSelector(item[s.name]) : s.name
          }
          barSize={barSize}
          fill={getColor(index, customColors)}
          style={style}
        >
          <LabelList
            dataKey="name"
            content={({ x, y, value }) => (
              <text
                x={typeof x === "number" ? x + 4 : 4} // left edge of the bar
                y={typeof y === "number" ? y - 6 : 0} // above the bar (adjust -6 as needed for spacing)
                fill="#fff"
                fontSize={14}
                alignmentBaseline="baseline"
                textAnchor="start"
              >
                {value}
              </text>
            )}
          />
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

export default HorizontalBarChart;
