'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  title: string;
  image: string | null;
  slug: string;
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?isActive=true');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Service Categories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of aging care services tailored to your needs
          </p>
        </motion.div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-muted rounded-lg h-48"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No categories available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <motion.div
                    className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Category Image */}
                    <div className="relative h-64 bg-muted overflow-hidden">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                          <span className="text-6xl opacity-30">📁</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Category Title */}
                    <div className="p-4 text-center">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        
      </div>
    </section>
  );
}
