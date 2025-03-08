import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import geopandas as gpd
import warnings
warnings.filterwarnings('ignore')

# Get Toronto geographical data
def get_data(n_samples=1000):
    np.random.seed(42)
    
    # Approximate Toronto boundaries
    lat_min, lat_max = 43.58, 43.85
    lon_min, lon_max = -79.62, -79.12
    
    data = {
        'latitude': np.random.uniform(lat_min, lat_max, n_samples),
        'longitude': np.random.uniform(lon_min, lon_max, n_samples),
        
        # environmental factors
        'flood_risk': np.random.uniform(0, 1, n_samples),
        'elevation': np.random.normal(100, 20, n_samples),
        'proximity_to_water': np.random.uniform(0, 5, n_samples),  # km
        'green_space_density': np.random.uniform(0, 1, n_samples),
        'population_density': np.random.exponential(1000, n_samples),
        'impervious_surface_ratio': np.random.uniform(0.3, 0.9, n_samples),
        'annual_rainfall': np.random.normal(800, 50, n_samples),  # mm
        'heat_island_intensity': np.random.uniform(0, 5, n_samples),  # °C above baseline
        
        # infrastructure factors
        'distance_to_storm_drains': np.random.uniform(0, 2, n_samples),  # km
        'soil_permeability': np.random.uniform(0, 1, n_samples),
        'land_availability': np.random.uniform(0, 1, n_samples),
        
        # economic factors
        'property_value': np.random.lognormal(11, 1, n_samples),
        'community_support': np.random.uniform(0, 1, n_samples)
    }
    
    return pd.DataFrame(data)

class SpongeParkPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        
    def calculate_suitability_score(self, data):
        """Calculate initial suitability score based on key factors"""
        weights = {
            'flood_risk': 0.25,
            'population_density': 0.15,
            'green_space_density': 0.10,
            'heat_island_intensity': 0.15,
            'soil_permeability': 0.15,
            'land_availability': 0.10,
            'community_support': 0.10
        }
        
        score = np.zeros(len(data))
        for factor, weight in weights.items():
            score += data[factor] * weight
            
        return score
    
    def train(self, data):
        """Train the model using synthetic data"""
        # Calculate initial suitability scores
        y = self.calculate_suitability_score(data)
        
        # Select features for training
        feature_columns = [
            'latitude', 'longitude', 'flood_risk', 'elevation',
            'proximity_to_water', 'green_space_density', 'population_density',
            'impervious_surface_ratio', 'annual_rainfall', 'heat_island_intensity',
            'distance_to_storm_drains', 'soil_permeability', 'land_availability',
            'property_value', 'community_support'
        ]
        
        X = data[feature_columns]
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Calculate and print model performance
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"Model R² score (train): {train_score:.3f}")
        print(f"Model R² score (test): {test_score:.3f}")
        
        # Get feature importance
        feature_importance = pd.DataFrame({
            'feature': feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 5 most important features:")
        print(feature_importance.head())
        
    def predict_locations(self, data, n_recommendations=5):
        """Predict the best locations for sponge parks"""
        X = data[self.model.feature_names_in_]
        X_scaled = self.scaler.transform(X)
        
        # Get predictions
        predictions = self.model.predict(X_scaled)
        
        # Add predictions to data
        results = data.copy()
        results['suitability_score'] = predictions
        
        # Get top recommendations
        top_locations = results.nlargest(n_recommendations, 'suitability_score')
        
        return top_locations[['latitude', 'longitude', 'suitability_score']]

def main():
    print("Gathering Toronto data...")
    data = get_data()
    
    print("\nInitializing Sponge Park Predictor...")
    predictor = SpongeParkPredictor()
    
    print("\nTraining model...")
    predictor.train(data)
    
    print("\nPredicting top locations for sponge parks...")
    top_locations = predictor.predict_locations(data)
    
    print("\nRecommended locations for sponge parks:")
    print(top_locations.to_string(index=False))

if __name__ == "__main__":
    main()
