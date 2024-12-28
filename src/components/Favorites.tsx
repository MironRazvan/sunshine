import React from 'react'
import useLocationStore from '../utils/locationStore'
import { useNavigate } from 'react-router-dom'
import { HeartOff } from 'lucide-react'
import { LocationProps } from '../utils/locationStore'

const Favorites: React.FC = () => {
    const navigate = useNavigate()
    const { favoriteLocations, setCurrentLocation, isFavorite, removeFavoriteLocation } = useLocationStore()
    
    const handleLocationChoose = (location: LocationProps) => {
        setCurrentLocation(location)
        navigate('/')
    }
    return (
        favoriteLocations.length > 0 && (
            <div className='flex-1 dark:bg-blue-950 dark:text-gray-50 py-4'>
                <ul className='flex flex-col justify-center gap-4 '>
                {favoriteLocations.map((location) => (
                    <li 
                        key={location.id} 
                        className='flex items-center justify-between shadow-md w-full max-w-screen-md m-auto p-4 rounded-md bg-gray-50 gap-4 dark:bg-slate-600 dark:text-gray-50'
                    >
                        <div className='flex flex-col gap-1'>
                            <p 
                                onClick={() => handleLocationChoose(location)}
                                className='font-bold cursor-pointer text-1xl md:text-2xl'
                            >{location.name}</p>
                            <div className='flex gap-2'>
                                <p className='text-sm font-thin' onClick={() => handleLocationChoose(location)}>{location.region}</p>
                                <p className='text-sm font-thin' onClick={() => handleLocationChoose(location)}>{location.country}</p>
                            </div>
                        </div>
                        <button onClick={() => removeFavoriteLocation(location)}>
                            <HeartOff fill={isFavorite(location) ? "red" : "none"} color='red'/>
                        </button>
                    </li>
                ))}
            </ul>
            </div>
        )
    )
}

export default Favorites
