export interface SpongeLocation {
  id: number;
  name: string;
  coordinates: [number, number];
  description: string;
  score: number;
  benefits: string[];
  imageUrl: string;
  ownership: 'government' | 'private';
  zoning: 'green-space' | 'commercial' | 'industrial' | 'residential';
  population: number;
  budget: number;
}

export interface Filters {
  ownership: string[];
  zoning: string[];
  minPopulation: number;
  maxBudget: number;
}