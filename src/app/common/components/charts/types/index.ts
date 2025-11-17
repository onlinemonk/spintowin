import React from "react";
import { IBarChartData } from "./charts";

export interface IPayload<T = string | number | object> {
  dataKey: string;
  color: string;
  value: number;
  payload?: {
    name: string;
    [seriesName: string]: T | string;
  };
}

export interface ICustomTooltipProps<T> {
  payload?: IPayload<T>[];
  label?: string | number;
  active?: boolean;
}

export interface IBarChart<T = number, P = object> {
  data: IBarChartData<T>;
  valueSelector?: (value: T) => number;
  height?: number;
  unitOfMeasure: string;
  stacked?: boolean;
  barSize?: number;
  customColors?: string[];
  customBarColorPicker?: (key: string) => string;
  changeColorOnEachBar?: boolean;
  hideLegend?: boolean;
  hideUnitOfMeasure?: boolean;
  yAxisMax?: number;
  multipleSeriesSelection?: boolean;
  onSeriesSelected?: (series: string[]) => void;
  disableLegends?: boolean;
  style?: React.CSSProperties;
  customTooltip?: React.ComponentType<{
    props: ICustomTooltipProps<T>;
    units: string[];
    customProps?: P;
  }>;
  customTooltipProps?: P;
}
