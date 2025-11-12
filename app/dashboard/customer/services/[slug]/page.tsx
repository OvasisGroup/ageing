'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/layout';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Subcategory {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  slug: string;
  isActive: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  slug: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  const fetchCategory = async () => {
    try {
      const response = await fetch('/api/categories?includeSubcategories=true');
      if (response.ok) {
        const data = await response.json();
        const categories = Array.isArray(data) ? data : [];
        const foundCategory = categories.find((cat: Category) => cat.slug === slug);
        
        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          toast.error('Category not found');
          router.push('/dashboard/customer/services');
        }
      } else {
        toast.error('Failed to load category');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading services...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2">Category not found</h3>
          <p className="text-muted-foreground mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/dashboard/customer/services">Back to Services</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/customer/services">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Services
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Image */}
            <div className="relative h-64 md:h-full min-h-[300px] bg-muted">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">📋</span>
                </div>
              )}
            </div>

            {/* Category Info */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-4">{category.title}</h1>
              {category.description && (
                <p className="text-muted-foreground text-lg mb-6">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{category.subcategories.length} {category.subcategories.length === 1 ? 'service available' : 'services available'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Services</h2>
          
          {category.subcategories.length === 0 ? (
            <div className="bg-card p-12 rounded-lg border border-border text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2">No Services Yet</h3>
              <p className="text-muted-foreground">
                Services for this category are coming soon. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary"
                >
                  {/* Subcategory Image */}
                  <div className="relative h-40 bg-muted">
                    {subcategory.image ? (
                      <Image
                        src={subcategory.image}
                        alt={subcategory.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">🔧</span>
                      </div>
                    )}
                  </div>

                  {/* Subcategory Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2">
                      {subcategory.title}
                    </h3>
                    {subcategory.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {subcategory.description}
                      </p>
                    )}
                    <Button className="w-full" asChild>
                      <Link href="/dashboard/customer/bookings">
                        Book This Service
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-muted/50 p-6 rounded-lg border border-border">
          <div className="flex items-start gap-4">
            <div className="text-3xl">❓</div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Questions About These Services?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help you understand each service and find the right provider for your needs.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/get-more-info">
                    Contact Support
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/customer/bookings">
                    Book a Service
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
