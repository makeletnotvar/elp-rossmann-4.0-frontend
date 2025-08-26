type PointLineTypes = {
	[pointType in PointType]: any;
};

export function getChartLineType(pointType: PointType): any {
	const DEFAULT_LINE_TYPE = 'basis';
	const types: PointLineTypes = {
		enum: 'stepAfter',
		numeric: 'step',
	};
	return types[pointType] || DEFAULT_LINE_TYPE;
}
