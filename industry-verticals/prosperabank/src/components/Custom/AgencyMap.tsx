import React, { useEffect, useRef, JSX } from 'react';
import type L from 'leaflet';
// Import Leaflet CSS statically for Next.js
import 'leaflet/dist/leaflet.css';

interface Agency {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  latitude: number;
  longitude: number;
  products: string[];
}

interface AgencyMapProps {
  agencies: Agency[];
  selectedAgency: Agency | null;
  onAgencySelect: (agency: Agency) => void;
}

const AgencyMap = ({ agencies, selectedAgency, onAgencySelect }: AgencyMapProps): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || agencies.length === 0) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    // Dynamically load Leaflet
    const loadMap = async () => {
      try {
        const L = await import('leaflet');

        // Clean up existing map if present
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Clear existing map container
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        // Calculate center point from all agencies
        const avgLat = agencies.reduce((sum, a) => sum + a.latitude, 0) / agencies.length;
        const avgLng = agencies.reduce((sum, a) => sum + a.longitude, 0) / agencies.length;

        // Create map
        const map = L.map(mapRef.current as HTMLElement, {
          center: [avgLat, avgLng],
          zoom: agencies.length === 1 ? 14 : 12,
        });

        mapInstanceRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add markers for each agency
        agencies.forEach((agency) => {
          const isSelected = selectedAgency?.id === agency.id;

          // Create custom icon
          const iconHtml = `
            <div class="custom-marker ${isSelected ? 'selected' : ''}">
              <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 25 15 25s15-13.75 15-25C30 6.716 23.284 0 15 0z" 
                      fill="${isSelected ? '#002c5f' : '#0073e6'}"/>
                <circle cx="15" cy="15" r="8" fill="white"/>
              </svg>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-div-icon',
            iconSize: [30, 40],
            iconAnchor: [15, 40],
          });

          const marker = L.marker([agency.latitude, agency.longitude], {
            icon: customIcon,
          }).addTo(map);

          // Create popup
          const popupContent = `
            <div class="agency-map-popup">
              <h4>${agency.name}</h4>
              <p>${agency.address}</p>
              <p>${agency.city}, ${agency.state} ${agency.zip}</p>
              <p><a href="tel:${agency.phone}">${agency.phone}</a></p>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Handle marker click
          marker.on('click', () => {
            onAgencySelect(agency);
          });
        });

        // Fit map to show all markers if multiple agencies
        if (agencies.length > 1) {
          const latlngs = agencies.map((a) => L.latLng(a.latitude, a.longitude));
          const bounds = L.latLngBounds(latlngs);
          map.fitBounds(bounds, { padding: [20, 20] });
        }
      } catch (error) {
        console.error('Error loading map:', error);
        // Fallback: show a placeholder
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #666;">
              <p>Map loading... Please install leaflet: npm install leaflet @types/leaflet</p>
            </div>
          `;
        }
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [agencies, selectedAgency, onAgencySelect]);

  if (agencies.length === 0) {
    return (
      <div className="agency-map-empty">
        <p>Enter a search to view agencies on the map</p>
      </div>
    );
  }

  return <div ref={mapRef} className="agency-map-container" />;
};

export default AgencyMap;
