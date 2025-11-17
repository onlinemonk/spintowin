import { useState } from "react";

export const useSelectedSeries = ({
  onSeriesSelected,
  allowMultipleSelection = false,
}: {
  onSeriesSelected?: (series: string[]) => void;
  allowMultipleSelection?: boolean;
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [hoveredSeries, setHoveredSeries] = useState("");

  const handleSeriesSelected = (series: string) => {
    setSelectedSeries((selected) => {
      const newValue = allowMultipleSelection
        ? selected.includes(series)
          ? selected.filter((s) => s !== series)
          : [...selected, series]
        : selected.length && selected[0] === series
        ? []
        : [series];
      if (onSeriesSelected) {
        onSeriesSelected(newValue);
      }
      return newValue;
    });
  };

  const handleSeriesHovered = (series: string) => {
    if (!selectedSeries.length || selectedSeries.includes(series)) {
      setHoveredSeries(series);
    }
  };

  const handleSeriesUnhovered = () => {
    setHoveredSeries("");
  };

  return {
    selectedSeries,
    hoveredSeries,
    handleSeriesSelected,
    handleSeriesHovered,
    handleSeriesUnhovered,
  };
};
