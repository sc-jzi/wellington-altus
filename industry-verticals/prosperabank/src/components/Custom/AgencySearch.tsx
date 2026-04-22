import React, { useState, useRef, useEffect, JSX } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./AgencyMap'), {
  ssr: false,
  loading: () => <div className="agency-map-loading">Loading map...</div>,
});

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

interface Fields {
  Title: Field<string>;
  Subtitle: Field<string>;
}

export type AgencySearchProps = {
  params: { [key: string]: string };
  fields: Fields;
};

// Mock data for demo purposes - Lake Michigan Credit Union locations in Grand Rapids
const mockAgencies: Agency[] = [
  {
    id: '1',
    name: 'Lake Michigan Credit Union - Grand Rapids NE',
    address: '3000 Plainfield Avenue NE',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49505',
    phone: '(616) 242-9790',
    latitude: 42.9834,
    longitude: -85.6101,
    products: ['Auto', 'Home', 'Business'],
  },
  {
    id: '2',
    name: 'Lake Michigan Credit Union - Grand Rapids NW',
    address: '2500 Alpine Avenue NW',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49544',
    phone: '(616) 242-9791',
    latitude: 42.9789,
    longitude: -85.6823,
    products: ['Auto', 'Home', 'Life'],
  },
  {
    id: '3',
    name: 'Lake Michigan Credit Union - Grand Rapids SE',
    address: '2800 28th Street SE',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49512',
    phone: '(616) 242-9792',
    latitude: 42.9206,
    longitude: -85.5801,
    products: ['Commercial', 'Auto', 'Farm'],
  },
  {
    id: '4',
    name: 'Lake Michigan Credit Union - Grand Rapids SW',
    address: '3500 Wilson Avenue SW',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49534',
    phone: '(616) 242-9793',
    latitude: 42.9201,
    longitude: -85.6823,
    products: ['Business', 'Commercial', 'Auto'],
  },
  {
    id: '5',
    name: 'Lake Michigan Credit Union - Downtown Grand Rapids',
    address: '100 Ottawa Avenue NW',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49503',
    phone: '(616) 242-9794',
    latitude: 42.9634,
    longitude: -85.6681,
    products: ['Auto', 'Home', 'Renters'],
  },
  {
    id: '6',
    name: 'Lake Michigan Credit Union - East Grand Rapids',
    address: '2200 Wealthy Street SE',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49506',
    phone: '(616) 242-9795',
    latitude: 42.9478,
    longitude: -85.6101,
    products: ['Auto', 'Home', 'Business', 'Life', 'Commercial'],
  },
  {
    id: '7',
    name: 'Lake Michigan Credit Union - Grand Rapids Beltline',
    address: '4500 Beltline Avenue NE',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49525',
    phone: '(616) 242-9796',
    latitude: 43.0034,
    longitude: -85.6101,
    products: ['Auto', 'Home', 'Renters'],
  },
  {
    id: '8',
    name: 'Lake Michigan Credit Union - Grand Rapids Cascade',
    address: '6800 Cascade Road SE',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49546',
    phone: '(616) 242-9797',
    latitude: 42.9784,
    longitude: -85.5501,
    products: ['Auto', 'Home', 'Business'],
  },
  {
    id: '9',
    name: 'Lake Michigan Credit Union - Grand Rapids Kentwood',
    address: '5200 Eastern Avenue SE',
    city: 'Grand Rapids',
    state: 'MI',
    zip: '49508',
    phone: '(616) 242-9798',
    latitude: 42.8896,
    longitude: -85.5988,
    products: ['Home', 'Auto', 'Life'],
  },
];

const productOptions = [
  'All Agencies',
  'Agriculture',
  'Auto',
  'Commercial',
  'Condo',
  'Farm',
  'Financial',
  'Home',
  'Human Services',
  'Life',
  'Powersports',
  'Renters',
];

// Major US cities - one per letter of the alphabet
const majorCities = [
  'Atlanta, GA',
  'Boston, MA',
  'Chicago, IL',
  'Columbus, OH',
  'Denver, CO',
  'El Paso, TX',
  'Fort Worth, TX',
  'Grand Rapids, MI',
  'Houston, TX',
  'Indianapolis, IN',
  'Jacksonville, FL',
  'Kansas City, MO',
  'Los Angeles, CA',
  'Miami, FL',
  'Nashville, TN',
  'Oakland, CA',
  'Philadelphia, PA',
  'Queens, NY',
  'Raleigh, NC',
  'Seattle, WA',
  'Tampa, FL',
  'Urban areas',
  'Virginia Beach, VA',
  'Washington, DC',
  'Xenia, OH',
  'Yonkers, NY',
  'Zion, IL',
];

