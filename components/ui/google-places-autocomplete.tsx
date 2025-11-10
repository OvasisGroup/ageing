'use client';

import { useEffect, useRef, useState } from 'react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onZipCodeChange?: (zipCode: string) => void;
  placeholder?: string;
  className?: string;
  apiKey: string;
}

export function GooglePlacesAutocomplete({
  value,
  onChange,
  onZipCodeChange,
  placeholder = "Enter your address",
  className = "",
  apiKey
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Sync inputValue with value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [apiKey]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;
    if (!window.google?.maps?.places?.Autocomplete) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' }, // Restrict to US addresses
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      // Only update if we have a valid place selection
      if (place.formatted_address) {
        setInputValue(place.formatted_address);
        onChange(place.formatted_address);
        
        // Extract ZIP code from address components
        if (place.address_components && onZipCodeChange) {
          const postalCodeComponent = place.address_components.find(
            (component) => component.types.includes('postal_code')
          );
          if (postalCodeComponent) {
            onZipCodeChange(postalCodeComponent.long_name);
          }
        }
      }
    });

  }, [isLoaded, onChange, onZipCodeChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        // Only call onChange when user manually types (not from autocomplete)
        // This prevents clearing the formatted address
      }}
      placeholder={placeholder}
      className={className}
    />
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: GoogleAutocompleteOptions
          ) => GoogleAutocomplete;
        };
      };
    };
  }
}

interface GoogleAutocompleteOptions {
  types?: string[];
  componentRestrictions?: { country: string | string[] };
}

interface GoogleAutocomplete {
  addListener(eventName: string, handler: () => void): void;
  getPlace(): {
    formatted_address?: string;
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  };
}

