'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ServicesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div 
          className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground text-left">
              Comprehensive solutions designed to support aging in place with dignity, safety, and independence.
            </p>
          </div>
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="grid grid-cols-4 gap-4">
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/bathroom@4x.png"
                  alt="Bathroom Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  BATHROOM
                </span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/kitchen@4x.png"
                  alt="Kitchen Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  KITCHEN
                </span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/stairs@4x.png"
                  alt="Stairs Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  STAIRS
                </span>
              </motion.div>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/kight@4x.png"
                  alt="Lighting Modifications"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  LIGHTS
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 container mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          
          {/* Home Modifications Service Card */}
          <motion.div 
            className="bg-card rounded-xl border border-primary p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Image */}
              <motion.div 
                className="shrink-0 self-center sm:self-auto"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/home-mod.svg"
                  alt="Home Modifications"
                  width={60}
                  height={60}
                  className="w-15 h-15"
                />
              </motion.div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Home Modifications
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Professional CAPS-certified specialists provide bathroom safety upgrades, ramps, grab bars, 
                  stairlifts, and accessibility improvements for safe aging in place.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Cleaning Services Card */}
          <motion.div 
            className="bg-card rounded-xl border border-primary p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}
            transition={{ 
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut"
            }}
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Image */}
              <motion.div 
                className="shrink-0 self-center sm:self-auto"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src="/images/cleaning.svg"
                  alt="Cleaning Services"
                  width={60}
                  height={60}
                  className="w-15 h-15"
                />
              </motion.div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Cleaning Services
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Specialized cleaning services for seniors and people with disabilities, including deep cleaning, 
                  maintenance, and accessibility-focused housekeeping.
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}