import React, { useEffect, useState } from 'react'
import useLocationStore from '../utils/locationStore'
import { Map } from 'lucide-react'

const DetailedView: React.FC = () => {
    const { currentLocation, loading, weeklyData, fetchWeeklyWeather } = useLocationStore()
    const [isLoaded, setIsLoaded] = useState(false)
    const [screenSize, setScreenSize] = useState(window.innerWidth)
    
    // deriving minTemp and maxTemp for the slider
    const baseMinTemperatures = weeklyData && weeklyData[0]?.daily?.map(item => item.day.mintemp_c) || []
    const baseMaxTemperatures = weeklyData && weeklyData[0]?.daily?.map(item => item.day.maxtemp_c) || []
    const minTemp = Math.round(Math.min(...baseMinTemperatures))
    const maxTemp = Math.round(Math.max(...baseMaxTemperatures))

    useEffect(() => {
        if(currentLocation.name !== weeklyData[0]?.name) {
            fetchWeeklyWeather(currentLocation)
        }
    }, [])

    // load data in case of fetching the location from local storage
    useEffect(() => {
        if (!loading && !isLoaded && !weeklyData.length) {
            fetchWeeklyWeather(currentLocation)
            setIsLoaded(true)
        }
    }, [weeklyData, currentLocation])

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

    // converts string "yyyy-mm-dd" to day of week
    const weekdayConverter = (time: string) => {
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const inputDate = new Date(time)
        return weekdays[inputDate.getDay()]
    }

    // utility function for calculating the range of temperatures on the slider
    const calculateRangeStart = (start: number) => {
        const range = maxTemp - minTemp
        return ((Math.round(start) - minTemp) / range) * 100
    }

    const calculateRangeEnd = (end: number) => {
        const range = maxTemp - minTemp
        return ((Math.round(end) - minTemp) / range) * 100
    }

    return (
        currentLocation.name && weeklyData ? (
            <div className='flex-1 flex flex-col dark:bg-blue-950 dark:text-gray-50'>
                {currentLocation.name.length > 0 && screenSize > 768 && (
                    <div className='flex items-center justify-center gap-4 px-4 py-2 mt-4 md:text-2xl shadow-md w-full max-w-screen-md mx-auto rounded-md bg-gray-50 dark:bg-slate-600 dark:text-gray-50'>
                        <Map />
                        {screenSize > 768 && <p>Current Location:</p>}
                        <p className='font-bold'>{currentLocation.name}</p>
                        <p>-</p>
                        <p>{currentLocation.region}</p>
                        <p>-</p>
                        <p>{currentLocation.country}</p>
                    </div>
                )}
                <div className='flex flex-col items-center divide-y'>
                {
                    weeklyData[0]?.daily?.map((info) => (
                        <div key={info.date_epoch} className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-4 py-4 md:max-w-screen-md w-screen'>
                            <p className='font-bold'>{weekdayConverter(info.date)}</p>
                            <div className='w-8 aspect-square'>
                                <img src={info.day.condition.icon} alt="Weather Icon" className='w-full h-full object-contain' />
                            </div>
                            <div className='grid grid-cols-5'>
                            {/* <div className='flex gap-2 items-center'> */}
                                <p className='place-self-center'>{Math.round(info.day.mintemp_c)}</p>
                                <div className='w-full col-span-3 place-self-center'>
                                    <div className="relative h-2 bg-gray-200 rounded-full">
                                        <div 
                                        className="absolute h-full bg-blue-500 rounded-full"
                                        style={{
                                            left: `${calculateRangeStart(info.day.mintemp_c)}%`,
                                            width: `${calculateRangeEnd(info.day.maxtemp_c) - calculateRangeStart(info.day.mintemp_c)}%`
                                        }}
                                        />
                                    </div>
                                </div>
                                <p className='place-self-center'>{Math.round(info.day.maxtemp_c)}</p>
                            </div>
                            {screenSize > 768 && <p className='place-self-center'>{info.day.condition.text}</p>}
                            {screenSize > 1024 && <p className='place-self-center'>{info.hour[0].chance_of_rain > info.hour[0].chance_of_snow ? `${info.hour[0].chance_of_rain}%` : `${info.hour[0].chance_of_snow}%`}</p>}
                        </div>
                    ))
                }
                </div>
            </div>
        ) : (
            <div className='w-full flex-1 flex flex-col items-center justify-center overflow-hidden dark:bg-blue-950 dark:text-gray-50'>
                <h1>No location found!</h1>
                <h4>Please enter a location to see the weather.</h4>
            </div>
            )   
    )
}

export default DetailedView
