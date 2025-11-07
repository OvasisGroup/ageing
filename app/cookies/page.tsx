import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Aging Platform',
  description: 'Learn about how we use cookies on our aging platform to enhance your experience.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: November 7, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                What Are Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our aging platform website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                How We Use Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                We use cookies on our aging platform for several purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4">
                <li>To remember your preferences and settings</li>
                <li>To improve website performance and user experience</li>
                <li>To analyze how our platform is used and improve our services</li>
                <li>To provide personalized content and recommendations</li>
                <li>To ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Types of Cookies We Use
              </h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Essential Cookies
                </h3>
                <p className="text-muted-foreground">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-muted-foreground">
                  These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Functional Cookies
                </h3>
                <p className="text-muted-foreground">
                  These cookies enable enhanced functionality and personalization, such as remembering your theme preferences and language settings.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Managing Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4">
                <li>Most web browsers allow you to control cookies through their settings</li>
                <li>You can delete existing cookies from your browser</li>
                <li>You can set your browser to refuse cookies from specific websites</li>
                <li>You can set your browser to notify you when cookies are being set</li>
              </ul>
              <p className="text-muted-foreground">
                Please note that disabling certain cookies may affect the functionality of our aging platform and your user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Third-Party Cookies
              </h2>
              <p className="text-muted-foreground mb-4">
                Our platform may contain links to other websites and may use third-party services that set their own cookies. We do not control these third-party cookies and recommend reviewing their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. We will notify you of any significant changes by posting the updated policy on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-white">
                  Email: info@mynestshield.com<br />
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}