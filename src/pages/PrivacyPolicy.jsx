import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { updatePageSEO } from '../lib/seo'

export default function PrivacyPolicy() {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy - SEOScribe',
      description: 'Read our privacy policy to understand how we collect, use, and protect your data.',
      canonical: 'https://seoscribe.pro/privacy-policy'
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to SEOScribe ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our AI article writer services, and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect and process the following categories of data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Identity Data:</strong> Email address, username</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Usage Data:</strong> Information about how you use our article writer and services</li>
                <li><strong>Content Data:</strong> Articles, drafts, and content you create using our platform</li>
                <li><strong>Payment Data:</strong> Processed securely through Stripe (we do not store full payment details)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use your data for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>To provide and maintain our AI writing tool and SEO services</li>
                <li>To process your transactions and manage your account</li>
                <li>To improve our article writer and develop new features</li>
                <li>To communicate with you about updates, support, and marketing (with your consent)</li>
                <li>To ensure the security and integrity of our platform</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may share your data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Service Providers:</strong> Supabase (database), Stripe (payments), OpenRouter/Anthropic (AI processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. Our security measures include encryption in transit and at rest, regular security audits, and SOC 2 compliance standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Under GDPR and other privacy laws, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@seoscribe.pro
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed">
                We use essential cookies to provide our services and optional analytics cookies (with your consent) to improve user experience. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your data for as long as necessary to provide our services and comply with legal obligations. Articles and content are retained until you delete them or close your account. Account data is retained for 90 days after account closure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. International Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be transferred to and processed in countries outside your jurisdiction. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for children under 16. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of significant changes via email or prominent notice on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about this privacy policy or our data practices, contact us at:
              </p>
              <div className="mt-4 p-4 glass-card">
                <p className="text-gray-300">Email: privacy@seoscribe.pro</p>
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
