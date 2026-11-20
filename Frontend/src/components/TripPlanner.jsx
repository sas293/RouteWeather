import React from 'react';
import { useState } from 'react';
import WeatherRouteMap from './WeatherRouteMap';
import NominatimAutocomplete from './NominatimAutocomplete';
import WeatherPathGrid from './WeatherPathGrid';


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
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getIntermediateLocations = async (start, destination) => {
    setisLoading(true);
    setError('');
    setPathweather([]);
    try {
      const response = await fetch(`${apiUrl}/route/intermediate-locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: [start.lon, start.lat], // ORS expects [lon, lat]
          end: [destination.lon, destination.lat],
        }),
      });

      // Backend errors are JSON ({ error }), but a proxy/crash may return HTML, so don't trust the body.
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status}). Please try again.`);
      }

      setPathweather(data.results ?? []);
    } catch (err) {
      // fetch rejects with TypeError when the server is unreachable.
      setError(err instanceof TypeError ? 'Could not reach the server. Check your connection and try again.' : err.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleclick = async () => {
    if (isLoading) return;
    if (!start.lat || !destination.lat) {
      setError('Please pick both a starting point and a destination from the suggestions.');
      return;
    }
    if (start.lat === destination.lat && start.lon === destination.lon) {
      setError('Starting point and destination are the same.');
      return;
    }
    setisClicked(true);
    await getIntermediateLocations(start, destination);
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

        <div className='button flex flex-col gap-2 items-center text-white  h-1/4'>

          <button onClick={handleclick} disabled={isLoading} className='bg-amber-400 text-slate-900 px-8 font-bold text-lg py-1 rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
            {isLoading ? 'Finding…' : 'Find'}
          </button>

          {error && <p role='alert' className='text-red-400 text-sm text-center px-4'>{error}</p>}

        </div>

      </div>
      {isClicked&&!error&&<div className='w-[80vw] rounded-2xl py-10 min-h-[50vh] my-10 mx-auto'>
      <WeatherPathGrid Pathweather={Pathweather} isLoading={isLoading} className="w-full"  />
      </div>
      }
        
        {
          !isLoading&&Pathweather.length>0&&<div className='w-[80vw] rounded-2xl py-10 min-h-[50vh] my-10 mx-auto'>
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