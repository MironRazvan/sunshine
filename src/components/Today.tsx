import React, { useEffect, useState } from 'react'
import useLocationStore from '../utils/locationStore'
import { ChevronsDown, ChevronsUp, Sunrise, Sunset } from 'lucide-react'
import DetailedView from './DetailedView'

const Today: React.FC = () => {
    const { loading, currentLocation, hourlyData, weatherData, fetchTodayWeather, fetchHourlyWeather, fetchWeeklyWeather } = useLocationStore()
    const [screenSize, setScreenSize] = useState(window.innerWidth)

    useEffect(() => {
        if(currentLocation.name && !weatherData.condition?.text?.length && !hourlyData.date?.length) {
            console.log('Fetching weather data...')
            fetchTodayWeather(currentLocation)
            fetchHourlyWeather(currentLocation)
            fetchWeeklyWeather(currentLocation)
        }
    }, [weatherData, hourlyData, currentLocation])

    // useEffect for screen resizing
    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const compareTimes = (hour: string) => {
        const sunriseHour = parseInt(hourlyData.astro.sunrise.slice(0, 2))   // Sunrise hour
        const sunsetHour = hourlyData.astro.sunset.includes('PM') ? parseInt(hourlyData.astro.sunset.slice(0, 2)) + 12 : hour.slice(0, 2)   // Sunset hour
        const parsedHour = parseInt(hour.slice(hour.length - 5, hour.length -3))   // Parsed hour fr
        if (sunriseHour === parsedHour) return 'sunrise'
        if (sunsetHour === parsedHour) return 'sunset'
        return 'day'
    }


    return (        
        !loading && currentLocation.name && weatherData.condition?.text?.length && hourlyData.date? (
            <div className='flex flex-col flex-1 dark:bg-blue-950'>
                <div className='flex flex-col items-center justify-center shadow-lg md:max-w-screen-sm dark:bg-slate-600 dark:text-gray-50 w-full h-max mx-auto p-4 my-4 rounded-md bg-sky-100 overflow-y-auto'>
                    <h1 className='font-bold text-2xl md:text-3xl'>{currentLocation.name}</h1>
                    <span className='text-gray-500 text-sm italic dark:text-gray-400 text-opacity-90'>{weatherData.condition.text}</span>
                    <p className='text-6xl md:text-10xl py-4'>{Math.round(weatherData.temp_c * 2) / 2}°</p>
                    <p className='text-gray-500 dark:text-gray-400 text-opacity-90'>Feels Like: {Math.round(weatherData.feelslike_c * 2) / 2}°</p>
                    <div className='flex gap-4'>
                        <p className='flex'>
                            <ChevronsUp />
                            {Math.round(hourlyData.day.maxtemp_c * 2) / 2}°
                        </p>
                        <p className='flex'>
                            <ChevronsDown />
                            {Math.round(hourlyData.day.mintemp_c * 2) / 2}°
                        </p>
                    </div>
                </div>
                <div 
                    className='flex w-full self-center overflow-x-auto whitespace-nowrap divide-gray-400 divide-x divide-opacity-70 p-4 md:max-w-screen-md scrollbar-hide'
                    style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                >
                    {hourlyData.hour.map((hour) => 
                        <div key={hour.time} className='flex flex-col items-center justify-between gap-2 px-4'>
                            <p className='text-xs dark:text-gray-50'>{hour.time.slice(hour.time.length - 5)}</p>
                            <div className='flex flex-col items-center'>
                                <div className='w-8 aspect-square'>
                                    {compareTimes(hour.time) === 'sunrise' ? 
                                        <Sunrise className='w-full h-full object-contain dark:stroke-gray-50'/> :
                                        compareTimes(hour.time) === 'sunset' ?
                                            <Sunset className='w-full h-full object-contain dark:stroke-gray-50'/> :
                                                <img src={hour.condition.icon} alt="Hourly Weather Icon" className='w-full h-full object-contain'/>
                                    }
                                </div>
                                <p className='dark:text-gray-50 text-xs'>{hour.chance_of_rain >= hour.chance_of_snow ? (hour.chance_of_rain === 0 ? <p className='opacity-0'>-</p> : `${hour.chance_of_rain}%`) : (hour.chance_of_snow === 0 ? <p className='opacity-0'>-</p> : `${hour.chance_of_snow}%`)}</p>
                            </div>
                            <p className='dark:text-gray-50'>{Math.round(hour.temp_c * 2) / 2}°</p>
                        </div>
                    )}
                </div>
                {(screenSize < 768) && <DetailedView />}
                <div className='dark:text-gray-50 p-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:max-w-screen-md self-center'>
                    <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full">
                        <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                            <span className="dark:text-gray-50">Humidity</span>
                        </div>
                        <div>
                            <p className='text-2xl pb-2'>{weatherData.humidity}%</p>
                            <p className='text-xs italic opacity-60 pb-1'>Dew point: {weatherData.dewpoint_c}°</p>
                        </div>
                    </div>
                    <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full">
                        <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                            <span className="dark:text-gray-50">Astrology</span>
                        </div>
                        <div>
                            <p className='pb-2 text-sm sm:text-base'>Sunrise: {hourlyData.astro.sunrise}</p>
                            <p className='pb-2 text-sm sm:text-base'>Sunset: {hourlyData.astro.sunset}</p>
                        </div>
                    </div>
                    <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full">
                        <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                            <span className="dark:text-gray-50">Wind</span>
                        </div>
                        <div>
                            <p className='text-2xl pb-2'>{weatherData.wind_kph} Km/h</p>
                            <p className='text-xs italic opacity-60 pb-1'>Wind direction: {weatherData.wind_dir}</p>
                        </div>
                    </div>
                    <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full">
                        <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                            <span className="dark:text-gray-50">Other</span>
                        </div>
                        <div>
                            <p className='pb-2 text-sm sm:text-base'>Precipitations: {weatherData.precip_mm}mm</p>
                            <p className='pb-2 text-sm sm:text-base'>UV index: {Math.round(weatherData.uv)}</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className='w-full h-dvh flex flex-col items-center justify-center overflow-y-auto dark:bg-blue-950 dark:text-gray-50'>
                <h1>No location found!</h1>
                <h4>Please enter a location to see the weather.</h4>
            </div>
        )
    )
}

export default Today
