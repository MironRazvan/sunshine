import React from "react"
import { Github, Linkedin, Mail } from "lucide-react"

const About: React.FC = () => {
	return (
		<div className="flex flex-col min-h-screen p-2 md:p-6 dark:bg-blue-950 dark:text-gray-50">
			<div className="max-w-3xl mx-auto w-full space-y-8">
				{/* Project Section */}
				<section className="space-y-4">
					<h1 className="text-3xl font-bold">About Weather App</h1>
					<p className="text-lg leading-relaxed">
						This weather application was built to provide a clean,
						intuitive interface for accessing weather data. It
						focuses on delivering essential weather information in a
						user-friendly format, with features like hourly
						forecasts, weekly predictions, and detailed weather
						metrics.
					</p>

					<div className="space-y-2">
						<h2 className="text-xl font-semibold">Key Features</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Real-time weather data from WeatherAPI</li>
							<li>Location search with autocomplete</li>
							<li>Hourly and weekly weather forecasts</li>
							<li>
								Detailed weather metrics (temperature, wind,
								humidity, etc.)
							</li>
							<li>Favorite locations management</li>
							<li>Dark mode support</li>
							<li>Responsive design for all devices</li>
						</ul>
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-semibold">
							Technologies Used
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							<div className="p-4 rounded-lg bg-gray-100 dark:bg-slate-800">
								<h3 className="font-medium">Frontend</h3>
								<ul className="text-sm space-y-1 mt-2">
									<li>React</li>
									<li>TypeScript</li>
									<li>Tailwind CSS</li>
									<li>React Router</li>
								</ul>
							</div>
							<div className="p-4 rounded-lg bg-gray-100 dark:bg-slate-800">
								<h3 className="font-medium">
									State Management
								</h3>
								<ul className="text-sm space-y-1 mt-2">
									<li>Zustand</li>
									<li>Local Storage</li>
								</ul>
							</div>
							<div className="p-4 rounded-lg bg-gray-100 dark:bg-slate-800">
								<h3 className="font-medium">APIs & Services</h3>
								<ul className="text-sm space-y-1 mt-2">
									<li>WeatherAPI</li>
									<li>Geolocation API</li>
								</ul>
							</div>
						</div>
					</div>
				</section>

				{/* Developer Section */}
				<section className="space-y-4 pt-8">
					<h2 className="text-2xl font-bold">About the Developer</h2>
					<p className="text-lg leading-relaxed">
						Hi! I'm Răzvan, a passionate web developer focused on
						creating intuitive and user-friendly applications. This
						project represents my commitment to clean code, modern
						web technologies, and responsive design.
					</p>

					<div className="flex gap-1 md:gap-4 pt-4">
						<a
							href="https://github.com/MironRazvan"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
						>
							<Github size={20} />
							<span>GitHub</span>
						</a>
						<a
							href="https://linkedin.com/in/razvan-alexandru-miron-3321ba207/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
						>
							<Linkedin size={20} />
							<span>LinkedIn</span>
						</a>
						<a
							href="mailto:mironrzvn@gmail.com"
							className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
						>
							<Mail size={20} />
							<span>Email</span>
						</a>
					</div>
				</section>
			</div>
		</div>
	)
}

export default About
