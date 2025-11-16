'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Privacy Policy
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. Learn how Senior Home Services Network protects and uses your information.
          </p>
          
          <div className="text-sm text-muted-foreground mt-4">
            Last updated: November 7, 2025
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="prose prose-slate max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
          {/* Introduction */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground m-0">Introduction</h2>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground leading-relaxed">
                Senior Home Services Network (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy and security of older adults, persons with disabilities, and their families who use our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our aging-in-place services platform.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We understand that trust is essential when it comes to home services and personal care. This policy reflects our commitment to transparency and your right to privacy.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground m-0">Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Personal Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Name, email address, phone number, and mailing address</li>
                  <li>• Age, mobility needs, and accessibility requirements</li>
                  <li>• Emergency contact information</li>
                  <li>• Home address and property details for service delivery</li>
                  <li>• Payment information and billing details</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Service Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Service requests and inquiries</li>
                  <li>• Communication with service providers</li>
                  <li>• Service history and preferences</li>
                  <li>• Reviews and feedback</li>
                  <li>• Photos of completed work (with your consent)</li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Technical Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Device information and IP address</li>
                  <li>• Browser type and operating system</li>
                  <li>• Usage patterns and platform interactions</li>
                  <li>• Location data (only when necessary for service delivery)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground m-0">How We Use Your Information</h2>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Delivery</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Connect you with qualified service providers</li>
                    <li>• Schedule and coordinate services</li>
                    <li>• Process payments securely</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Safety & Quality</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Verify service provider credentials</li>
                    <li>• Monitor service quality</li>
                    <li>• Ensure safety compliance</li>
                    <li>• Handle disputes and issues</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Communication</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Send service updates and notifications</li>
                    <li>• Share relevant safety information</li>
                    <li>• Provide platform updates</li>
                    <li>• Respond to inquiries</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Improvement</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Enhance platform functionality</li>
                    <li>• Develop new features</li>
                    <li>• Analyze usage patterns</li>
                    <li>• Improve user experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Information Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">With Service Providers</h3>
                <p className="text-muted-foreground">
                  We share necessary information with vetted service providers to enable them to deliver services to you. This includes your contact information, service location, and specific requirements.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may disclose information when required by law, court order, or to protect the safety and rights of our users, especially in emergency situations.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Business Transfers</h3>
                <p className="text-muted-foreground">
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction, with continued privacy protection.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Data Security</h2>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <p className="text-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Encrypted data transmission (SSL/TLS)</li>
                  <li>• Secure data storage systems</li>
                  <li>• Regular security audits</li>
                  <li>• Limited employee access</li>
                </ul>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Background checks for service providers</li>
                  <li>• Two-factor authentication options</li>
                  <li>• Regular system updates</li>
                  <li>• Incident response procedures</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Privacy Rights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Access & Control</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• View your personal information</li>
                  <li>• Update or correct your data</li>
                  <li>• Download your information</li>
                  <li>• Control communication preferences</li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Deletion & Restrictions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Request account deletion</li>
                  <li>• Limit data processing</li>
                  <li>• Opt out of marketing</li>
                  <li>• Withdraw consent</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Contact Us</h2>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Email:</strong> info@mynestshield.com</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Policy Updates</h3>
              <p className="text-muted-foreground text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our platform. Your continued use of Senior Home Services Network after changes become effective constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

        </motion.div>
      </div>
    </main>
  );
}