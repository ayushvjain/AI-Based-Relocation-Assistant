import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

export interface Recommendation {
  Address: string;
  Area_Name: string;
  Bath: number;
  Bed: number;
  Rent: number;
  // other attributes if needed
  lat?: number;
  lng?: number;
}

interface GoogleMapComponentProps {
  recommendations: Recommendation[];
}

const containerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 42.3601, // e.g. center on Boston
  lng: -71.0589
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ recommendations }) => {
  const [markers, setMarkers] = useState<Recommendation[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Recommendation | null>(null);

  // Geocode each recommendation's address to get coordinates.
  // This uses the built-in Google Maps Geocoder. Make sure the Maps JavaScript API is loaded.
  useEffect(() => {
    if (window.google && recommendations.length > 0) {
      const geocoder = new window.google.maps.Geocoder();
      Promise.all(
        recommendations.map(rec =>
          new Promise<Recommendation>((resolve) => {
            geocoder.geocode({ address: rec.Address }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                resolve({ ...rec, lat: location.lat(), lng: location.lng() });
              } else {
                console.error('Geocode error:', status);
                resolve(rec); // resolve without coordinates if geocoding fails
              }
            });
          })
        )
      ).then(geocoded => {
        setMarkers(geocoded);
      });
    }
  }, [recommendations]);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={12}>
        {markers.map((marker, idx) =>
          marker.lat && marker.lng ? (
            <Marker
              key={idx}
              position={{ lat: marker.lat, lng: marker.lng }}
              onMouseOver={() => setSelectedMarker(marker)}
              onMouseOut={() => setSelectedMarker(null)}
            />
          ) : null
        )}
        {selectedMarker && selectedMarker.lat && selectedMarker.lng && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ maxWidth: '200px' }}>
              <h4>{selectedMarker.Address}</h4>
              <p><strong>Area:</strong> {selectedMarker.Area_Name}</p>
              <p><strong>Bedrooms:</strong> {selectedMarker.Bed}</p>
              <p><strong>Bathrooms:</strong> {selectedMarker.Bath}</p>
              <p><strong>Rent:</strong> ${selectedMarker.Rent}</p>
              {/* Add additional property details as needed */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
