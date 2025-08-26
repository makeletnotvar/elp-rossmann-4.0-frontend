import React, { useMemo } from 'react';
import { HEATMAP_DEFAULT_COLORS } from '../constants/colors';
import { getColor } from '../helpers/getColor';

export type UseHeatmapDataProps = {
	data: EventHeatmaps[];
	minValue?: number;
	maxValue?: number;
};

export const useHeatmapData = (props: UseHeatmapDataProps) => {
	const { data, minValue: inputMinValue, maxValue: inputMaxValue } = props;

	const min = useMemo(() => Math.min(...data.map(([, value]) => value)), [data]);
	const max = useMemo(() => Math.max(...data.map(([, value]) => value)), [data]);

	const getPointColor = React.useCallback(
		(value: number) => {
			const minValue = inputMinValue !== undefined ? inputMinValue : min;
			const maxValue = inputMaxValue !== undefined ? inputMaxValue : max;
			return getColor(HEATMAP_DEFAULT_COLORS, value, minValue, maxValue);
		},
		[inputMinValue, inputMaxValue, min, max]
	);

	return {
		data,
		min,
		max,
		getPointColor,
	};
};
