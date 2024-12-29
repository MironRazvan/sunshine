import React from "react"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
	CategoryScale, // For X-axis as "category"
	LinearScale, // For Y-axis
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

interface ComponentProps {
	dataArray: number[]
	labels: string[]
	title: string
}

const Graph: React.FC<ComponentProps> = ({ dataArray, labels, title }) => {
	const data = {
		labels: labels,
		datasets: [
			{
				label: title,
				data: dataArray,
				fill: false,
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 2,
			},
		],
	}

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
			},
		},
		scales: {
			x: {
				grid: { display: false },
			},
			y: {
				beginAtZero: true,
			},
		},
	}

	return (
		<div className="w-full md:max-w-screen-md flex flex-col self-center align-middle items-center relative pt-4">
			<div className="w-full md:max-w-screen-md flex self-center align-middle">
				<Line data={data} options={options} />
			</div>
		</div>
	)
}

export default Graph
