'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Two Divs */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

          {/* Left Div - Content */}
          <motion.div
            className="flex items-center justify-center bg-slate-900 text-white p-8 lg:p-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-lg text-center lg:text-left mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                About MyNestShield
              </h1>
              <p className="text-xl text-slate-200 leading-relaxed">
                Empowering older adults and persons with disabilities to live independently,
                safely, and with dignity in the homes they love.
              </p>
            </div>
          </motion.div>

          {/* Right Div - Full Width Image */}
          <motion.div
            className="relative h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/images/oldies.jpg"
              alt="Elderly couple enjoying their home"
              fill
              className="object-cover"
              priority
            />
            {/* Optional overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>

        </div>
      </section>

      {/* Main Content */}
      <div className="w-full flex justify-center">
        <div className="container max-w-7xl px-4 md:px-6 py-24">

          {/* Story Section */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                The Story That Started It All: The Need for More
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

            {/* Left Column - Personal Story */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">A Personal Beginning</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Our story begins with the simple desire of a beloved family member. My grandmother aged in place because she loved her home, her community, and her independence. However, as her mobility changed, finding reliable help for small repairs and cleaning became a real challenge.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">A Universal Challenge</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Then I saw my neighbor, also an older adult, facing the same struggle. We soon realized, this wasn&apos;t just one family&apos;s story, it was the story of millions of older adults across the country who want to stay where they feel safe, independent, connected, and dignified—their home.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8m0 0h-.01M8 6h-.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">The Service Provider Gap</h3>
                  <p className="text-slate-700 leading-relaxed">
                    The challenge wasn&apos;t just on the demand side. Meanwhile, small local service providers often lack visibility or digital tools to reach this growing population. The choice shouldn&apos;t be between an emotional burden and a risky stranger.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Solution & Vision */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">The Birth of MyNestShield</h3>
                  <p className="text-slate-700 leading-relaxed">
                    It should be a simple click away. That is how MyNestShield was born—a platform that connects older adults, persons with disabilities, and their family members and caregivers with vetted and background checked professionals who understand the unique needs of aging in place and accessible living.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">More Than a Marketplace</h3>
                  <p className="text-slate-700 leading-relaxed">
                    This isn&apos;t just a marketplace, it&apos;s a mission born from family, fueled by passion, and scaled by technology. We&apos;re not just fixing homes—we&apos;re building independence, dignity, and peace of mind, one safe home at a time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert-Driven Solutions</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We focus on thoughtful, expert-driven home modifications and cleaning services that make living spaces safer, more accessible, and better suited to your needs. From grab bar installations and ramps to layout adjustments and smart safety upgrades.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Freedom, Not Limits</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Whether you&apos;re navigating mobility changes, reducing fall risks, or simply creating a more functional space, everything we do is built around the idea that your home should protect your freedom—not limit it.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16 p-8 bg-primary/10 rounded-2xl max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Building Safer Communities Together
            </h3>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
              We&apos;re not just building an app; we&apos;re building safer homes and communities and helping older adults age in place safely in their nest. Aging in place shouldn&apos;t be a hope. It should be a reality.
              <span className="font-semibold text-primary"> Let&apos;s Build That Reality Together!</span>
            </p>
          </motion.div>
        </motion.section>
        </div>
      </div>
    </main>
  );
}