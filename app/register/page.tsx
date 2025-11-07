import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {

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
              Choose Your Account Type
            </h1>
            <p className="text-sm text-muted-foreground">
              Select how you&apos;d like to join our aging care platform
            </p>
          </div>

          <div className="space-y-4">
            {/* Customer Registration Option */}
            <Link href="/register/customer">
              <div className="p-6 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-left">Customer Account</h3>
                    <p className="text-sm text-muted-foreground text-left mt-1">
                      Looking for aging care services for yourself or a loved one
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground text-left">
                      • Find care providers • Compare services • Book appointments
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Provider Registration Option */}
            <Link href="/register/provider">
              <div className="p-6 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-left">Provider Account</h3>
                    <p className="text-sm text-muted-foreground text-left mt-1">
                      Offering aging care services as a professional or business
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground text-left">
                      • List your services • Manage bookings • Grow your business
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
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