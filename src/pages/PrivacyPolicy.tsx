import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream-50 to-mint-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-lavender-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/landing" className="flex items-center gap-2">
              <Star className="w-8 h-8 text-lavender-500" />
              <span className="text-xl font-bold text-gray-800">Little Star</span>
            </Link>
            <Link to="/landing">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-lavender-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Commitment to Your Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                At Little Star, protecting your family's privacy is our highest priority. This Privacy Policy 
                explains how we collect, use, protect, and handle your personal information when you use our 
                child development tracking service. We are committed to transparency and giving you control 
                over your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-2">Account Information</h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>When you create an account, we collect:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Full name and email address</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                  <li>Account creation date and login timestamps</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-2 mt-4">Child Information</h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>You may voluntarily provide information about your child, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Name, birth date, and birth time</li>
                  <li>Growth measurements (height, weight)</li>
                  <li>Health records and medical notes</li>
                  <li>Daily activities and milestones</li>
                  <li>Photos and memories (if you choose to upload them)</li>
                </ul>
                <p className="font-medium text-lavender-700">
                  <Shield className="w-4 h-4 inline mr-1" />
                  All child information is stored securely and is only accessible by you.
                </p>
              </div>

              <h3 className="text-xl font-medium text-gray-800 mb-2 mt-4">Technical Information</h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We automatically collect limited technical information:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>IP address and general location (country/region only)</li>
                  <li>Browser type and version</li>
                  <li>Device type and operating system</li>
                  <li>Pages visited and features used (for service improvement)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We use your information solely to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide and maintain the Little Star service</li>
                  <li>Authenticate your identity and secure your account</li>
                  <li>Store and organize your child development data</li>
                  <li>Send important service updates and security notifications</li>
                  <li>Improve our service based on usage patterns (anonymized data only)</li>
                  <li>Comply with legal obligations when required</li>
                </ul>
                <p className="font-medium text-green-700">
                  <Lock className="w-4 h-4 inline mr-1" />
                  We never sell, rent, or share your personal information with third parties for marketing purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. COPPA Compliance & Children's Privacy</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p className="font-medium text-lavender-700">
                  We are fully compliant with the Children's Online Privacy Protection Act (COPPA).
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Our service is designed for parents and guardians, not children directly</li>
                  <li>We do not knowingly collect personal information from children under 13</li>
                  <li>All child data is entered by parents/guardians who have control over the information</li>
                  <li>Parents can review, modify, or delete their child's information at any time</li>
                  <li>We implement additional safeguards for all child-related data</li>
                </ul>
                <p>
                  If we discover we have inadvertently collected personal information from a child under 13, 
                  we will promptly delete such information from our systems.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Data Security & Protection</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We implement industry-standard security measures to protect your data:</p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Encryption
                    </h4>
                    <p className="text-blue-700 text-sm">
                      All data is encrypted in transit (HTTPS) and at rest using AES-256 encryption.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center">
                      <Database className="w-4 h-4 mr-2" />
                      Access Control
                    </h4>
                    <p className="text-green-700 text-sm">
                      Strict access controls ensure only you can access your family's data.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Infrastructure
                    </h4>
                    <p className="text-purple-700 text-sm">
                      Hosted on secure, compliant cloud infrastructure with regular security audits.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Monitoring
                    </h4>
                    <p className="text-orange-700 text-sm">
                      24/7 security monitoring and automated threat detection systems.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Data Sharing & Disclosure</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p className="font-medium text-red-600">
                  We do not sell, rent, or share your personal information with third parties.
                </p>
                <p>We may only disclose your information in these limited circumstances:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                  <li><strong>Service Providers:</strong> To trusted vendors who help us operate our service (under strict confidentiality agreements)</li>
                  <li><strong>Safety:</strong> To protect the rights, property, or safety of our users</li>
                  <li><strong>Business Transfer:</strong> In the event of a merger or acquisition (with advance notice to users)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Your Rights & Choices</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>You have full control over your data and can:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Access:</strong> View all personal information we have about you</li>
                  <li><strong>Correct:</strong> Update or correct any inaccurate information</li>
                  <li><strong>Delete:</strong> Request deletion of your account and all associated data</li>
                  <li><strong>Export:</strong> Download all your data in standard formats</li>
                  <li><strong>Restrict:</strong> Limit how we process your personal information</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
                </ul>
                <p>
                  To exercise these rights, contact us at privacy@littlestar.app or use the account settings 
                  in the application.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Data Retention</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We retain your data only as long as necessary to provide our service:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Active accounts: Data retained while your account is active</li>
                  <li>Deleted accounts: Data permanently deleted within 30 days</li>
                  <li>Legal requirements: Some data may be retained longer if required by law</li>
                  <li>Backups: Encrypted backups are deleted within 90 days of account deletion</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Cookies & Tracking</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We use minimal cookies and tracking technologies:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong>Essential cookies:</strong> Required for login and security</li>
                  <li><strong>Functional cookies:</strong> Remember your preferences</li>
                  <li><strong>No tracking cookies:</strong> We do not use cookies for advertising or cross-site tracking</li>
                </ul>
                <p>You can control cookies through your browser settings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. International Users</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is hosted in [Your Data Center Location]. If you are accessing our service from 
                outside this region, your information may be transferred to and processed in [Your Data Center Location]. 
                We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Changes to This Policy</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or applicable laws. We will:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Notify you by email of material changes</li>
                  <li>Post the updated policy on our website</li>
                  <li>Update the "Last updated" date at the top of this policy</li>
                  <li>Provide a 30-day notice period for significant changes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Contact Us</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="bg-lavender-50 p-6 rounded-lg border border-lavender-200">
                  <h4 className="font-medium text-lavender-800 mb-3">Privacy Officer</h4>
                  <p className="text-lavender-700 mb-2">
                    <strong>Email:</strong> privacy@littlestar.app
                  </p>
                  <p className="text-lavender-700 mb-2">
                    <strong>Data Protection:</strong> dpo@littlestar.app
                  </p>
                  <p className="text-lavender-700 mb-2">
                    <strong>Address:</strong> [Your Business Address]
                  </p>
                  <p className="text-lavender-700">
                    <strong>Response Time:</strong> We will respond to privacy inquiries within 48 hours.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-2xl font-semibold text-green-800 mb-3">Our Privacy Promise</h2>
              <div className="text-green-700 leading-relaxed space-y-2">
                <p className="font-medium">We pledge to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Never sell your personal information</li>
                  <li>Keep your child's data secure and private</li>
                  <li>Be transparent about our data practices</li>
                  <li>Give you complete control over your information</li>
                  <li>Continuously improve our privacy protections</li>
                </ul>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                and was last updated on the same date.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}