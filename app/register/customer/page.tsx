'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GooglePlacesAutocomplete } from '@/components/ui/google-places-autocomplete';
import toast from 'react-hot-toast';

export default function CustomerRegisterPage() {
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
    address: '',
    zipCode: '',
    subRole: '',
    parentCustomerEmail: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 4;

  const stepTitles = [
    'Personal Information',
    'Role Selection',
    'Account Security',
    'Contact Information'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return formData.firstName.trim() !== '' && 
               formData.lastName.trim() !== '';
      case 2: // Role Selection
        // If subrole is selected, parent customer email is required
        if ((formData.subRole === 'FAMILY_MEMBER' || formData.subRole === 'CAREGIVER') && 
            formData.parentCustomerEmail.trim() === '') {
          return false;
        }
        return true;
      case 3: // Account Security
        return formData.username.trim() !== '' && 
               formData.email.trim() !== '' && 
               formData.password.trim() !== '' && 
               formData.confirmPassword.trim() !== '' &&
               formData.password === formData.confirmPassword;
      case 4: // Contact Information (now required)
        return formData.address.trim() !== '' && 
               formData.zipCode.trim() !== '' && 
               formData.phone.trim() !== '';
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      // Show specific error messages based on the step
      switch (currentStep) {
        case 1:
          toast.error('Please enter your first and last name');
          break;
        case 2:
          toast.error('Please enter the customer email address');
          break;
        case 3:
          if (!formData.username.trim()) {
            toast.error('Please enter a username');
          } else if (!formData.email.trim()) {
            toast.error('Please enter your email');
          } else if (!formData.password.trim() || !formData.confirmPassword.trim()) {
            toast.error('Please enter and confirm your password');
          } else if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
          } else {
            toast.error('Please fill in all required fields');
          }
          break;
        case 4:
          if (!formData.address.trim()) {
            toast.error('Please select an address from the dropdown');
          } else if (!formData.zipCode.trim()) {
            toast.error('ZIP code is required. Please select an address to auto-populate it');
          } else if (!formData.phone.trim()) {
            toast.error('Please enter your phone number');
          } else {
            toast.error('Please complete all contact information');
          }
          break;
        default:
          toast.error('Please fill in all required fields');
      }
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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
                  minLength={2}
                  maxLength={50}
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
                  minLength={2}
                  maxLength={50}
                />
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              All personal information is kept secure and confidential
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Role Selection</h3>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">
                I am registering as: <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="radio"
                    name="subRole"
                    value=""
                    checked={formData.subRole === ''}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Customer</div>
                    <div className="text-xs text-muted-foreground">Looking for care services for myself</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="radio"
                    name="subRole"
                    value="FAMILY_MEMBER"
                    checked={formData.subRole === 'FAMILY_MEMBER'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Family Member</div>
                    <div className="text-xs text-muted-foreground">Managing care for a family member</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                  <input
                    type="radio"
                    name="subRole"
                    value="CAREGIVER"
                    checked={formData.subRole === 'CAREGIVER'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Caregiver</div>
                    <div className="text-xs text-muted-foreground">Professional providing care services</div>
                  </div>
                </label>
              </div>
              
              {(formData.subRole === 'FAMILY_MEMBER' || formData.subRole === 'CAREGIVER') && (
                <div className="mt-3 p-3 bg-accent/30 rounded-md">
                  <label className="text-sm font-medium block mb-2">
                    Customer Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="parentCustomerEmail"
                    name="parentCustomerEmail"
                    type="email"
                    value={formData.parentCustomerEmail}
                    onChange={handleInputChange}
                    placeholder="Enter the customer's email address"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required={formData.subRole === 'FAMILY_MEMBER' || formData.subRole === 'CAREGIVER'}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the email of the customer account you&apos;ll be linked to
                  </p>
                </div>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Role selection helps us provide better personalized care.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Account Security</h3>
            
            <div className="space-y-3">
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
                  minLength={3}
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  3-20 characters, letters, numbers, and underscores only
                </p>
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
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Min 8 characters, must include uppercase, lowercase, and number
                </p>
              </div>
              <div>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">Contact Information</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">Please provide your contact details</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Address <span className="text-red-500">*</span>
                </label>
                <GooglePlacesAutocomplete
                  value={formData.address}
                  onChange={(address) => {
                    setFormData({ ...formData, address });
                  }}
                  onZipCodeChange={(zipCode) => {
                    setFormData({ ...formData, zipCode });
                  }}
                  placeholder="Start typing your address..."
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.address ? '✓ Address selected' : 'Select an address from the dropdown suggestions'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  ZIP Code <span className="text-red-500">*</span> {formData.zipCode && <span className="text-green-600 text-xs">✓ Auto-populated</span>}
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 12345 or 12345-6789"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.zipCode ? 'ZIP code from selected address' : 'Will be auto-filled when you select an address'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1234567890"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  International format with country code (e.g., +1 for US)
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we're on the last step
    if (currentStep !== totalSteps) {
      toast.error('Please complete all steps before submitting');
      return;
    }

    // Validate all steps before submitting
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        toast.error(`Please complete Step ${step}: ${stepTitles[step - 1]}`);
        setCurrentStep(step);
        return;
      }
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register/customer', {
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
          address: formData.address,
          zipCode: formData.zipCode,
          subRole: formData.subRole || undefined,
          parentCustomerEmail: formData.parentCustomerEmail.trim() || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Customer account created successfully! Redirecting to login...');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          zipCode: '',
          subRole: '',
          parentCustomerEmail: ''
        });
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(data.error || 'Registration failed');
        if (data.details) {
          const errors = data.details.map((d: { field: string; message: string }) => `${d.field}: ${d.message}`).join(', ');
          toast.error(`${data.error} - ${errors}`);
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
          style={{ backgroundImage: 'url(/images/register-image.jpg)' }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Right side - Registration Form */}
      <div className="lg:p-8 p-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
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
              Create Customer Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join as a customer to find aging care services
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
            <div className="flex justify-between gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-28"
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-28"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="w-32" 
                  disabled={isLoading || !validateStep(currentStep)}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>



          <div className="text-center text-sm">
            Want to register as a provider?{' '}
            <Link href="/register/provider" className="underline underline-offset-4 hover:text-primary">
              Register as Provider
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