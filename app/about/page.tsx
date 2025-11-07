export default function AboutPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About Our Platform
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Learn more about our mission to advance aging research and analysis.
            </p>
          </div>
        </div>
        
        <div className="mx-auto max-w-3xl py-12 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We are dedicated to providing researchers and organizations with cutting-edge tools 
              for aging analysis and research management. Our platform combines advanced analytics, 
              secure data management, and user-friendly interfaces to accelerate scientific discovery.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What We Offer</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Comprehensive user management with role-based access</li>
              <li>• Secure data storage and API endpoints</li>
              <li>• Advanced analytics and visualization tools</li>
              <li>• Scalable infrastructure for research projects</li>
              <li>• 24/7 support for research teams</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our team consists of experienced researchers, data scientists, and software engineers 
              who understand the unique challenges of aging research. We are committed to building 
              tools that make a real difference in advancing scientific knowledge.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}