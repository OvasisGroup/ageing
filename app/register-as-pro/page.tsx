import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Star, TrendingUp, Users, Shield, Zap, Mail } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function RegisterAsProPage() {
  const benefits = [
    {
      icon: Users,
      title: 'Access Thousands of Clients',
      description: 'Connect with families actively seeking senior care services in your area',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Expand your client base and increase your revenue with our platform',
    },
    {
      icon: Shield,
      title: 'Verified & Trusted',
      description: 'Build credibility with our verification system and client reviews',
    },
    {
      icon: Zap,
      title: 'Easy Management',
      description: 'Manage bookings, schedules, and payments all in one place',
    },
    {
      icon: Star,
      title: 'Professional Profile',
      description: 'Showcase your expertise, certifications, and client testimonials',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: '24/7 support team to help you succeed on our platform',
    },
  ];

  const pricingPlans = [
    {
      name: 'Monthly',
      price: 299,
      period: '/month',
      description: 'Perfect for trying out the platform',
      features: [
        'Unlimited service listings',
        'Client booking management',
        'Payment processing',
        'Profile verification badge',
        'Basic analytics dashboard',
        'Email support',
      ],
      popular: false,
    },
    {
      name: 'Quarterly',
      price: 849,
      originalPrice: 897,
      period: '/3 months',
      savings: 'Save $48',
      description: 'Best for growing your presence',
      features: [
        'Everything in Monthly',
        'Priority listing in search',
        'Advanced analytics',
        'Marketing toolkit',
        'Priority support',
        'Featured provider badge',
      ],
      popular: true,
    },
    {
      name: 'Half-Yearly',
      price: 1649,
      originalPrice: 1794,
      period: '/6 months',
      savings: 'Save $145',
      description: 'Ideal for established providers',
      features: [
        'Everything in Quarterly',
        'Premium profile customization',
        'Promotional campaigns',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
      ],
      popular: false,
    },
    {
      name: 'Yearly',
      price: 3199,
      originalPrice: 3588,
      period: '/year',
      savings: 'Save $389',
      description: 'Maximum value for professionals',
      features: [
        'Everything in Half-Yearly',
        'Top search placement',
        'White-label options',
        'Business consulting sessions',
        'Priority verification',
        'Exclusive partner benefits',
      ],
      popular: false,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Register as a Professional Provider</h1>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of trusted care providers connecting with families who need your expertise
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="#pricing">View Pricing</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                <Link href="#benefits">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Register Section */}
      <div id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Register as a Pro?</h2>
              <p className="text-xl text-muted-foreground">
                Transform your senior care business with our comprehensive platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-xl text-muted-foreground">
                Flexible pricing options to fit your business needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary transform scale-105' : 'border border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 h-10">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground ml-2">{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="text-sm text-muted-foreground line-through">
                            ${plan.originalPrice}
                          </span>
                          <span className="text-sm font-semibold text-green-600">{plan.savings}</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href="/register/provider">Get Started</Link>
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                All plans include a 14-day money-back guarantee
              </p>
              <p className="text-sm text-muted-foreground">
                Questions? Contact us at{' '}
                <a href="mailto:sales@seniorhomeservices.com" className="text-primary hover:underline">
                  sales@seniorhomeservices.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join our network of professional care providers and start connecting with clients today
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register/provider">Sign Up Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Preview */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you get started. Contact us for a personalized demo.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Already a Member? Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <div className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                  <p className="text-muted-foreground mb-4">
                    Get the latest tips, resources, and platform updates for professional care providers
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <Button type="submit" size="lg" className="whitespace-nowrap">
                      Subscribe Now
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-3">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
