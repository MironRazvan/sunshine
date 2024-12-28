import React, { useEffect } from 'react'
import useLocationStore from '../utils/locationStore'
import { useNavigate } from 'react-router-dom'
import { CircleX, Map, Search } from 'lucide-react'
import LocationList from './LocationList'
import { LocationProps } from '../utils/locationStore'

/*
* The LocationForm component will be used to allow users to enter a location.
* This component will be used to update the locationName in the locationStore.
* The locationName will be used to display the weather for the location.
* Also, the locationName will be used to display the location in the header.
*/

const LocationForm: React.FC = () => { 
    const navigate = useNavigate()
    const { 
        currentLocation, 
        loading, 
        setCurrentLocation, 
        fetchLocationList, 
        clearLocationsList,
        clearCurrentLocation,
        fetchTodayWeather,
        fetchHourlyWeather
    } = useLocationStore()
    const [location, setLocation] = React.useState('')
    const isSmallScreen = window.innerWidth < 640

    useEffect(() => {
        if (!loading && currentLocation.name) {
            fetchTodayWeather(currentLocation)
            fetchHourlyWeather(currentLocation)
        }
    }, [currentLocation])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        fetchLocationList(location)
    }

    const handleLocationChoose = (location: LocationProps) => {
        setCurrentLocation(location)
        clearLocationsList()
        navigate('/')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value)
    }

    return (
        <div className='relative z-0 flex-1 dark:bg-blue-950'>
            {currentLocation.name && (
                <div className='flex items-center justify-center gap-4 px-4 py-2 mt-4 md:text-2xl shadow-md w-full max-w-screen-md m-auto rounded-md bg-gray-50 dark:bg-slate-600 dark:text-gray-50'>
                    <Map />
                    {!isSmallScreen && <p>Current Location:</p>}
                    <p className='font-bold'>{currentLocation.name}</p>
                    <p>-</p>
                    <p>{currentLocation.region}</p>
                    <p>-</p>
                    <p>{currentLocation.country}</p>
                    <button className='' onClick={() => clearCurrentLocation()}>
                        <CircleX color='red'/>
                    </button>
                </div>
            )}
            {currentLocation.name && <br className='w-full'/>}
            <form 
                className='flex flex-col items-center relative justify-center mt-4 shadow-md w-full max-w-screen-md m-auto p-4 rounded-md bg-gray-50 z-0 dark:bg-slate-600 dark:text-gray-50'
                onSubmit={handleSubmit}
            >
                <input 
                    type='text' 
                    id='location' 
                    name='location' 
                    placeholder='Search...' 
                    onChange={handleChange}
                    className='pr-10 pl-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 darkLtext-gray-50'
                />
                <button type='submit' className='absolute inset-y-0 right-4 pr-3 flex items-center dark:text-black'>
                    <Search className='dark:stroke-gray-50' />
                </button>
            </form>
            <br className='w-full'/>
            {loading && <p>Loading...</p>}
            <LocationList onClick={handleLocationChoose}/>
            <br className='w-full' />
        </div>
    )
}

export default LocationForm
