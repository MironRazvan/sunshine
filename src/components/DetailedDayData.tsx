import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { WeeklyData } from "../utils/locationStore"
import Graph from "./Graph"
import HourlySlider from "./HourlySlider"
import {
	ChevronDown,
	Star,
	Thermometer,
	ThermometerSun,
	Wind,
} from "lucide-react"

const DetailedDayData: React.FC = () => {
	const location = useLocation()
	const state = location.state as WeeklyData["daily"][0]
	const labels = state.hour.map((item) =>
		item.time.slice(item.time.length - 5)
	)

	const uvArray = state.hour.map((item) => item.uv)
	const windArray = state.hour.map((item) => Math.floor(item.wind_kph))
	const [dataToSend, setDataToSend] = useState({
		info: windArray,
		title: "Wind",
	})

	const dataMapping: { [key in string]: { info: number[]; title: string } } =
		{
			Wind: {
				info: windArray,
				title: "Wind",
			},
			UV: {
				info: uvArray,
				title: "UV",
			},
			Temp: {
				info: state.hour.map((item) => item.temp_c),
				title: "Temp",
			},
		}

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuOptions = ["Wind", "Temp", "UV"]
	const getIcon = (opt: string) => {
		switch (opt) {
			case "Wind":
				return (
					<div className="w-4 h-4">
						<Wind className="w-full object-contain" />
					</div>
				)
			case "Temp":
				return (
					<div className="w-4 h-4">
						<Thermometer className="w-full object-contain" />
					</div>
				)
			case "UV":
				return (
					<div className="w-4 aspect-square">
						<ThermometerSun className="w-full h-full object-contain" />
					</div>
				)
			default:
				return (
					<div className="w-4 h-4">
						<Star className="w-full object-contain" />
					</div>
				)
		}
	}
	const [selected, setSelected] = useState<string>(menuOptions[0] as string)

	useEffect(() => {
		console.log(selected)
		setDataToSend(dataMapping[selected])
	}, [selected])

	const weekdayConverter = (time: string) => {
		const weekdays = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		]
		const inputDate = new Date(time)
		return weekdays[inputDate.getDay()]
	}

	const dateFormatter = (inputDate: string): string => {
		const receivedDate = new Date(inputDate)
		return receivedDate.toUTCString().slice(4, 11)
	}

	return (
		<div className="flex flex-col flex-1 dark:bg-blue-950 dark:text-gray-50 items-center gap-8">
			<div className="flex justify-between items-end w-full md:w-3/5 p-4 my-8">
				<div className="flex flex-col items-center">
					<h2 className="text-xl">{dateFormatter(state.date)}</h2>
					<span>{weekdayConverter(state.date)}</span>
				</div>
				<div>
					<span className="flex items-end gap-1">
						<p className="text-xl text-opacity-50">
							{Math.round(state.day.mintemp_c)}°
						</p>
						<p className="text-xl">/</p>
						<p className="text-3xl m-0 p-0">
							{Math.round(state.day.maxtemp_c)}°
						</p>
					</span>
				</div>
				<div className="flex flex-col items-center">
					<div className="h-8 w-8">
						<img
							src={state.day.condition.icon}
							alt="Weather Icon"
							className="w-full h-full object-contain"
						/>
					</div>
					<p>{state.day.condition.text}</p>
				</div>
			</div>
			<div className="dark:text-gray-50 py-4 px-1 md:px-4 grid grid-cols-3 gap-2 md:grid-cols-4 w-full md:w-3/5 self-center">
				<div className="relative border-2 border-gray-600 rounded-lg mt-2 px-2 md:px-4 pt-4 w-full col-span-1 md:col-span-1">
					<div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
						<span className="dark:text-gray-50">Humidity</span>
					</div>
					<div className="flex flex-col h-full">
						<p className="text-2xl pb-2 my-auto">
							{state.day.avghumidity}%
						</p>
						<span className="text-xs italic opacity-60 pb-1">
							Dew point: {state.hour[0].dewpoint_c}°
						</span>
					</div>
				</div>
				<div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full col-span-2 md:col-span-3">
					<div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
						<span className="dark:text-gray-50">Astrology</span>
					</div>
					<div className="flex flex-col md:grid md:grid-cols-2 md:items-center">
						<div>
							<p className="pb-2 text-sm sm:text-base">
								Sunrise: {state.astro.sunrise}
							</p>
							<p className="pb-2 text-sm sm:text-base">
								Sunset: {state.astro.sunset}
							</p>
						</div>
						<p className="pb-2 text-sm sm:text-base">
							Moon Phase: {state.astro.moon_phase}
						</p>
					</div>
				</div>
				<div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full col-span-3 md:col-span-3">
					<div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
						<span className="dark:text-gray-50">Other</span>
					</div>
					<div>
						<p className="pb-2 text-sm sm:text-base">
							Max UV index: {Math.round(state.day.uv)}
						</p>
					</div>
				</div>
				<div className="relative border-2 border-gray-600 rounded-lg mt-2 px-4 pt-4 w-full col-span-3 md:col-span-1">
					<div className="absolute -top-3 left-3 px-1 bg-white text-sm dark:bg-blue-950 dark:text-gray-50">
						<span className="dark:text-gray-50">Max Wind</span>
					</div>
					<div>
						<p className="text-xl md:text-2xl pb-2">
							{state.day.maxwind_kph} Km/h
						</p>
						{/* <span className='text-xs italic opacity-60 pb-1'>Wind direction: {weatherData.wind_dir}</span> */}
					</div>
				</div>
			</div>
			<HourlySlider info={state} />
			<div className="relative w-full md:max-w-screen-md">
				<div className="absolute w-fit -top-4 right-2 md:right-0">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="w-full px-4 py-1 text-left bg-white dark:bg-slate-600 dark:text-gray-50 border rounded-full flex items-center justify-between hover:bg-gray-50"
					>
						<div className="flex align-middle gap-2">
							{getIcon(selected)}
							<span>{selected}</span>
						</div>
						<ChevronDown
							className={`w-4 h-4 transition-transform ${
								isMenuOpen ? "rotate-180" : ""
							}`}
						/>
					</button>

					{isMenuOpen && (
						<ul className="relative w-full mt-1 bg-white dark:bg-slate-600 dark:text-gray-50 border rounded-md shadow-lg z-10">
							{menuOptions.map((option) => (
								<li key={option}>
									<button
										onClick={() => {
											setSelected(option)
											setIsMenuOpen(false)
										}}
										className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
									>
										{getIcon(option)}
										<span>{option}</span>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
			<div className="w-full md:max-w-screen-md flex items-center">
				<Graph
					dataArray={dataToSend.info}
					labels={labels}
					title={dataToSend.title}
				/>
			</div>
		</div>
	)
}

export default DetailedDayData