export const Default = (props: AgencySearchProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const sxaStyles = `${props.params?.styles || ''}`;

  const [searchType, setSearchType] = useState<'location' | 'name'>('location');
  const [location, setLocation] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All Agencies');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter cities based on input
  useEffect(() => {
    if (searchType === 'location' && location.trim().length > 0) {
      const filtered = majorCities.filter((city) =>
        city.toLowerCase().includes(location.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location, searchType]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || locationSuggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < locationSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(locationSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSearch = async () => {
    setHasSearched(true);
    
    if (searchType === 'location') {
      if (!location.trim()) {
        alert('Please enter a location');
        return;
      }
      
      // Filter agencies by location (simplified - in real app would use geocoding)
      const filtered = mockAgencies.filter((agency) => {
        const locationLower = location.toLowerCase();
        // Handle "City, State" format by extracting city and state parts
        const locationParts = locationLower.split(',').map((part) => part.trim());
        const cityMatch = locationParts.some((part) => agency.city.toLowerCase().includes(part));
        const stateMatch = locationParts.some((part) => agency.state.toLowerCase().includes(part));
        
        return (
          cityMatch ||
          stateMatch ||
          agency.city.toLowerCase().includes(locationLower) ||
          agency.state.toLowerCase().includes(locationLower) ||
          agency.zip.includes(locationLower) ||
          agency.address.toLowerCase().includes(locationLower)
        );
      });

      // Filter by product if not "All Agencies"
      const productFiltered =
        selectedProduct === 'All Agencies'
          ? filtered
          : filtered.filter((agency) => agency.products.includes(selectedProduct));

      setAgencies(productFiltered);
    } else {
      if (!agencyName.trim()) {
        alert('Please enter an agency name');
        return;
      }

      const filtered = mockAgencies.filter((agency) =>
        agency.name.toLowerCase().includes(agencyName.toLowerCase())
      );

      const productFiltered =
        selectedProduct === 'All Agencies'
          ? filtered
          : filtered.filter((agency) => agency.products.includes(selectedProduct));

      setAgencies(productFiltered);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // In a real app, you would reverse geocode this to get city/state
          // For demo, we'll use Chicago
          setLocation('Chicago, IL');
        },
        () => {
          alert('Unable to retrieve your location');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleAgencyClick = (agency: Agency) => {
    setSelectedAgency(agency);
  };

  return (
    <div className={`component agency-search ${sxaStyles}`} id={id ? id : undefined}>
      <div className="agency-search-header">
        <div className="container">
          <h1 className="agency-search-title">
            {props.fields?.Title?.value || 'Find Nationwide Insurance Agencies Near You'}
          </h1>
        </div>
      </div>

      <div className="agency-search-content">
        <div className="container">
          <div className="agency-search-tabs">
            <button
              className={`agency-search-tab ${searchType === 'location' ? 'active' : ''}`}
              onClick={() => setSearchType('location')}
            >
              Search by Location
            </button>
            <button
              className={`agency-search-tab ${searchType === 'name' ? 'active' : ''}`}
              onClick={() => setSearchType('name')}
            >
              Search by name
            </button>
          </div>

          <div className="agency-search-form">
            <div className="agency-search-form-row">
              {searchType === 'location' ? (
                <div className="agency-search-field agency-search-field-autocomplete">
                  <label htmlFor="location-input">Search by city and state or ZIP</label>
                  <div className="agency-search-input-wrapper">
                    <svg
                      className="agency-search-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      ref={locationInputRef}
                      id="location-input"
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      onKeyDown={handleLocationKeyDown}
                      onFocus={() => location.trim().length > 0 && setShowSuggestions(true)}
                      autoComplete="off"
                    />
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div ref={suggestionsRef} className="agency-search-suggestions">
                        {locationSuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion}
                            className={`agency-search-suggestion ${
                              index === selectedSuggestionIndex ? 'selected' : ''
                            }`}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="agency-search-field">
                  <label htmlFor="name-input">Search by agency name</label>
                  <div className="agency-search-input-wrapper">
                    <svg
                      className="agency-search-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      id="name-input"
                      type="text"
                      placeholder="Enter agency name"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>
              )}

              <div className="agency-search-field">
                <label htmlFor="product-select">Search by product</label>
                <select
                  id="product-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {productOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="agency-search-form-row-secondary">
              {searchType === 'location' && (
                <button className="agency-search-use-location" onClick={handleUseMyLocation}>
                  Use My Location
                </button>
              )}
              <div className="agency-search-button-wrapper">
                <button className="agency-search-button" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {hasSearched && (
            <div className="agency-search-results">
              <div className="agency-search-results-container">
                <div className="agency-search-list">
                  <h2 className="agency-search-results-title">
                    {agencies.length} {agencies.length === 1 ? 'Agency' : 'Agencies'} Found
                  </h2>
                  {agencies.length > 0 ? (
                    <div className="agency-list">
                      {agencies.map((agency) => (
                        <div
                          key={agency.id}
                          className={`agency-item ${selectedAgency?.id === agency.id ? 'selected' : ''}`}
                          onClick={() => handleAgencyClick(agency)}
                        >
                          <h3 className="agency-item-name">{agency.name}</h3>
                          <p className="agency-item-address">
                            {agency.address}, {agency.city}, {agency.state} {agency.zip}
                          </p>
                          <p className="agency-item-phone">{agency.phone}</p>
                          <div className="agency-item-products">
                            {agency.products.map((product) => (
                              <span key={product} className="agency-product-badge">
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="agency-search-no-results">
                      <p>No agencies found matching your search criteria.</p>
                    </div>
                  )}
                </div>

                <div className="agency-search-map">
                  <MapComponent
                    agencies={agencies}
                    selectedAgency={selectedAgency}
                    onAgencySelect={setSelectedAgency}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
