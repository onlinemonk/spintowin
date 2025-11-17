import { IBarChartData, ILineChartData } from "./types/charts";

export const useChartHelpers = () => {
  const isMonthValue = (val: string) => {
    return (
      [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ].filter((s) => /\d/.test(val) && val.toLowerCase().indexOf(s) > -1)
        .length > 0
    );
  };

  const getColor = (index: number, customColors?: string[]) => {
    const defaultColors = [
      "#878787",
      "#976cf4",
      "#23969a",
      "#c86f6d",
      "#242424",
      "#b98327",
      "#8087ad",
      "#e75fa0",
      "#3e0da9",
      "#9b3213",
      "#5b85d0",
      "#4d0c2b",
      "#d82177",
      "#0c3b35",
      "#7695b0",
      "#74132a",
      "#3e4461",
      "#cf4219",
      "#5b4013",
      "#bd1f44",
    ];
    // : [
    //     "#6a6a6a",
    //     "#BA9EF8",
    //     "#74DCDF",
    //     "#F2AF99",
    //     "#ffffff",
    //     "#FCF5A3",
    //     "#A6ABC6",
    //     "#EA9FC5",
    //     "#7E4AF2",
    //     "#E24F72",
    //     "#82B6DE",
    //     "#C86F6D",
    //     "#1D797C",
    //     "#D84B92",
    //     "#7695B0",
    //     "#EB7F5D",
    //     "#68709E",
    //     "#F9EC51",
    //     "#E9C5C4",
    //     "#D2234B",
    //   ];
    const colors = [...(customColors || []), ...defaultColors];
    return colors[index % colors.length];
  };

  const barChartDataAsRechartsData = <T = number,>(
    data: IBarChartData<T> | ILineChartData<T>,
    selectedSeries: string[]
  ) => {
    return data.common.map((d, index) => ({
      name: d,
      ...data.series
        .filter(
          (s) => !selectedSeries.length || selectedSeries.includes(s.name)
        )
        .reduce(
          (obj, s) => ({
            ...obj,
            [s.name]: s.values[index].value,
          }),
          {}
        ),
    }));
  };

  return { getColor, barChartDataAsRechartsData, isMonthValue };
};
