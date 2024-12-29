import React from 'react'
import './App.css'
import Header from './components/Header'
import Today from './components/Today'
import Favorites from './components/Favorites'
import About from './components/About'
import WeeklyData from './components/WeeklyData'
import LocationForm from './components/LocationForm'
import DetailedDayData from './components/DetailedDayData'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {

    return (
      <Router>
        <div className='min-h-screen flex flex-col'>
        <Header />
        <Routes>
          <Route path='/' element={<Today />} />
          <Route path='/nextweek' element={<WeeklyData />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/about' element={<About />} />
          <Route path='/location' element={<LocationForm />} />
          <Route path='/nextweek/details' element={<DetailedDayData />} />
        </Routes>
        </div>
      </Router>
    )
}

export default App
