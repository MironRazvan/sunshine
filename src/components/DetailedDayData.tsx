import React from 'react'
import { useLocation } from 'react-router-dom'
import { WeeklyData } from '../utils/locationStore'
import { Sunrise, Sunset } from 'lucide-react'

const DetailedDayData: React.FC = () => {
    const location = useLocation()
    const state = location.state as WeeklyData['daily'][0]

    const weekdayConverter = (time: string) => {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const inputDate = new Date(time)
        return weekdays[inputDate.getDay()]
    }

    const dateFormatter = (inputDate: string): string => {
        const receivedDate = new Date(inputDate)
        return receivedDate.toUTCString().slice(4, 11)
    }

    const compareTimes = (hour: string) => {
        const sunriseHour = parseInt(state.astro.sunrise.slice(0, 2))   // Sunrise hour
        const sunsetHour = state.astro.sunset.includes('PM') ? parseInt(state.astro.sunset.slice(0, 2)) + 12 : hour.slice(0, 2)   // Sunset hour
        const parsedHour = parseInt(hour.slice(hour.length - 5, hour.length -3))   // Parsed hour fr
        if (sunriseHour === parsedHour) return 'sunrise'
        if (sunsetHour === parsedHour) return 'sunset'
        return 'day'
    }

    return (
        <div className='flex flex-col flex-1 dark:bg-blue-950 dark:text-gray-50 items-center gap-8'>
            <div className='flex justify-between items-end w-full md:w-3/5 p-4 my-8'>
                <div className='flex flex-col items-center'>
                    <h2 className='text-xl'>{dateFormatter(state.date)}</h2>
                    <span>{weekdayConverter(state.date)}</span>
                </div>
                <div>
                    <span className='flex items-end gap-1'>
                        <p className='text-xl text-opacity-50'>{Math.round(state.day.mintemp_c)}°</p>
                        <p className='text-xl'>/</p>
                        <p className='text-3xl m-0 p-0'>{Math.round(state.day.maxtemp_c)}°</p>
                    </span>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='h-8 w-8'>
                        <img src={state.day.condition.icon} alt="Weather Icon" className='w-full h-full object-contain'/>
                    </div>
                    <p>{state.day.condition.text}</p>
                </div>
            </div>
            <div className='dark:text-gray-50 py-4 px-1 md:px-4 grid grid-cols-3 gap-2 md:grid-cols-4 w-full md:w-3/5 self-center'>
                <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-2 md:px-4 pt-4 w-full col-span-1 md:col-span-1">
                    <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                        <span className="dark:text-gray-50">Humidity</span>
                    </div>
                    <div className='flex flex-col h-full'>
                        <p className='text-2xl pb-2 my-auto'>{state.day.avghumidity}%</p>
                        <span className='text-xs italic opacity-60 pb-1'>Dew point: {state.hour[0].dewpoint_c}°</span>
                    </div>
                </div>
                <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full col-span-2 md:col-span-3">
                    <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                        <span className="dark:text-gray-50">Astrology</span>
                    </div>
                    <div className='flex flex-col md:grid md:grid-cols-2 md:items-center'>
                        <div>
                            <p className='pb-2 text-sm sm:text-base'>Sunrise: {state.astro.sunrise}</p>
                            <p className='pb-2 text-sm sm:text-base'>Sunset: {state.astro.sunset}</p>
                        </div>
                        <p className='pb-2 text-sm sm:text-base'>Moon Phase: {state.astro.moon_phase}</p>
                    </div>
                </div>
                <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full col-span-3 md:col-span-3">
                    <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                        <span className="dark:text-gray-50">Other</span>
                    </div>
                    <div>
                        <p className='pb-2 text-sm sm:text-base'>UV index: {Math.round(state.day.uv)}</p>
                    </div>
                </div>
                <div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full col-span-3 md:col-span-1">
                    <div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
                        <span className="dark:text-gray-50">Wind</span>
                    </div>
                    <div>
                        <p className='text-xl md:text-2xl pb-2'>{state.day.maxwind_kph} Km/h</p>
                        {/* <span className='text-xs italic opacity-60 pb-1'>Wind direction: {weatherData.wind_dir}</span> */}
                    </div>
                </div>
            </div>
            <div 
                className='flex w-full self-center bg-slate-700 rounded-md overflow-x-auto whitespace-nowrap divide-gray-400 divide-x divide-opacity-70 py-4 md:max-w-screen-md scrollbar-hide'
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >
                {state.hour.map((hour) => 
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
                            <p className='dark:text-gray-50 text-xs'>{hour.chance_of_rain >= hour.chance_of_snow ? (hour.chance_of_rain === 0 ? undefined : `${hour.chance_of_rain}%`) : (hour.chance_of_snow === 0 ? undefined : `${hour.chance_of_snow}%`)}</p>
                            {/* <p className='dark:text-gray-50 text-xs'>{hour.chance_of_rain >= hour.chance_of_snow ? (hour.chance_of_rain === 0 ? <p className='opacity-0'>-</p> : `${hour.chance_of_rain}%`) : (hour.chance_of_snow === 0 ? <p className='opacity-0'>-</p> : `${hour.chance_of_snow}%`)}</p> */}
                        </div>
                        <p className='dark:text-gray-50'>{Math.round(hour.temp_c * 2) / 2}°</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DetailedDayData
