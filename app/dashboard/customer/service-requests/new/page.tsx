'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface Subcategory {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function NewServiceRequestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const [formData, setFormData] = useState({
    categoryId: '',
    subcategoryId: '',
    title: '',
    description: '',
    location: '',
    locationLat: '',
    locationLng: '',
    budget: '',
    serviceDate: '',
    status: 'PENDING'
  });

  const totalSteps = 3;

  // Get user from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please log in to submit a service request');
      router.push('/login');
      return;
    }
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Invalid user data');
      router.push('/login');
    }
  }, [router]);

  // Load Google Places script
  useEffect(() => {
    const initializeAutocomplete = () => {
      if (locationInputRef.current && window.google) {
        autocompleteRef.current = new google.maps.places.Autocomplete(
          locationInputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'us' }
          }
        );

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.formatted_address) {
            const lat = place.geometry?.location?.lat() || 0;
            const lng = place.geometry?.location?.lng() || 0;
            setFormData(prev => ({
              ...prev,
              location: place.formatted_address || '',
              locationLat: lat.toString(),
              locationLng: lng.toString()
            }));
            setMapCenter({ lat, lng });
            updateMap(lat, lng);
          }
        });
      }
    };

    const loadGooglePlaces = () => {
      if (typeof window !== 'undefined' && !window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeAutocomplete;
        document.head.appendChild(script);
      } else if (window.google) {
        initializeAutocomplete();
      }
    };

    loadGooglePlaces();
  }, []);

  // Initialize map when location is set
  useEffect(() => {
    if (mapCenter && typeof google !== 'undefined') {
      const mapElement = document.getElementById('location-map');
      if (mapElement && !mapRef.current) {
        mapRef.current = new google.maps.Map(mapElement, {
          center: mapCenter,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
        });
        
        markerRef.current = new google.maps.Marker({
          map: mapRef.current,
          position: mapCenter,
          title: 'Service Location',
        });
      } else if (mapRef.current && markerRef.current) {
        mapRef.current.setCenter(mapCenter);
        markerRef.current.setPosition(mapCenter);
      }
    }
  }, [mapCenter]);

  const updateMap = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({ location: { lat, lng } });
          
          if (response.results[0]) {
            const address = response.results[0].formatted_address;
            setFormData(prev => ({
              ...prev,
              location: address,
              locationLat: lat.toString(),
              locationLng: lng.toString()
            }));
            setMapCenter({ lat, lng });
            updateMap(lat, lng);
            
            if (locationInputRef.current) {
              locationInputRef.current.value = address;
            }
          }
        } catch (error) {
          console.error('Error getting address:', error);
          alert('Failed to get address for your location');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Failed to get your current location. Please check your browser permissions.');
        setIsLoadingLocation(false);
      }
    );
  };

  const validateAddress = (): boolean => {
    if (!formData.location) {
      toast.error('Please enter a location');
      return false;
    }
    if (!formData.locationLat || !formData.locationLng) {
      toast.error('Please select a valid address from the suggestions');
      return false;
    }
    return true;
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?isActive=true');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.categoryId) {
        setFilteredSubcategories([]);
        return;
      }

      try {
        const response = await fetch(`/api/categories/${formData.categoryId}/subcategories`);
        if (response.ok) {
          const data = await response.json();
          setFilteredSubcategories(data);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
    // Reset subcategory when category changes
    setFormData(prev => ({ ...prev, subcategoryId: '' }));
  }, [formData.categoryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.categoryId) {
          toast.error('Please select a service category');
          return false;
        }
        if (!formData.title.trim()) {
          toast.error('Please enter a service title');
          return false;
        }
        if (!formData.description.trim()) {
          toast.error('Please enter a description');
          return false;
        }
        return true;
      case 2:
        if (!formData.location.trim()) {
          toast.error('Please enter a location');
          return false;
        }
        if (!validateAddress()) {
          return false;
        }
        if (!formData.budget || parseFloat(formData.budget) <= 0) {
          toast.error('Please enter a valid budget');
          return false;
        }
        return true;
      case 3:
        if (!formData.serviceDate) {
          toast.error('Please select a service date');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      handleNext();
      return;
    }

    if (!user) {
      toast.error('Please log in to submit a service request');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      });

      if (response.ok) {
        toast.success('Service request submitted successfully!');
        router.push('/dashboard/customer/service-requests');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit service request');
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast.error('Failed to submit service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4"
              >
                ← Back
              </Button>
              <h1 className="text-3xl font-bold">Create Service Request</h1>
              <p className="text-muted-foreground mt-2">
                Post a service request and let providers come to you
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          currentStep >= step
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            currentStep > step ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <span className={currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    Service Details
                  </span>
                  <span className={currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    Location & Budget
                  </span>
                  <span className={currentStep >= 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    Date & Review
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Service Details */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
                        Service Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        disabled={isLoadingCategories}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.categoryId && (
                      <div>
                        <label htmlFor="subcategoryId" className="block text-sm font-medium mb-2">
                          Specific Service (Optional)
                        </label>
                        <select
                          id="subcategoryId"
                          name="subcategoryId"
                          value={formData.subcategoryId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select a specific service (optional)</option>
                          {filteredSubcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Service Title <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Need help with home cleaning"
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Description <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Describe what you need help with..."
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Location & Budget */}
                {currentStep === 2 && (
                  <>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-2">
                        Location <span className="text-destructive">*</span>
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            ref={locationInputRef}
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Start typing your address..."
                            className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <Button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={isLoadingLocation}
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            {isLoadingLocation ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </>
                            ) : (
                              <>
                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Use My Location
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Start typing to see address suggestions or use your current location
                        </p>
                        
                        {/* Map Preview */}
                        {mapCenter && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Location Preview</p>
                            <div 
                              id="location-map" 
                              className="w-full h-64 rounded-lg border border-input"
                              style={{ minHeight: '256px' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium mb-2">
                        Budget <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                          $
                        </span>
                        <input
                          type="number"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Date & Review */}
                {currentStep === 3 && (
                  <>
                    <div>
                      <label htmlFor="serviceDate" className="block text-sm font-medium mb-2">
                        Preferred Service Date <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="date"
                        id="serviceDate"
                        name="serviceDate"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Review Summary */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-lg mb-3">Review Your Request</h3>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">
                          {categories.find(c => c.id === formData.categoryId)?.title || 'Not selected'}
                        </p>
                      </div>

                      {formData.subcategoryId && (
                        <div>
                          <p className="text-sm text-muted-foreground">Specific Service</p>
                          <p className="font-medium">
                            {filteredSubcategories.find(s => s.id === formData.subcategoryId)?.title}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-muted-foreground">Title</p>
                        <p className="font-medium">{formData.title}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium line-clamp-2">{formData.description}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{formData.location}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-medium text-green-600">
                          ${parseFloat(formData.budget || '0').toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Service Date</p>
                        <p className="font-medium">
                          {formData.serviceDate ? new Date(formData.serviceDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not selected'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      className="flex-1"
                    >
                      ← Previous
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="submit"
                      className="flex-1"
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
