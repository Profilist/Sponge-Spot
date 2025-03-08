import React from 'react';
import { Filters } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface FiltersPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, setFilters }) => {
  const ownershipOptions = ['government', 'private'];
  const zoningOptions = ['green-space', 'commercial', 'industrial', 'residential'];

  const handleOwnershipChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      ownership: prev.ownership.includes(value)
        ? prev.ownership.filter(item => item !== value)
        : [...prev.ownership, value]
    }));
  };

  const handleZoningChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      zoning: prev.zoning.includes(value)
        ? prev.zoning.filter(item => item !== value)
        : [...prev.zoning, value]
    }));
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 space-y-6 border border-white/5">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-[#89CFF0]" />
        <h2 className="text-lg font-semibold text-[#89CFF0]">Filters</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#89CFF0]/90 mb-2">Land Ownership</h3>
          <div className="space-y-2">
            {ownershipOptions.map(option => (
              <label key={option} className="flex items-center p-2 hover:bg-white/5 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={filters.ownership.includes(option)}
                  onChange={() => handleOwnershipChange(option)}
                  className="rounded border-[#89CFF0]/30 text-[#89CFF0] focus:ring-[#89CFF0] bg-black/30"
                />
                <span className="ml-2 text-sm text-[#89CFF0]/70 capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#89CFF0]/90 mb-2">Zoning Type</h3>
          <div className="space-y-2">
            {zoningOptions.map(option => (
              <label key={option} className="flex items-center p-2 hover:bg-white/5 rounded-lg transition-all">
                <input
                  type="checkbox"
                  checked={filters.zoning.includes(option)}
                  onChange={() => handleZoningChange(option)}
                  className="rounded border-[#89CFF0]/30 text-[#89CFF0] focus:ring-[#89CFF0] bg-black/30"
                />
                <span className="ml-2 text-sm text-[#89CFF0]/70 capitalize">{option.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#89CFF0]/90 mb-2">Population Density</h3>
          <input
            type="range"
            min="0"
            max="50000"
            value={filters.minPopulation}
            onChange={(e) => setFilters(prev => ({ ...prev, minPopulation: parseInt(e.target.value) }))}
            className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-[#89CFF0]"
          />
          <div className="text-sm text-[#89CFF0]/70 mt-1">
            Min: {filters.minPopulation.toLocaleString()} people
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#89CFF0]/90 mb-2">Maximum Budget</h3>
          <input
            type="range"
            min="1000000"
            max="10000000"
            step="100000"
            value={filters.maxBudget}
            onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: parseInt(e.target.value) }))}
            className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer accent-[#89CFF0]"
          />
          <div className="text-sm text-[#89CFF0]/70 mt-1">
            Max: ${(filters.maxBudget / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>
    </div>
  );
};