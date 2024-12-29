import React from 'react'
import { WeeklyData } from '../utils/locationStore'
import { Sunrise, Sunset } from 'lucide-react'

interface ComponentProps {
    info: WeeklyData["daily"][0],
}

const HourlySlider: React.FC<ComponentProps> = ({info}) => {
    
    const compareTimes = (hour: string) => {
        const sunriseHour = parseInt(info.astro.sunrise.slice(0, 2))   // Sunrise hour
        const sunsetHour = info.astro.sunset.includes('PM') ? parseInt(info.astro.sunset.slice(0, 2)) + 12 : hour.slice(0, 2)   // Sunset hour
        const parsedHour = parseInt(hour.slice(hour.length - 5, hour.length -3))   // Parsed hour 
        if (sunriseHour === parsedHour) return 'sunrise'
        if (sunsetHour === parsedHour) return 'sunset'
        return 'day'
    }

    return (
        <div 
                className='flex w-full self-center dark:bg-slate-700 rounded-md overflow-x-auto whitespace-nowrap divide-gray-400 divide-x divide-opacity-70 py-4 md:max-w-screen-md scrollbar-hide'
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >
                {info.hour.map((hour) => 
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
    )
}

export default HourlySlider
