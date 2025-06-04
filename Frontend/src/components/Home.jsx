import React from 'react'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 font-sans">
      <div className="bg-slate-900 rounded-lg p-12 max-w-3xl w-full text-center text-slate-100 shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-amber-400">
          Welcome to WeatherRouter
        </h1>
        <p className="text-lg mb-12">
          Plan your trips smarter by checking real-time weather forecasts for all intermediate stops along your route.
        </p>

        <ul className="space-y-5 mb-14">
          <li className="bg-slate-600 text-amber-400 rounded-lg p-5 shadow-md font-semibold">
            Enter your starting point and destination
          </li>
          <li className="bg-slate-600 text-amber-400 rounded-lg p-5 shadow-md font-semibold">
            Get estimated arrival times at intermediate locations
          </li>
          <li className="bg-slate-600 text-amber-400 rounded-lg p-5 shadow-md font-semibold">
            View real-time weather forecasts at each stop
          </li>
          <li className="bg-slate-600 text-amber-400 rounded-lg p-5 shadow-md font-semibold">
            Avoid uncomfortable weather and enjoy a smoother trip
          </li>
        </ul>

        <a
          href="/Trip"
          className="bg-amber-400 text-slate-900 px-8 py-3 rounded-md font-bold shadow-md hover:bg-amber-300 transition"
        >
          Start Planning Your Trip
        </a>
      </div>
    </div>
  )
}

export default Home
