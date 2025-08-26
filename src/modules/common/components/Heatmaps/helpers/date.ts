const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
	timeZone: 'Europe/Warsaw',
};

export const generateDateHourly = (year: number, month: number, day: number, hours: number) => {
	const firstYearDate = new Date(year, month - 1, day, hours);
	const formatter = new Intl.DateTimeFormat('pl-PL', TIME_OPTIONS);
	const formattedDate = formatter.format(firstYearDate);
	const isCEST = formattedDate.includes('CEST');
	if (isCEST) {
		firstYearDate.setHours(firstYearDate.getHours() + 2);
	} else {
		firstYearDate.setHours(firstYearDate.getHours() + 1);
	}
	const newDateISO = firstYearDate.toISOString();
	return newDateISO;
};

export const generateDateDaily = (year: number, month: number, day: number) => {
	const firstYearDate = new Date(year, month, 1);
	firstYearDate.setDate(firstYearDate.getDate() + day);

	const formatter = new Intl.DateTimeFormat('pl-PL', TIME_OPTIONS);
	const formattedDate = formatter.format(firstYearDate);
	const isCEST = formattedDate.includes('CEST');
	if (isCEST) {
		firstYearDate.setHours(firstYearDate.getHours() + 2);
	} else {
		firstYearDate.setHours(firstYearDate.getHours() + 1);
	}
	const newDateISO = firstYearDate.toISOString();
	return newDateISO;
};
