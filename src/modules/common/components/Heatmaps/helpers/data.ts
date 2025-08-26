export const getHourlyValue = (data: [string, number][], date: string) => {
	const foundValue = data.find(([datetime]) => {
		const dateA = new Date(datetime);
		const dateB = new Date(date);
		return (
			dateA.getFullYear() === dateB.getFullYear() &&
			dateA.getMonth() === dateB.getMonth() &&
			dateA.getDate() === dateB.getDate() &&
			dateA.getHours() === dateB.getHours() &&
			dateA.getMinutes() === dateB.getMinutes()
		);
	});

	return foundValue || null;
};

export const getDailyValue = (data: [string, number][], date: string) => {
	const foundValue = data.find(([datetime]) => {
		const dateA = new Date(datetime);
		const dateB = new Date(date);
		return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
	});
	return foundValue || null;
};
