import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { spongeLocations } from './data';
import { LocationCard } from './components/LocationCard';
import { FiltersPanel } from './components/FiltersPanel';
import { Filters } from './types';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import './styles/LoadingSpinner.css';
import LoadingSpinner from './components/LoadingSpinner';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [selectedLocation, setSelectedLocation] = useState(spongeLocations[0]);
  const [filters, setFilters] = useState<Filters>({
    ownership: [],
    zoning: [],
    minPopulation: 0,
    maxBudget: 10000000,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const delay = Math.floor(Math.random() * (7000 - 4000 + 1) + 4000);
    const timer = setTimeout(() => {
      setIsLoading(false);
      let index = Math.floor(Math.random() * 15) + 1;
      setSelectedLocation(spongeLocations[index]);
    }, delay);
    return () => {
      clearTimeout(timer);
    }
  }, []);

  const filteredLocations = useMemo(() => {
    return spongeLocations.filter(location => {
      const matchesOwnership = filters.ownership.length === 0 || filters.ownership.includes(location.ownership);
      const matchesZoning = filters.zoning.length === 0 || filters.zoning.includes(location.zoning);
      const matchesPopulation = location.population >= filters.minPopulation;
      const matchesBudget = location.budget <= filters.maxBudget;

      return matchesOwnership && matchesZoning && matchesPopulation && matchesBudget;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#61c67a] via-[#000053]/80 to-[#61c67a]">
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
              <img src="/sponge-spot.png" alt="Sponge Spot" className="mx-auto"></img>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <FiltersPanel filters={filters} setFilters={setFilters} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/5" style={{ height: '600px' }}>
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <LoadingSpinner className="min-h-[200px]" />
                </div>
              ) : (
                <MapContainer
                  center={[43.6532, -79.3832]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={location.coordinates}
                      eventHandlers={{
                        click: () => setSelectedLocation(location),
                      }}
                    >
                      <Popup className="bg-black/90 text-[#89CFF0]">
                        <div className="font-semibold">{location.name}</div>
                        <div className="text-sm text-[#89CFF0]/70">Score: {location.score}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>
          </div>
          <div>
            <LocationCard location={selectedLocation} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;