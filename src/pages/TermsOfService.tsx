import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream-50 to-mint-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-lavender-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/home" className="flex items-center gap-2">
              <Star className="w-8 h-8 text-lavender-500" />
              <span className="text-xl font-bold text-gray-800">Little Star</span>
            </Link>
            <Link to="/home">
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
            <CardTitle className="text-3xl font-bold text-gray-800 text-center">
              Terms of Service
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Little Star ("the Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                Little Star is a child development tracking application that allows parents and guardians to record, 
                organize, and track their children's growth, health records, activities, and memories. The Service 
                is designed to be privacy-focused and secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>To use certain features of the Service, you must create an account. You agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  You must be at least 18 years old to create an account. If you are under 18, a parent or 
                  legal guardian must create and manage the account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Privacy and Data Protection</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Your privacy is extremely important to us. Our collection and use of personal information 
                  is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  We are committed to protecting children's privacy and comply with the Children's Online 
                  Privacy Protection Act (COPPA). We do not knowingly collect personal information from 
                  children under 13 without verifiable parental consent.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Acceptable Use</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Violate any local, state, national, or international law</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Upload harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use the Service for any commercial purposes without our written consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Content Ownership and License</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  You retain ownership of all content you upload to the Service, including photos, notes, 
                  and other materials ("User Content"). By uploading User Content, you grant us a limited, 
                  non-exclusive license to store, process, and display your content solely for providing 
                  the Service to you.
                </p>
                <p>
                  You represent and warrant that you have all necessary rights to the User Content you upload 
                  and that such content does not violate these Terms or any applicable laws.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Data Security and Backup</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  We implement industry-standard security measures to protect your data. However, no method 
                  of electronic storage or transmission is 100% secure. You are responsible for maintaining 
                  backup copies of your important data.
                </p>
                <p>
                  We provide data export functionality to help you maintain control over your information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to provide reliable service but cannot guarantee 100% uptime. The Service may be 
                temporarily unavailable due to maintenance, updates, or circumstances beyond our control. 
                We reserve the right to modify, suspend, or discontinue the Service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Limitation of Liability</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, LITTLE STAR SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO 
                  LOSS OF DATA, REVENUE, OR PROFITS.
                </p>
                <p>
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE SHALL 
                  NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless Little Star and its affiliates from any claims, 
                damages, costs, and expenses (including reasonable attorney fees) arising from your use 
                of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Termination</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion 
                  feature in the Service. Upon termination, you will lose access to your account and all 
                  associated data.
                </p>
                <p>
                  We may terminate or suspend your account immediately if you violate these Terms, without 
                  prior notice or liability.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">12. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes via email or through the Service. Your continued use of the Service after changes 
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">13. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                without regard to its conflict of law provisions. Any disputes arising from these Terms or 
                the Service shall be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">14. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining 
                provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">15. Contact Information</h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>If you have any questions about these Terms, please contact us at:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Little Star Support</strong></p>
                  <p>Email: legal@littlestar.app</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                These Terms of Service are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                and were last updated on the same date.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}