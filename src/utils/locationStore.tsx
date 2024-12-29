import { create } from "zustand"

interface WeatherCondition {
	icon: string
	text: string
}

interface AstroData {
	sunset: string
	sunrise: string
	moon_phase: string
}

interface BaseWeatherData {
	temp_c: number
	wind_kph: number
	wind_dir: string
	uv: number
	condition: WeatherCondition
}

export interface WeatherData extends BaseWeatherData {
	feelslike_c: number
	gust_kph: number
	pressure_mb: number
	humidity: number
	dewpoint_c: number
	precip_mm: number
}

interface HourData extends BaseWeatherData {
	dewpoint_c: number
	chance_of_rain: number
	chance_of_snow: number
	time: string
	windchill_c: number
	vis_km: number
}

interface DayData {
	avgtemp_c: number
	maxtemp_c: number
	mintemp_c: number
	avghumidity: number
	avgvis_km: number
	maxwind_kph: number
	uv: number
	condition: WeatherCondition
}

export interface HourlyData {
	date: string
	date_epoch: number
	astro: AstroData
	day: DayData
	hour: HourData[]
}

export interface WeeklyData {
	name: string
	daily: {
		date: string
		date_epoch: number
		astro: AstroData
		day: DayData
		hour: HourData[]
	}[]
}

export interface LocationProps {
	id: number
	name: string
	region: string
	country: string
	lat: number
	lon: number
}

interface Location {
	currentLocation: LocationProps
	locationList: LocationProps[]
	favoriteLocations: LocationProps[]
	weatherData: WeatherData
	hourlyData: HourlyData
	weeklyData: WeeklyData[]
	loading: boolean
	error: string
	setCurrentLocation: (location: LocationProps) => void // sets current location in the store and local storage
	clearCurrentLocation: () => void // clears current location in the store
	clearLocationsList: () => void // clears location list in the store
	fetchLocationList: (location: string) => Promise<void> // fetches location list from the API
	isFavorite: (location: LocationProps) => boolean // checks if the location is in the favorite locations list
	toggleFavoriteLocation: (location: LocationProps) => void // toggles location in the favorite locations list
	addFavoriteLocation: (location: LocationProps) => void // adds location to favorite locations in the store and local storage
	removeFavoriteLocation: (location: LocationProps) => void // removes location from favorite locations in the store and local storage
	fetchTodayWeather: (location: LocationProps) => Promise<void> // fetches weather data from the API for the given location
	fetchHourlyWeather: (location: LocationProps) => Promise<void> // fetches hourly weather data from the API for the given location
	fetchWeeklyWeather: (location: LocationProps) => Promise<void> // fetches weekly weather data from the API
}

const API_CONFIG = {
	BASE_URL: "https://api.weatherapi.com/v1",
	KEY: "0ee9972de4b34615a3b171137242612",
	endpoints: {
		search: "/search.json",
		current: "/current.json",
		forecast: "/forecast.json",
	},
} as const

const storage = {
	getItem: (key: string, defaultValue: any = "{}") =>
		JSON.parse(localStorage.getItem(key) || defaultValue),
	setItem: (key: string, value: any) =>
		localStorage.setItem(key, JSON.stringify(value)),
}

const fetchFromAPI = async (
	endpoint: string,
	params: Record<string, string>
) => {
	const queryString = new URLSearchParams({
		key: API_CONFIG.KEY,
		...params,
	}).toString()

	const response = await fetch(
		`${API_CONFIG.BASE_URL}${endpoint}?${queryString}`
	)

	if (!response.ok) {
		throw new Error(`Failed to fetch from ${endpoint}`)
	}

	return response.json()
}

