import { useMemo } from 'react';

interface RowSummary {
	[header: string]: number;
}

const useRowSummary = (data: EventHeatmaps[], rowHeaders: string[], type: 'HOURLY' | 'DAILY'): RowSummary => {
	return useMemo(() => {
		const totalSum = data.reduce((acc, [, value]) => acc + value, 0);
		const calculatePercentage = (filteredData: EventHeatmaps[]): number => {
			const sum = filteredData.reduce((acc, [, value]) => acc + value, 0);
			return totalSum !== 0 ? (sum / totalSum) * 100 : 0;
		};
		const rowSummaryData = Object.fromEntries(
			rowHeaders.map(header => {
				if (type === 'HOURLY') {
					const filteredData = data.filter(([datetime]) => {
						const hour = new Date(datetime).getHours();
						return header === `${hour.toString().padStart(2, '0')}:00`;
					});
					return [header, calculatePercentage(filteredData)];
				} else {
					const filteredData = data.filter(([datetime]) => {
						const day = new Date(datetime).getDay();
						return header === rowHeaders[day];
					});
					return [header, calculatePercentage(filteredData)];
				}
			})
		);

		return rowSummaryData;
	}, [data, rowHeaders, type]);
};

export default useRowSummary;
