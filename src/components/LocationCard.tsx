import React from 'react';
import { SpongeLocation } from '../types';
import { Droplets, ThermometerSun, Trees, Building2, Users, Wallet } from 'lucide-react';

interface LocationCardProps {
  location: SpongeLocation;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-white/5">
      <img 
        src={location.imageUrl} 
        alt={location.name}
        className="w-full h-48 object-cover opacity-90"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#89CFF0]">{location.name}</h3>
          <span className="px-3 py-1 bg-black/50 text-[#89CFF0] rounded-full text-sm font-medium">
            Score: {location.score}
          </span>
        </div>
        <p className="text-[#89CFF0]/70 mb-4">{location.description}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#89CFF0]/70" />
            <span className="text-sm text-[#89CFF0]/70 capitalize">
              {location.ownership} Owned | {location.zoning.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#89CFF0]/70" />
            <span className="text-sm text-[#89CFF0]/70">
              {location.population.toLocaleString()} nearby residents
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#89CFF0]/70" />
            <span className="text-sm text-[#89CFF0]/70">
              ${(location.budget / 1000000).toFixed(1)}M budget
            </span>
          </div>
          <div className="pt-3 space-y-2 border-t border-white/5">
            {location.benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-lg transition-all"
              >
                {/* Icon selection based on benefit type */}
                {benefit.toLowerCase().includes('water') && <Droplets className="w-5 h-5 text-[#89CFF0]/70" />}
                {benefit.toLowerCase().includes('cool') && <ThermometerSun className="w-5 h-5 text-[#89CFF0]/70" />}
                {(benefit.toLowerCase().includes('bio') || benefit.toLowerCase().includes('wildlife')) && 
                  <Trees className="w-5 h-5 text-[#89CFF0]/70" />}
                {!benefit.toLowerCase().includes('water') && 
                 !benefit.toLowerCase().includes('cool') && 
                 !benefit.toLowerCase().includes('bio') && 
                 !benefit.toLowerCase().includes('wildlife') && 
                  <Building2 className="w-5 h-5 text-[#89CFF0]/70" />}
                <span className="text-sm text-[#89CFF0]/70">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};