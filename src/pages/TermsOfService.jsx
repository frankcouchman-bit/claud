import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { updatePageSEO } from '../lib/seo'

export default function TermsOfService() {
  useEffect(() => {
    updatePageSEO({
      title: 'Terms of Service - SEOScribe',
      description:
        'Read our terms of service to understand the rules and regulations governing the use of SEOScribe.',
      canonical: 'https://seoscribe.pro/terms',
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-400 mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using SEOScribe ("Service," "we," "our," or "us"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our AI article writer and content generation services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
              <p className="text-gray-300 leading-relaxed">
                SEOScribe provides an AI-powered article writer and content generation platform, including SEO tools, research capabilities, and related services. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>One person or entity may not maintain multiple free accounts</li>
                <li>Accounts are non-transferable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Subscription Plans and Payment</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Free Plan:</strong> Provides 1 article generation per month and limited access to SEO tools (1 use per tool per day).
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Pro Plan ($29/month):</strong> Provides 15 article generations per day and expanded tool access (10 uses per tool per day).
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Subscriptions renew automatically unless cancelled</li>
                <li>You can cancel anytime; cancellation takes effect at the end of the billing period</li>
                <li>No refunds for partial months</li>
                <li>Price changes will be communicated 30 days in advance</li>
                <li>All payments are processed securely through Stripe</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Usage Limits and Fair Use</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Usage limits are designed to ensure fair access for all users:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Free users: 1 article per month, each tool 1x per day</li>
                <li>Pro users: 15 articles per day, each tool 10x per day</li>
                <li>Article length limit: 6,000 words maximum</li>
                <li>Excessive use, automation, or abuse may result in account suspension</li>
                <li>Unused quota does not roll over to the next period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Content Ownership and License</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Your Content:</strong> You retain all rights to content you create using our article writer. You are solely responsible for the content you generate, including its accuracy, legality, and appropriateness.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>License to Us:</strong> By using the Service, you grant us a limited license to store, process, and display your content solely to provide the Service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>AI Training:</strong> We do not use your content to train our AI models without explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Prohibited Uses</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You may not use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Generate illegal, harmful, or malicious content</li>
                <li>Violate intellectual property rights or plagiarize</li>
                <li>Spam, phish, or distribute malware</li>
                <li>Impersonate others or misrepresent your identity</li>
                <li>Attempt to reverse engineer, hack, or compromise the Service</li>
                <li>Resell or redistribute our services without authorization</li>
                <li>Generate content that violates third-party rights</li>
                <li>Create misleading or deceptive content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. AI Content Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed">
                Content generated by our AI writing tool is provided "as is." While we strive for accuracy, AI-generated content may contain errors, inaccuracies, or outdated information. You are responsible for reviewing, fact-checking, and editing all content before publication. We do not guarantee the accuracy, completeness, or suitability of AI-generated content for any particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                The Service, including its design, code, algorithms, and branding, is owned by SEOScribe and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Data and Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Your use of the Service is also governed by our Privacy Policy. We collect and process data as described in that policy, which is incorporated into these Terms by reference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Disclaimers and Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Service Provided "AS IS":</strong> The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, SEOScribe shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, or other harmful code that may be transmitted through the Service</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of your use of any content posted, emailed, transmitted, or otherwise made available through the Service</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless SEOScribe and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorney&apos;s fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to the Service at any time, with or without cause or notice, for any reason including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Extended periods of inactivity</li>
                <li>Request by law enforcement or government agencies</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Upon termination, your right to use the Service will immediately cease. You may also terminate your account at any time through your account settings. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will provide notice of material changes by email or through the Service at least 30 days before the effective date. Your continued use of the Service after changes become effective constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Dispute Resolution</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Informal Resolution:</strong> If you have any dispute with us, you agree to contact us first at support@seoscribe.pro to attempt to resolve the dispute informally.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong>Arbitration:</strong> If informal resolution fails, any dispute arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">17. Severability</h2>
              <p className="text-gray-300 leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">18. Entire Agreement</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and SEOScribe regarding the use of the Service and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">19. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-4 glass-card">
                <p className="text-gray-300">Email: legal@seoscribe.pro</p>
                <p className="text-gray-300">Support: support@seoscribe.pro</p>
                <p className="text-gray-300">Address: SEOScribe, Inc.</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
