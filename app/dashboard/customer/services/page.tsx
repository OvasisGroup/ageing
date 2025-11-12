'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  slug: string;
  isActive: boolean;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  title: string;
  description: string | null;
  slug: string;
}

export default function FindServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?isActive=true&includeSubcategories=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Services</h1>
          <p className="text-muted-foreground">
            Browse our comprehensive catalog of care services and find the perfect provider for your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading services...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-card p-12 rounded-lg border border-border text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No services match "${searchQuery}". Try a different search term.`
                : 'No services are currently available.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredCategories.length} {filteredCategories.length === 1 ? 'service category' : 'service categories'} available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/dashboard/customer/services/${category.slug}`}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary h-full flex flex-col">
                    {/* Category Image */}
                    <div className="relative h-48 bg-muted overflow-hidden">
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
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          {category.subcategories.length} {category.subcategories.length === 1 ? 'Service' : 'Services'}
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm font-medium text-primary mt-auto">
                        View Services
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Help Section */}
        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Need Help Choosing?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Not sure which service is right for you? Our team can help you find the perfect match based on your specific needs and situation.
              </p>
              <Button variant="outline" asChild>
                <Link href="/get-more-info">
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
