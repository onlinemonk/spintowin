export interface IDonutChartData {
  name: string;
  value: number;
}

export interface ISerieValue<T = number> {
  value: T;
}
export interface ISeries<T = number> {
  name: string;
  tooltip?: string;
  axisId?: string;
  unstacked?: boolean;
  hidden?: boolean;
  decimalPlaces?: number;
  values: ISerieValue<T>[];
}
export interface IBarChartData<T = number> {
  common: string[];
  series: ISeries<T>[];
}
export interface ILineChartData<T = number> {
  common: string[] | number[];
  series: ISeries<T>[];
}
export interface IReferenceLine {
  value: number;
  position: number;
  label: string;
  line: string;
  icon: string;
}
