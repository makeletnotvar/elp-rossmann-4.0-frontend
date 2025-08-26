import { useMemo } from "react";

const useEventV2HeatmapSummaryMonthly = (currentYear: number, currentMonth: number): { columnHeaders: string[] } => {
  const daysInMonthCount = new Date(currentYear, currentMonth, 0).getDate();

  const columnHeaders = useMemo(() => {
    return Array.from({ length: daysInMonthCount }, (_, i) => {
      const day = new Date(currentYear, currentMonth, i + 2);
      return day.toISOString().slice(0, 10);
    });
  }, [currentYear, currentMonth, daysInMonthCount]);

  return { columnHeaders };
};

export default useEventV2HeatmapSummaryMonthly;
