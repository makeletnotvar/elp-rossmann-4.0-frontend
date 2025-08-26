export const getGear = (
	speedValue: string,
	speedStates: {
		[key: number]: string;
	}
) => {
	const val = speedValue?.toLowerCase() || '';

	const matchedState = Object.values(speedStates || {})
		.find(state => state.toLowerCase().includes(val.toLowerCase()))
		?.toLowerCase();

	if (!matchedState) return 0;

	const gearMatch = matchedState.match(/(?:bieg\s*(\d+))|(?:\b(\d+)\s*bieg\b)/);
	if (gearMatch) {
		const gear = parseInt(gearMatch[1] || gearMatch[2], 10);
		return Math.min(gear, 3);
	}
	if (matchedState.includes('turbo') || matchedState.includes('wysok') || matchedState.includes('szybk')) {
		return 3;
	}
	if (matchedState.includes('średni') || matchedState.includes('sredni')) {
		return 2;
	}
	if (matchedState.includes('woln') || matchedState.includes('nisk') || matchedState.includes('spokoj') || matchedState.includes('cich')) {
		return 1;
	}

	return 0;
};
