import React from 'react';
import { useState } from 'react';
import WeatherRouteMap from './WeatherRouteMap';
import NominatimAutocomplete from './NominatimAutocomplete';
import {format} from 'date-fns';
import { MapPin, Flag, Sun, CloudRain, Cloud, Wind } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherPathGrid from './WeatherPathGrid'


const TripPlanner = () => {
//place obj example
//   {
//   "place_id": 123456789,
//   "lat": "28.6139391",
//   "lon": "77.2090212",
//   "display_name": "New Delhi, Delhi, India",
//   "address": {
//     "city": "New Delhi",
//     "state": "Delhi",
//     "country": "India",
//     "country_code": "in"
//   },
//   ...
// }


  const [start, setstart] = useState({});
  const [destination, setdestination] = useState({});
  const [Pathweather, setPathweather] = useState(
  [
  {
    town: 'Srikakulam',
    lat: 18.294943,
    lon: 83.893896,
    distance_km: '0.0',
    arrival_time: '2025-05-24T07:30:59.029Z',
    forecast: { temperature: 33.59, weather: 'sunny', wind_speed: 7.22 }
  },
  {
    town: 'Natavalasa',
    lat: 18.058965,
    lon: 83.521984,
    distance_km: '50.1',
    arrival_time: '2025-05-24T08:23:52.531Z',
    forecast: { temperature: 34.12, weather: 'light rain', wind_speed: 7.58 }
  },
  {
    town: 'Rampuram',
    lat: 17.816257,
    lon: 83.18507,
    distance_km: '100.0',
    arrival_time: '2025-05-24T09:15:41.463Z',
    forecast: { temperature: 32.99, weather: 'broken clouds', wind_speed: 6.13 }
  },
  {
    town: 'Chintalapalem',
    lat: 17.568952,
    lon: 82.862382,
    distance_km: '150.0',
    arrival_time: '2025-05-24T10:06:24.635Z',
    forecast: { temperature: 33.99, weather: 'broken clouds', wind_speed: 5.07 }
  },
  {
    town: 'Velamakotturu',
    lat: 17.333528,
    lon: 82.496633,
    distance_km: '200.1',
    arrival_time: '2025-05-24T10:56:47.705Z',
    forecast: {
      temperature: 31.92,
      weather: 'overcast clouds',
      wind_speed: 3.54
    }
  },
  {
    town: 'Krishnavaram',
    lat: 17.207514,
    lon: 82.104311,
    distance_km: '250.2',
    arrival_time: '2025-05-24T11:52:25.067Z',
    forecast: { temperature: 32.4, weather: 'overcast clouds', wind_speed: 2.51 }
  },
  {
    town: 'Kovvur',
    lat: 17.028173,
    lon: 81.721962,
    distance_km: '300.2',
    arrival_time: '2025-05-24T12:47:18.868Z',
    forecast: { temperature: 30.82, weather: 'broken clouds', wind_speed: 2.69 }
  },
  {
    town: 'Koyyalagudem',
    lat: 17.124845,
    lon: 81.317131,
    distance_km: '350.0',
    arrival_time: '2025-05-24T13:39:49.715Z',
    forecast: { temperature: 29.69, weather: 'light rain', wind_speed: 3.27 }
  },
  {
    town: 'Gunnepalli',
    lat: 17.235824,
    lon: 80.943861,
    distance_km: '400.1',
    arrival_time: '2025-05-24T14:33:29.975Z',
    forecast: { temperature: 28.36, weather: 'light rain', wind_speed: 3.49 }
  },
  {
    town: 'Nutankal',
    lat: 17.193944,
    lon: 80.508247,
    distance_km: '450.0',
    arrival_time: '2025-05-24T15:26:25.279Z',
    forecast: { temperature: 30.45, weather: 'light rain', wind_speed: 3.15 }
  },
  {
    town: 'Gurralapadu',
    lat: 17.247281,
    lon: 80.106882,
    distance_km: '500.1',
    arrival_time: '2025-05-24T16:18:39.679Z',
    forecast: { temperature: 29.94, weather: 'light rain', wind_speed: 5.94 }
  },
  {
    town: 'Suryapet',
    lat: 17.150511,
    lon: 79.668394,
    distance_km: '550.0',
    arrival_time: '2025-05-24T17:09:12.354Z',
    forecast: { temperature: 28.95, weather: 'light rain', wind_speed: 3.73 }
  },
  {
    town: 'Narkatpalli',
    lat: 17.193065,
    lon: 79.241172,
    distance_km: '600.1',
    arrival_time: '2025-05-24T18:01:01.715Z',
    forecast: {
      temperature: 28.66,
      weather: 'overcast clouds',
      wind_speed: 5.97
    }
  },
  {
    town: 'Malkapur',
    lat: 17.280221,
    lon: 78.796652,
    distance_km: '650.3',
    arrival_time: '2025-05-24T18:51:22.049Z',
    forecast: { temperature: 26.84, weather: 'light rain', wind_speed: 6.34 }
  },
  {
    town: 'Hyderabad',
    lat: 17.360505,
    lon: 78.474462,
    distance_km: '688.5',
    arrival_time: '2025-05-24T19:36:45.786Z',
    forecast: { temperature: 24.09, weather: 'broken clouds', wind_speed: 6.02 }
  }
]
)

  const [isLoading, setisLoading] = useState(true);

  
function getWeatherIcon(weather) {
  const w = weather.toLowerCase();
  if (w.includes('rain')) return <CloudRain size={48} color="#60a5fa" />;
  if (w.includes('cloud')) return <Cloud size={48} color="#94a3b8" />;
  if (w.includes('wind')) return <Wind size={48} color="#fbbf24" />;
  if (w.includes('sunny') || w.includes('clear')) return <Sun size={48} color="#facc15" />;

  // Default icon
  return <Sun size={48} color="#facc15" />;
}


  const getIntermediateLocations = async (start, destination) => {
    console.log("Got clicked by Find")
    setisLoading(true);
    setPathweather([]);
  const response = await fetch('http://localhost:3000/route/intermediate-locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        start: [start.lon, start.lat], // ORS expects [lon, lat]
        end: [destination.lon, destination.lat],
        }),
    });
  

    const data = await response.json();
    console.log(data.results);
    setisLoading(false);
    setPathweather(data.results);
    };

  const handleclick = async() => {
    if (!Object.keys(start).length || !Object.keys(destination).length) alert("Not a valid input");
    else await getIntermediateLocations(start,destination);
  }

  return (
    <div className='min-h-full py-32'>

      <div className=' w-[90vw] rounded-2xl  h-[50vh] bg-slate-900 mx-auto'>
        <div className='flex w-full h-3/4'>

          <section className='Starting w-1/2 flex items-center justify-center'>

            <div className='flex flex-col gap-4'>

              <div className='font-bold text-2xl text-white text-center'>Starting Point</div>

              <NominatimAutocomplete onSelect={(place) => {setstart(place)}
              } className="rounded-lg" />

            </div>
            
            </section>


          <section className='Destination w-1/2  flex items-center justify-center'>
            <div className='flex flex-col gap-4'>
              <div className='font-bold text-2xl text-white text-center'>Destination Point</div>
              <NominatimAutocomplete onSelect={(place) => {setdestination(place)}}
                className="rounded-lg" />
            </div>
          </section>

        </div>

        <div className='button flex justify-center items-start text-white  h-1/4'>

          <button onClick={handleclick} className='bg-amber-400 text-slate-900 px-8 font-bold text-lg py-1 rounded-lg cursor-pointer'>Find</button>

        </div>

      </div>
      <div className='w-[80vw] rounded-2xl py-10 min-h-[50vh] my-10 mx-auto'>
      <WeatherPathGrid Pathweather={Pathweather} isLoading={isLoading} className="w-full"  />
     
      </div>
        
        {
          !isLoading&&<div className='w-[80vw] rounded-2xl py-10 min-h-[50vh] my-10 mx-auto'>
            <div>
              <h1 className="text-2xl font-semibold mb-4">Route Map with Weather</h1>
              <WeatherRouteMap stops={Pathweather} className="border-4 border-black"/>
            </div>
        </div>
        }

    </div>
  )
}

export default TripPlanner