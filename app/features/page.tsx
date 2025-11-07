export default function FeaturesPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Platform Features
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Explore the comprehensive features designed for aging research and analysis.
            </p>
          </div>
        </div>
        
        <div className="mx-auto max-w-6xl py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col space-y-4 p-6 rounded-lg border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">User Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive user registration and authentication system with role-based access control for teams and organizations.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col space-y-4 p-6 rounded-lg border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Data Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced analytics engine with real-time processing capabilities for aging research data and statistical analysis.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col space-y-4 p-6 rounded-lg border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Security</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enterprise-grade security with encrypted data storage, secure API endpoints, and compliance with research standards.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col space-y-4 p-6 rounded-lg border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Database Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Robust database infrastructure with PostgreSQL backend, automated backups, and high-availability configurations.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col space-y-4 p-6 rounded-lg border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">API Integration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  RESTful API endpoints with comprehensive documentation, rate limiting, and integration support for external tools.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col space-y-4 p-6 rounded-lg border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Performance</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Optimized performance with caching, CDN integration, and scalable architecture to handle large datasets efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}