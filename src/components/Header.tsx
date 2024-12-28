import React, { useEffect, useState, useRef } from 'react'
import { MapPin, MenuIcon, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import useLocationStore from '../utils/locationStore'
import useThemeStore from '../utils/themeStore'

const Header: React.FC = () => {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const buttonRef = useRef<HTMLDivElement>(null)
    const isScreenSmall = window.innerWidth < 768
    const {currentLocation} = useLocationStore()
    const {theme, toggleTheme} = useThemeStore()

    const handleLinkClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
        e.preventDefault()
        navigate(e.currentTarget.title)
    }

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    return (
        <div className='flex align-middle gap-4 p-2 border-b-2 shadow-sm bg-gray-50 dark:bg-slate-800 relative'>  
            <div className='border-2 shadow-md p-2 min-w-max rounded-md text-center flex md:hidden ' onClick={() => setMenuOpen(!menuOpen)} ref={buttonRef} >
                <MenuIcon className='self-center dark:text-gray-50'/>
            </div>
            <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} anchorElement={buttonRef.current}>
                <Link to='/' className="text-white border-b-2 border-white w-4/5 no-underline pl-4 mb-4" onClick={() => setMenuOpen(!menuOpen)}>Weather Details</Link>
                <Link to='/favorites' className="text-white border-b-2 border-white w-full no-underline pl-4 mb-4" onClick={() => setMenuOpen(!menuOpen)}>Favorites</Link>
                <Link to='/about' className="text-white border-b-2 border-white w-full no-underline pl-4 " onClick={() => setMenuOpen(!menuOpen)}>About</Link>
            </Menu>
            <div className='p-2 min-w-max m-auto md:m-0 rounded-md text-center flex gap-1'>
                <h3 className='self-center text-2xl md:text-3xl dark:text-gray-50 font-["Carattere"]' onClick={isScreenSmall ? () => navigate('/') : undefined}>Sunshine</h3>
                {theme === 'dark' && <Sun className='self-center cursor-pointer dark:text-gray-50' onClick={toggleTheme}/>}
                {theme === 'light' && <Moon className='self-center cursor-pointer' onClick={toggleTheme}/>}
            </div>
            <div className='border-2 shadow-md p-2 m-auto w-full max-w-screen-md h-min rounded-md hidden md:flex divide-x divide-gray-400 overflow-hidden dark:text-gray-50'>
                <h3 className='flex-1 text-center py-2 bg-inherit hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer' onClick={handleLinkClick} title='/'>Today</h3>
                <h3 className='flex-1 text-center py-2 bg-inherit hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer' onClick={handleLinkClick} title='/nextweek'>Next Week</h3>
                <h3 className='flex-1 text-center py-2 bg-inherit hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer' onClick={handleLinkClick} title='/favorites'>Favorites</h3>
                <h3 className='flex-1 text-center py-2 bg-inherit hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer' onClick={handleLinkClick} title='/about'>About</h3>
            </div>
            <div className='border-2 shadow-md px-2 md:px-4 py-2 min-w-max rounded-md text-center justify-center flex flex-col cursor-pointer dark:text-gray-50' onClick={handleLinkClick} title='location'>
                <MapPin className='self-center dark:text-gray-50' />
                <h3 className='self-center text-xs uppercase hidden md:block dark:text-gray-50'>{currentLocation.name ? currentLocation.name : "Choose location"}</h3>
            </div>
        </div>
    )
}

export default Header
