import React from 'react'
import './App.css'
import Header from './components/Header'
import Today from './components/Today'
import DetailedView from './components/DetailedView'
import Favorites from './components/Favorites'
import About from './components/About'
import LocationForm from './components/LocationForm'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {

    return (
      <Router>
        <div className='min-h-screen flex flex-col'>
        <Header />
        <Routes>
          <Route path='/' element={<Today />} />
          <Route path='/nextweek' element={<DetailedView />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/about' element={<About />} />
          <Route path='/location' element={<LocationForm />} />
        </Routes>
        </div>
      </Router>
    )
}

export default App
