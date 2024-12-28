import { create } from "zustand";


export interface LocationProps {
    id: number,
    name: string,
    region: string,
    country: string,
    lat: number,
    lon: number,
}

export interface WeatherData {
    temp_c: number,
    feelslike_c: number,
    wind_kph: number,
    wind_dir: string,
    gust_kph: number,
    pressure_mb: number,
    uv: number,
    humidity: number,
    dewpoint_c: number,
    precip_mm: number,
    condition: {
        icon: string,
        text: string,
    }
}

export interface HourlyData {
    date: string,
    astro: {
        sunrise: string,
        sunset: string,
    }
    day: {
        maxtemp_c: number,
        mintemp_c: number,
    }
    hour: {
        chance_of_rain: number,
        chance_of_snow: number,
        time: string,
        temp_c: number,
        condition: {
            icon: string,
        }
    }[]
}

export interface WeeklyData {
    name: string,
    daily: {
        date: string,
        date_epoch: number,
        day: {
            avgtemp_c: number,
            maxtemp_c: number,
            mintemp_c: number,
            condition: {
                icon: string,
                text: string,
            }
        },
        hour: {
            chance_of_rain: number,
            chance_of_snow: number,
        }[],
    }[],
}

interface Location {
    currentLocation: LocationProps;
    locationList: LocationProps[];
    favoriteLocations: LocationProps[];
    weatherData: WeatherData;
    hourlyData: HourlyData;
    weeklyData: WeeklyData[];
    loading: boolean;
    error: string;
    setCurrentLocation: (location: LocationProps) => void;  // sets current location in the store and local storage
    clearCurrentLocation: () => void; // clears current location in the store
    clearLocationsList: () => void; // clears location list in the store
    fetchLocationList: (location: string) => Promise<void>; // fetches location list from the API
    isFavorite: (location: LocationProps) => boolean; // checks if the location is in the favorite locations list
    toggleFavoriteLocation: (location: LocationProps) => void; // toggles location in the favorite locations list
    addFavoriteLocation: (location: LocationProps) => void; // adds location to favorite locations in the store and local storage
    removeFavoriteLocation: (location: LocationProps) => void; // removes location from favorite locations in the store and local storage
    fetchTodayWeather: (location: LocationProps) => Promise<void>; // fetches weather data from the API for the given location
    fetchHourlyWeather: (location: LocationProps) => Promise<void>; // fetches hourly weather data from the API for the given location
    fetchWeeklyWeather: (location: LocationProps) => Promise<void>; // fetches weekly weather data from the API
}

const useLocationStore = create<Location>((set, get) => ({
    currentLocation: JSON.parse(localStorage.getItem("lastWeatherLocation") || "{}"),
    locationList: [],
    favoriteLocations: JSON.parse(localStorage.getItem("favoriteLocations") || "[]"),
    weatherData: {} as WeatherData,
    hourlyData: {} as HourlyData,
    weeklyData: [] as WeeklyData[],
    loading: false,
    error: "",
    setCurrentLocation: (location: LocationProps) => {
        set(() => {
            localStorage.setItem("lastWeatherLocation", JSON.stringify(location));
            return { currentLocation: location };
        })
    },
    clearCurrentLocation: () => {
        set({ currentLocation: {} as LocationProps });
    },
    clearLocationsList: () => {
        set({ locationList: [] });
    },
    fetchLocationList: async (location: string) => {
        set({loading: true, error: ""});
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=0ee9972de4b34615a3b171137242612&q=${location}`);
            if (!response.ok) {
                throw new Error("Failed to fetch location list");
            }
            const data = await response.json();
            set({ locationList: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    isFavorite: (location: LocationProps) => {
        return get().favoriteLocations.includes(location);
    },
    toggleFavoriteLocation: (location: LocationProps) => {
        const isFavorite = get().favoriteLocations.includes(location);
        if (isFavorite) {
            get().removeFavoriteLocation(location);
        } else {
            get().addFavoriteLocation(location);
        }
    },
    addFavoriteLocation: (location: LocationProps) => {
        set((state) => {
            const favs = state.favoriteLocations
            if (favs.includes(location)) { return {favs} }
            const favoriteLocations = [...state.favoriteLocations, location];
            localStorage.setItem("favoriteLocations", JSON.stringify(favoriteLocations));
            return { favoriteLocations };
        });
    },
    removeFavoriteLocation: (location: LocationProps) => {
        set((state) => {
            const favoriteLocations = state.favoriteLocations.filter((loc) => loc.id !== location.id);
            localStorage.setItem("favoriteLocations", JSON.stringify(favoriteLocations));
            return { favoriteLocations };
        });
    },
    fetchTodayWeather: async (location: LocationProps) => {
        set({ loading: true, error: "" });
        try {
            const {lat, lon} = location;
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=0ee9972de4b34615a3b171137242612&q=${lat},${lon}`);

            if (!response.ok) { 
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            set({ weatherData: data.current, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    fetchHourlyWeather: async (location: LocationProps) => {
        set({ loading: true, error: ""})
        try {
            const {lat, lon} = location;
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=0ee9972de4b34615a3b171137242612&q=${lat},${lon}&days=2`);
            if (!response.ok) {
                throw new Error("Failed to fetch hourly weather data");
            }
            const data = await response.json();

            // calculating the next 24h from the current time
            const currentHour = new Date().getHours();
            const todayHours: HourlyData['hour'] = data.forecast.forecastday[0].hour.filter((hour: { time: string }) => {
                const hourTime: number = new Date(hour.time).getHours();
                return hourTime >= currentHour;
            });
            const tomorrowHours = data.forecast.forecastday[1].hour
            const next24Hours = [...todayHours, ...tomorrowHours].slice(0, 24)

            // adding the next 24h to the forecast object
            const forecast = data.forecast.forecastday[0]
            forecast.hour = next24Hours

            set({ hourlyData: forecast, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
    fetchWeeklyWeather: async (location: LocationProps) => {
        set({loading: true, error: ""})
        try {
            const {lat, lon} = location
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=0ee9972de4b34615a3b171137242612&q=${lat},${lon}&days=10&hour=1`)

            if (!response.ok)
                throw new Error("Failed to fetch weekly weather data")

            const data = await response.json()
            const newObj = {daily:data.forecast.forecastday, name: data.location.name}
            console.log(newObj)
            set({loading: false, weeklyData: [newObj]})
        } catch (error: any) {
            set({error: error.message, loading: false})
        }
    },
}));

export default useLocationStore;
