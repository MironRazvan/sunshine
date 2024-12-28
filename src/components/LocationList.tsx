import React from 'react'
import useLocationStore from '../utils/locationStore'
import { Star } from 'lucide-react'

interface Props {
    onClick: (location: any) => void
}

const LocationList: React.FC<Props> = ({onClick}) => {
    const { locationList, toggleFavoriteLocation, isFavorite } = useLocationStore()

    return (
        locationList.length > 0 && (
            <ul className='flex flex-col justify-center gap-4'>
                {locationList.map((location) => (
                    <li 
                        key={location.id} 
                        className='flex items-center justify-between shadow-md w-full max-w-screen-md m-auto p-4 rounded-md bg-gray-50 gap-4 dark:bg-slate-600 dark:text-gray-50'
                    >
                        <div className='flex flex-col gap-1 mr-auto cursor-pointer w-full' onClick={() => onClick(location)}>
                            <p 
                                onClick={() => onClick(location)}
                                className='font-bold cursor-pointer text-1xl md:text-2xl'
                            >
                                {location.name}
                            </p>
                            <div className='flex gap-2'>
                                <p className='text-sm font-thin cursor-pointer' >{location.region}</p>
                                <p className='text-sm font-thin cursor-pointer'>-</p>
                                <p className='text-sm font-thin cursor-pointer' >{location.country}</p>
                            </div>
                        </div>
                        <button onClick={() => toggleFavoriteLocation(location)}>
                            <Star fill={isFavorite(location) ? "orange" : "none"} color='orange'/>
                        </button>
                    </li>
                ))}
            </ul>
        )   
    )
}

export default LocationList
