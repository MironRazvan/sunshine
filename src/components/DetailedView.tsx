import React from 'react'
import useLocationStore from '../utils/locationStore'

const DetailedView: React.FC = () => {
    const { currentLocation } = useLocationStore()

    return (
        currentLocation.name ? (
            <div className='flex-1 dark:bg-blue-950 dark:text-gray-50'>
                <h1>Next Week's Weather in {currentLocation.name}</h1>
                <p>Monday: 72</p>
                <p>Tuesday: 70</p>
                <p>Wednesday: 68</p>
                <p>Thursday: 65</p>
                <p>Friday: 70</p>
                <p>Saturday: 75</p>
                <p>Sunday: 80</p>
            </div>
        ) : (
            <div className='w-full h-dvh flex flex-col items-center justify-center overflow-hidden'>
                <h1>No location found!</h1>
                <h4>Please enter a location to see the weather.</h4>
            </div>
            )   
    )
}

export default DetailedView
