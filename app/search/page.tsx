'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

interface Category {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  slug: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  category: {
    title: string;
    slug: string;
  };
}

interface Provider {
  id: string;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  serviceType: string | null;
  description: string | null;
  profilePhoto: string | null;
  yearsOfExperience: number | null;
  address: string | null;
  zipCode: string | null;
  vettedStatus: string;
}

interface SearchResults {
  categories: Category[];
  subcategories: Subcategory[];
  providers: Provider[];
  query: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const totalResults = (results?.categories.length || 0) + 
                       (results?.subcategories.length || 0) + 
                       (results?.providers.length || 0);

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Search Results</h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search for services..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                </div>
                <Button type="submit">Search</Button>
              </div>
            </form>

            {query && !isLoading && (
              <p className="text-muted-foreground">
                {totalResults} {totalResults === 1 ? 'result' : 'results'} found for &quot;{query}&quot;
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Searching...</p>
            </div>
          )}

          {/* No Query */}
          {!query && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2">Start Your Search</h2>
              <p className="text-muted-foreground">
                Enter a search term to find services and providers
              </p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results && query && (
            <div className="space-y-12">
              {/* Categories */}
              {results.categories.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Service Categories</h2>
                  <div className="space-y-8">
                    {results.categories.map((category) => (
                      <div key={category.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                        {/* Category Header */}
                        <Link
                          href={`/dashboard/customer/services/${category.slug}`}
                          className="group block"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="relative h-48 md:h-auto md:w-64 bg-muted shrink-0">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-6xl">📋</span>
                                </div>
                              )}
                            </div>
                            <div className="p-6 flex-1">
                              <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                                {category.title}
                              </h3>
                              {category.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {category.description}
                                </p>
                              )}
                              {category.subcategories && category.subcategories.length > 0 && (
                                <p className="text-sm text-primary mt-2">
                                  {category.subcategories.length} {category.subcategories.length === 1 ? 'service' : 'services'} available
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="border-t border-border bg-muted/30 p-6">
                            <h4 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                              Available Services
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {category.subcategories.map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  href={`/dashboard/customer/services/${category.slug}`}
                                  className="bg-card border border-border rounded-md p-3 hover:border-primary hover:shadow-md transition-all"
                                >
                                  <h5 className="font-medium text-sm mb-1">
                                    {subcategory.title}
                                  </h5>
                                  {subcategory.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {subcategory.description}
                                    </p>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcategories */}
              {results.subcategories.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Specific Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {subcategory.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              in {subcategory.category.title}
                            </p>
                            {subcategory.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {subcategory.description}
                              </p>
                            )}
                            <Button size="sm" asChild>
                              <Link href="/dashboard/customer/service-requests/new">
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Providers */}
              {results.providers.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Service Providers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.providers.map((provider) => (
                      <div
                        key={provider.id}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary"
                      >
                        {/* Provider Photo */}
                        <div className="relative h-48 bg-muted">
                          {provider.profilePhoto ? (
                            <Image
                              src={provider.profilePhoto}
                              alt={provider.businessName || `${provider.firstName} ${provider.lastName}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary">
                                  {provider.businessName?.[0] || provider.firstName?.[0] || 'P'}
                                </span>
                              </div>
                            </div>
                          )}
                          {provider.vettedStatus === 'VETTED' && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Vetted
                            </div>
                          )}
                        </div>

                        {/* Provider Info */}
                        <div className="p-5">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {provider.businessName || `${provider.firstName} ${provider.lastName}`}
                          </h3>
                          
                          {provider.serviceType && (
                            <p className="text-sm text-primary mb-2">
                              {provider.serviceType}
                            </p>
                          )}

                          {provider.yearsOfExperience && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {provider.yearsOfExperience} years experience
                            </p>
                          )}

                          {provider.address && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                              📍 {provider.address}
                            </p>
                          )}

                          {provider.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                              {provider.description}
                            </p>
                          )}

                          <Button size="sm" className="w-full" asChild>
                            <Link href="/dashboard/customer/service-requests/new">
                              Request Service
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {totalResults === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn&apos;t find any services or providers matching &quot;{query}&quot;
                  </p>
                  <Button asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading search...</p>
          </div>
        </div>

      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
