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

  const [isClicked, setisClicked] = useState(false);
  const [start, setstart] = useState({});
  const [destination, setdestination] = useState({});
  const [Pathweather, setPathweather] = useState([])
  const [isLoading, setisLoading] = useState(true);

  
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
    else{ 
      setisClicked(true);
      await getIntermediateLocations(start,destination);
    }
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
      {isClicked&&<div className='w-[80vw] rounded-2xl py-10 min-h-[50vh] my-10 mx-auto'>
      <WeatherPathGrid Pathweather={Pathweather} isLoading={isLoading} className="w-full"  />
      </div>
      }
        
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