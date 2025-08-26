export function getColor(colors: string[], _value: number, minValue: number, maxValue: number): string {
	let value = _value;

	if (value >= maxValue) {
		value = maxValue;
	}

	if (value < minValue) {
		value = minValue;
	}

	const colorCount = colors.length - 1;
	const step = (maxValue - minValue) / colorCount;
	const index = Math.min(Math.floor((value - minValue) / step) || 1, colorCount);
	return colors[index];
}
