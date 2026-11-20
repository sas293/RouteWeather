import React from "react";
import { format } from "date-fns";
import {
  Cloud,
  CloudRain,
  Wind,
  Sun,
  MapPin,
  Flag,
} from "react-feather";

// Helper: chunk array by size
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Check if current row is the last
function isLastRow(rowIndex, totalBoxes, rowSize = 3) {
  const rowsCount = Math.ceil(totalBoxes / rowSize);
  return rowIndex === rowsCount - 1;
}

// Weather icon selector
function getWeatherIcon(weather) {
  const w = weather.toLowerCase();
  if (w.includes("rain")) return <CloudRain size={48} color="#60a5fa" />;
  if (w.includes("cloud")) return <Cloud size={48} color="#94a3b8" />;
  if (w.includes("wind")) return <Wind size={48} color="#fbbf24" />;
  if (w.includes("sunny") || w.includes("clear"))
    return <Sun size={48} color="#facc15" />;
  return <Sun size={48} color="#facc15" />;
}

export default function WeatherPathGrid({ Pathweather, isLoading }) {
  const rowSize = 3;
  let rows = [];

  if (Pathweather && Array.isArray(Pathweather) && Pathweather.length > 0) {
    rows = chunkArray(Pathweather, rowSize);
  }

  return (
    <div className="w-full max-w-full px-6 mx-auto">
      <style>{`
        @keyframes slideInBottom {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-bottom {
          animation: slideInBottom 0.6s ease-out;
        }
      `}</style>

      {isLoading ? (
        <div>Loading...</div>
      ) : rows.length === 0 ? (
        <div>No data available</div>
      ) : (
        rows.map((row, rowIndex) => {
          const isOddRow = rowIndex % 2 === 1;
          const displayedRow = isOddRow ? [...row].reverse() : row;
          const lastRow = isLastRow(rowIndex, Pathweather.length, rowSize);
          const isPartialRow = row.length < rowSize;

          return (
            <div
              key={rowIndex}
              className={`relative flex flex-wrap gap-x-10 gap-y-24 mb-24 transition-transform duration-500 ease-out animate-slide-in-bottom ${
                isOddRow && lastRow && isPartialRow
                  ? "justify-end"
                  : "justify-between"
              }`}
            >
              {displayedRow.map((place, boxIndex) => {
                const originalIndex = isOddRow
                  ? row.length - 1 - boxIndex + rowIndex * rowSize
                  : boxIndex + rowIndex * rowSize;

                const isFirstBox = boxIndex === 0;
                const isLastBox = boxIndex === displayedRow.length - 1;
                const showVerticalLine =
                  !lastRow &&
                  ((rowIndex % 2 === 0 && isLastBox) ||
                    (rowIndex % 2 === 1 && isFirstBox));

                return (
                  <div
                    key={place.town + originalIndex}
                    className="relative flex flex-col items-center bg-slate-900 rounded-xl p-4 shadow-lg text-white border border-white w-full max-w-[280px] min-h-[260px] flex-shrink-0 animate-slide-in-bottom"
                  >
                    {/* Start / End Icons */}
                    <div className="absolute top-3 left-3">
                      {originalIndex === 0 && (
                        <MapPin size={30} color="green" title="Start Point" />
                      )}
                      {originalIndex === Pathweather.length - 1 && (
                        <Flag size={30} color="red" title="End Point" />
                      )}
                    </div>

                    {/* Weather Icon */}
                    <div className="mb-3 flex justify-center text-5xl">
                      {getWeatherIcon(place.forecast.weather)}
                    </div>

                    {/* Town Name */}
                    <h2 className="text-lg font-semibold mb-1 text-center">
                      {place.town}
                    </h2>

                    {/* Weather Info */}
                    <ul className="space-y-0.5 text-xs text-slate-300 text-center">
                      <li>
                        <span className="text-white">Distance:</span>{" "}
                        {place.distance_km} km
                      </li>
                      <li>
                        <span className="text-white">Arrival:</span>{" "}
                        {format(new Date(place.arrival_time), "PPpp")}
                      </li>
                      <li>
                        <span className="text-white">Weather:</span>{" "}
                        {place.forecast.weather}
                      </li>
                      <li>
                        <span className="text-white">Wind:</span>{" "}
                        {place.forecast?.windSpeed} m/s
                      </li>
                    </ul>

                    {/* Horizontal connector */}
                    {!isLastBox && (
                      <svg
                        className="absolute top-1/2 right-[-90px] -translate-y-1/2"
                        width="90"
                        height="20"
                        viewBox="0 0 90 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="0"
                          y1="10"
                          x2="90"
                          y2="10"
                          stroke="#8B4513"
                          strokeWidth="6"
                          strokeDasharray="12 6"
                          strokeLinecap="round"
                          filter="url(#shadow)"
                        />
                        <defs>
                          <filter
                            id="shadow"
                            x="-5"
                            y="0"
                            width="100"
                            height="20"
                            filterUnits="userSpaceOnUse"
                          >
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="1"
                              floodColor="#5c3a0a"
                            />
                          </filter>
                        </defs>
                      </svg>
                    )}

                    {/* Vertical connector */}
                    {showVerticalLine && (
                      <svg
                        className="absolute bottom-[-90px] left-1/2 -translate-x-1/2"
                        width="20"
                        height="90"
                        viewBox="0 0 20 90"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="10"
                          y1="0"
                          x2="10"
                          y2="90"
                          stroke="#8B4513"
                          strokeWidth="6"
                          strokeDasharray="12 6"
                          strokeLinecap="round"
                          filter="url(#shadowV)"
                        />
                        <defs>
                          <filter
                            id="shadowV"
                            x="0"
                            y="0"
                            width="20"
                            height="90"
                            filterUnits="userSpaceOnUse"
                          >
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="1"
                              floodColor="#5c3a0a"
                            />
                          </filter>
                        </defs>
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
