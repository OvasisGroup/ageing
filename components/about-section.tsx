'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="w-full bg-slate-200 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              About Us: 
            </h2>
            <h3 className='text-secondary'>Building a Community of Care</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              At MyNestShield, we believe that every older adult and persons with disabilities deserves to live comfortably, independently, safely and with dignity in the home they love for the long haul. MyNestShield is more than just a service marketplace, we are dedicated to becoming the most trusted name in older adult home support across North Carolina and behold.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/about">
                <motion.button
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              
              <Link href="/get-more-info">
                <motion.button
                  className="flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get More Info
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative w-full h-[400px] md:h-[500px] rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/images/signin_image.jpg"
              alt="About MyNestShield - Supporting older adults and persons with disabilities"
              fill
              className="object-cover rounded-3xl"
              priority={false}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}