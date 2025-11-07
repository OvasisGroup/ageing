import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Aging Platform',
  description: 'Terms of Service for our aging platform and community services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Last updated: November 7, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Welcome to Our Aging Platform
              </h2>
              <p className="text-muted-foreground mb-4">
                These Terms of Service (&quot;Terms&quot;) govern your use of our aging platform website and services 
                (the &quot;Service&quot;) operated by Aging Platform (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
              </p>
              <p className="text-muted-foreground mb-4">
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
                with any part of these terms, then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using this aging platform, you accept and agree to be bound by the terms 
                and provision of this agreement. Additionally, when using this platform&apos;s particular 
                services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Use License
              </h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily download one copy of the materials on our aging platform 
                for personal, non-commercial transitory viewing only. This is the grant of a license, not a 
                transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the platform</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                This license shall automatically terminate if you violate any of these restrictions and 
                may be terminated by us at any time. Upon terminating your viewing of these materials or 
                upon the termination of this license, you must destroy any downloaded materials in your 
                possession whether in electronic or printed format.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                User Accounts and Registration
              </h2>
              <p className="text-muted-foreground mb-4">
                When you create an account with us, you must provide information that is accurate, complete, 
                and current at all times. You are responsible for safeguarding the password and for keeping 
                your account information up to date.
              </p>
              <p className="text-muted-foreground mb-4">
                You agree not to disclose your password to any third party and to take sole responsibility 
                for any activities or actions under your account, whether or not you have authorized such 
                activities or actions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Privacy and Data Protection
              </h2>
              <p className="text-muted-foreground mb-4">
                Your privacy is important to us. We collect and use your personal information in accordance 
                with our Privacy Policy. By using our Service, you consent to the collection and use of 
                information in accordance with our Privacy Policy.
              </p>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Prohibited Uses
              </h2>
              <p className="text-muted-foreground mb-4">
                You may not use our Service:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
                <li>To interfere with or circumvent the security features of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Health Information Disclaimer
              </h2>
              <p className="text-muted-foreground mb-4">
                The information provided on this aging platform is for educational and informational purposes 
                only and is not intended as medical advice. Always consult with a qualified healthcare 
                professional before making any decisions about your health or treatment.
              </p>
              <p className="text-muted-foreground mb-4">
                We do not provide medical advice, diagnosis, or treatment. The content on this platform 
                should not be used as a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-4">
                In no event shall Aging Platform, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, punitive, consequential, or special 
                damages arising out of or related to your use of the Service.
              </p>
              <p className="text-muted-foreground mb-4">
                Our liability to you for any cause whatsoever and regardless of the form of the action, 
                will at all times be limited to the amount paid, if any, by you to us for the Service 
                during the term of membership.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Service Availability
              </h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to withdraw or amend our Service, and any service or material we 
                provide on the Service, in our sole discretion without notice. We do not warrant that 
                our Service will be available at all times or that it will be uninterrupted or error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Termination
              </h2>
              <p className="text-muted-foreground mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-muted-foreground mb-4">
                If you wish to terminate your account, you may simply discontinue using the Service or 
                contact us to request account deletion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Changes to Terms
              </h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms 
                taking effect.
              </p>
              <p className="text-muted-foreground mb-4">
                What constitutes a material change will be determined at our sole discretion. By continuing 
                to access or use our Service after any revisions become effective, you agree to be bound 
                by the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Governing Law
              </h2>
              <p className="text-muted-foreground mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
                our company is established, without regard to its conflict of law provisions.
              </p>
              <p className="text-muted-foreground mb-4">
                Our failure to enforce any right or provision of these Terms will not be considered a 
                waiver of those rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-muted-foreground">
                  Email: legal@agingplatform.com<br />
                  Address: [Your Company Address]<br />
                  Phone: [Your Contact Number]
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Acknowledgment
              </h2>
              <p className="text-muted-foreground">
                By using our Service, you acknowledge that you have read these Terms of Service and 
                agree to be bound by them. These Terms constitute the entire agreement between you and 
                Aging Platform regarding the use of the Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}