const useLocationStore = create<Location>((set, get) => ({
	currentLocation: storage.getItem("lastWeatherLocation"),
	locationList: [],
	favoriteLocations: storage.getItem("favoriteLocations", "[]"),
	weatherData: {} as WeatherData,
	hourlyData: {} as HourlyData,
	weeklyData: [] as WeeklyData[],
	loading: false,
	error: "",

	setCurrentLocation: (location: LocationProps) => {
		storage.setItem("lastWeatherLocation", location)
		set({ currentLocation: location })
	},

	clearCurrentLocation: () => set({ currentLocation: {} as LocationProps }),
	clearLocationsList: () => set({ locationList: [] }),

	fetchLocationList: async (location: string) => {
		set({ loading: true, error: "" })
		try {
			const data = await fetchFromAPI(API_CONFIG.endpoints.search, {
				q: location,
			})
			set({ locationList: data, loading: false })
		} catch (error: any) {
			set({ error: error.message, loading: false })
		}
	},

	isFavorite: (location: LocationProps) => {
		return get().favoriteLocations.includes(location)
	},

	toggleFavoriteLocation: (location: LocationProps) => {
		const { favoriteLocations } = get()
		const updatedFavorites = favoriteLocations.includes(location)
			? favoriteLocations.filter((loc) => loc.id !== location.id)
			: [...favoriteLocations, location]

		storage.setItem("favoriteLocations", updatedFavorites)
		set({ favoriteLocations: updatedFavorites })
	},

	addFavoriteLocation: (location: LocationProps) => {
		set((state) => {
			const favs = state.favoriteLocations
			if (favs.includes(location)) {
				return { favs }
			}
			const favoriteLocations = [...state.favoriteLocations, location]
			localStorage.setItem(
				"favoriteLocations",
				JSON.stringify(favoriteLocations)
			)
			return { favoriteLocations }
		})
	},
	removeFavoriteLocation: (location: LocationProps) => {
		set((state) => {
			const favoriteLocations = state.favoriteLocations.filter(
				(loc) => loc.id !== location.id
			)
			localStorage.setItem(
				"favoriteLocations",
				JSON.stringify(favoriteLocations)
			)
			return { favoriteLocations }
		})
	},

	fetchTodayWeather: async (location: LocationProps) => {
		set({ loading: true, error: "" })
		try {
			const data = await fetchFromAPI(API_CONFIG.endpoints.current, {
				q: `${location.lat},${location.lon}`,
			})
			set({ weatherData: data.current, loading: false })
		} catch (error: any) {
			set({ error: error.message, loading: false })
		}
	},

	fetchHourlyWeather: async (location: LocationProps) => {
		set({ loading: true, error: "" })
		try {
			const data = await fetchFromAPI(API_CONFIG.endpoints.forecast, {
				q: `${location.lat},${location.lon}`,
				days: "2",
			})
			// calculating the next 24h from the current time
			const currentHour = new Date().getHours()
			const todayHours: HourlyData["hour"] =
				data.forecast.forecastday[0].hour.filter(
					(hour: { time: string }) => {
						const hourTime: number = new Date(hour.time).getHours()
						return hourTime >= currentHour
					}
				)
			const tomorrowHours = data.forecast.forecastday[1].hour
			const next24Hours = [...todayHours, ...tomorrowHours].slice(0, 24)

			// adding the next 24h to the forecast object
			const forecast = data.forecast.forecastday[0]
			forecast.hour = next24Hours
			set({ hourlyData: forecast, loading: false })
		} catch (error: any) {
			set({ error: error.message, loading: false })
		}
	},

	fetchWeeklyWeather: async (location: LocationProps) => {
		set({ loading: true, error: "" })
		try {
			const data = await fetchFromAPI(API_CONFIG.endpoints.forecast, {
				q: `${location.lat},${location.lon}`,
				days: "10",
				hours: "24",
			})
			const newObj: WeeklyData[] = [
				{
					daily: data.forecast.forecastday,
					name: data.location.name,
				},
			]
			set({ weeklyData: newObj, loading: false })
		} catch (error: any) {
			set({ error: error.message, loading: false })
		}
	},
}))

export default useLocationStore
