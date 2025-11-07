'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    businessName: '',
    businessAddress: '',
    licenseNumber: '',
    serviceType: 'OTHER' as 'HOME_CARE' | 'MEDICAL_CARE' | 'COMPANIONSHIP' | 'HOUSEKEEPING' | 'TRANSPORTATION' | 'OTHER',
    yearsOfExperience: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  const stepTitles = [
    'Personal Information',
    'Business Information', 
    'Service Details',
    'Account Security'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return formData.firstName.trim() !== '' && 
               formData.lastName.trim() !== '' && 
               formData.phone.trim() !== '';
      case 2: // Business Information
        return formData.businessName.trim() !== '' && 
               formData.businessAddress.trim() !== '';
      case 3: // Service Details
        return true; // Service type has a default value
      case 4: // Account Security
        return formData.username.trim() !== '' && 
               formData.email.trim() !== '' && 
               formData.password.trim() !== '' && 
               formData.confirmPassword.trim() !== '' &&
               formData.password === formData.confirmPassword;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
            </div>
            <div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Business Information</h3>
            <div>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Business name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <input
                id="businessAddress"
                name="businessAddress"
                type="text"
                value={formData.businessAddress}
                onChange={handleInputChange}
                placeholder="Business address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                placeholder="License number (optional)"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Service Details</h3>
            <div>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="HOME_CARE">Home Care</option>
                <option value="MEDICAL_CARE">Medical Care</option>
                <option value="COMPANIONSHIP">Companionship</option>
                <option value="HOUSEKEEPING">Housekeeping</option>
                <option value="TRANSPORTATION">Transportation</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                placeholder="Years of experience (optional)"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your services (optional)"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Account Security</h3>
            <div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          licenseNumber: formData.licenseNumber || undefined,
          serviceType: formData.serviceType,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
          description: formData.description || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Provider account created successfully! Redirecting to login...');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: '',
          businessName: '',
          businessAddress: '',
          licenseNumber: '',
          serviceType: 'OTHER',
          yearsOfExperience: '',
          description: ''
        });
        // Reset to first step after successful registration
        setCurrentStep(1);
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const errorMessage = data.error || 'Registration failed';
        if (data.details) {
          const errors = data.details.map((d: { field: string; message: string }) => `${d.field}: ${d.message}`).join(', ');
          toast.error(`${errorMessage} - ${errors}`);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 px-4">
      {/* Left side - Branding */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r rounded-r-3xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/images/login-image.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Right side - Registration Form */}
      <div className="lg:p-8 p-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] max-h-screen overflow-y-auto py-8">
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/images/MyNestShield.png"
              alt="Aging Platform Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="h-16 w-auto"
            />
          </div>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Provider Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join as a provider to offer aging care services
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{stepTitles[currentStep - 1]}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Content */}
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-24"
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-24"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="w-32" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <div className="text-center text-sm">
            Want to register as a customer?{' '}
            <Link href="/register/customer" className="underline underline-offset-4 hover:text-primary">
              Register as Customer
            </Link>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </div>

          <div className="text-center text-sm">
            <Link href="/" className="underline underline-offset-4 hover:text-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}