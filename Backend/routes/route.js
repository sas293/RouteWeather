    import express from 'express'
    import axios from 'axios';
    import dotenv from 'dotenv'
    import haversine from 'haversine-distance';

   
    dotenv.config();
    const router  = express.Router();


    const ORS_API_KEY = process.env.ORS_API_KEY;
    const OWM_API_KEY = 'b0e7f22f91342e94c66a9602440a4913'

  
    router.post('/intermediate-locations',async(req,res)=>{
        // first I need to extract the starting and destination cities from the request 
        //then send these locations to 
        console.log("Some one has hit the intermediate endpoint")
        const {start,end} = req.body;
        console.log(start," ",end);
        if(!start || !end){ 
            return res.status(400).json({error:"Missing start or end coordinates"})
        }

        try{
           const results = await getRouteWeather(start,end);
           console.log("samled items: \n",results);
           res.json({ results });

        }
        catch(e){
          return res.status(400).json({error:'Falied to get intermediate towns'})
        }

    })

    export default router



// === Fetch Route from ORS API ===
async function fetchRoute(start, end) {
  const response = await axios.post(
    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
    { coordinates: [start, end] },
    {
      headers: {
        Authorization: ORS_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
}

// === Compute Cumulative Distances (Haversine between all points) ===
function computeCumulativeDistances(coords) {
  const distances = [0];
  for (let i = 1; i < coords.length; i++) {
    const prev = { lat: coords[i - 1][1], lon: coords[i - 1][0] };
    const curr = { lat: coords[i][1], lon: coords[i][0] };
    const d = haversine(prev, curr); // meters
    distances.push(distances[i - 1] + d);
  }
  return distances;
}

// === Dynamic Sampling Interval (max 15 points, min 10km step) ===
function getSamplingInterval(totalDistanceMeters) {
  const maxPoints = 15;
  let interval = totalDistanceMeters / maxPoints;

  if (interval < 10000) return 10000;
  if (interval < 20000) return 20000;
  if (interval < 30000) return 30000;

  return Math.ceil(interval / 10000) * 10000;
}


// === Sample Points Based on Distance Interval ===
function samplePoints(coords, distances, interval) {
  const sampled = [];
  let nextTarget = interval;

  for (let i = 0; i < distances.length; i++) {
    if (distances[i] >= nextTarget) {
      sampled.push({ coord: coords[i], distance: distances[i], index: i });
      nextTarget += interval;
    }
  }

  // Always include start and end points
  if (sampled[0]?.index !== 0)
    sampled.unshift({ coord: coords[0], distance: 0, index: 0 });

  if (sampled.at(-1)?.index !== coords.length - 1)
    sampled.push({
      coord: coords.at(-1),
      distance: distances.at(-1),
      index: coords.length - 1,
    });

  return sampled;
}

// === Compute Blended Arrival Times from ORS Steps and Distance-Based Speed Estimate ===
function computeBlendedArrivalTimes(coords, steps, distances) {
  if (!steps || !Array.isArray(steps)) {
    throw new Error('ORS steps missing or malformed.');
  }

  const orsArrival = Array(coords.length).fill(0);
  const avgSpeed = 11.89; // 50 km/h in m/s

  for (const step of steps) {
    const [startIdx, endIdx] = step.way_points;
    const stepLength = endIdx - startIdx;
    if (stepLength <= 0) continue;

    const durationPerStep = step.duration / stepLength;
    for (let i = startIdx + 1; i <= endIdx; i++) {
      orsArrival[i] = orsArrival[i - 1] + durationPerStep;
    }
  }

  const distanceBased = distances.map(d => d / avgSpeed);
  const blended = orsArrival.map((t, i) => (t + distanceBased[i]) / 2);
  return blended;
}

// === Fetch Weather Forecast Closest to Timestamp ===
async function fetchWeather(lat, lon, timestamp) {
  const weatherRes = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: { lat, lon, appid: OWM_API_KEY, units: 'metric' },
  });

  const forecasts = weatherRes.data.list;
  const closest = forecasts.reduce((prev, curr) => {
    return Math.abs(curr.dt * 1000 - timestamp) < Math.abs(prev.dt * 1000 - timestamp)
      ? curr
      : prev;
  });

  return closest;
}

// === Reverse Geocode to Get City/Town Name ===
async function reverseGeocode(lat, lon) {
  const geoRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: { lat, lon, format: 'json' },
    headers: { 'User-Agent': 'TripPlanner/1.0' },
  });

  const addr = geoRes.data.address;
  return addr.city || addr.town || addr.village || addr.county || 'Unknown';
}

// === MAIN FUNCTION: Get Weather at Route Sample Points ===
export async function getRouteWeather(start, end) {
  try {
    const routeData = await fetchRoute(start, end);
    const coords = routeData.features[0].geometry.coordinates;
    const steps = routeData.features[0].properties.segments[0]?.steps;

    const distances = computeCumulativeDistances(coords);
    const totalDistance = distances.at(-1);
    const interval = getSamplingInterval(totalDistance);

    const sampled = samplePoints(coords, distances, interval);
    const allArrivalTimes = computeBlendedArrivalTimes(coords, steps, distances);
    const arrivalTimes = sampled.map(p => allArrivalTimes[p.index]);

    const now = Date.now();
    const results = [];

    for (let i = 0; i < sampled.length; i++) {
      const point = sampled[i];
      const [lon, lat] = point.coord;
      const timestamp = now + arrivalTimes[i] * 1000;

      const forecast = await fetchWeather(lat, lon, timestamp);
      const location = await reverseGeocode(lat, lon);

      results.push({
        town: location,
        lat,
        lon,
        distance_km: (point.distance / 1000).toFixed(1),
        arrival_time: new Date(timestamp).toISOString(),
        forecast: {
          temperature: forecast.main.temp,
          weather: forecast.weather[0].description,
          wind_speed: forecast.wind.speed,
        },
      });
    }

    return results;
  } catch (err) {
    console.error('Error generating weather forecast route:', err);
    throw err;
  }
}