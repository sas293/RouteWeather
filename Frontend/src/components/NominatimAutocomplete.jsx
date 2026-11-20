import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NominatimAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (selectedPlace) {
      // If a place is selected, don't fetch suggestions
      setSuggestions([]);
      return;
    }

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Photon is built for type-ahead; Nominatim's usage policy forbids client-side autocomplete (and 429s it).
        const res = await axios.get("https://photon.komoot.io/api/", {
          params: { q: query, limit: 5 },
        });
        setSuggestions(
          res.data.features.map(({ properties: p, geometry }) => ({
            place_id: `${p.osm_type}${p.osm_id}`,
            lon: geometry.coordinates[0],
            lat: geometry.coordinates[1],
            display_name: [...new Set([p.name, p.city, p.state, p.country].filter(Boolean))].join(", "),
          }))
        );
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query, selectedPlace]);

  const handleSelect = (place) => {
    setSelectedPlace(place);
    setQuery(place.display_name);
    setSuggestions([]);
    if (onSelect) onSelect(place);
  };

  // If user edits input after selection, clear selectedPlace so suggestions come back
  const handleChange = (e) => {
    setQuery(e.target.value);
    if (selectedPlace) {
      setSelectedPlace(null);
      if (onSelect) onSelect({}); // text no longer matches the picked place, so un-pick it in the parent too
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
      className="px-6 py-2 rounded-xl bg-amber-400 outline-none"
        type="text"
        value={query}
        placeholder="Enter location"
        onChange={handleChange}
        
      />
      {loading && <div className="bg-amber-300 text-black rounded-lg my-2">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="rounded-lg suggestions-list "
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            margin: 0,
            padding: 0,
            listStyle: "none",
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 1000,

          }}
        >
          {suggestions.map((place) => (
            <li className=" border-b-2 border-amber-400  bg-orange-200  text-black"
              key={place.place_id}
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// border-b-2 border-black bg-amber-400