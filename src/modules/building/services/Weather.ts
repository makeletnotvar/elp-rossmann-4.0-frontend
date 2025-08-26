export type WeatherType = {
	main: {
		temp: number;
		feels_like: number;
	};
	message: string;
	cod: number;
};

export default class Weather {
	static buffer: Map<string, WeatherType> = new Map<string, WeatherType>();

	public static async get(city: string, lat?: number, lon?: number, forced: boolean = false) {
		const currentWeather = Weather.buffer.get(city);
		const trimmedCity = city.trim();

		if (currentWeather) {
			return currentWeather;
		} else {
			let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity},pl&units=metric&appid=${import.meta.env.VITE_APP_WEATHER_API_KEY}`;
			if (lat && lon) {
				requestURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_WEATHER_API_KEY}`;
			}
			const response = await fetch(requestURL);
			const data = await response.json();
			Weather.buffer.set(city, data);
			return data;
		}
	}
}
