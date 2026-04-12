import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 mb-6">
            At Pawan Hans Yatra, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information We Collect</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Personal information provided during booking (name, contact details, ID proof)</li>
            <li>Travel preferences and special requirements</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Communication records for customer service purposes</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>To process and confirm your bookings</li>
            <li>To provide customer support and respond to inquiries</li>
            <li>To send important travel updates and notifications</li>
            <li>To improve our services and website functionality</li>
            <li>To comply with legal and regulatory requirements</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Information Sharing</h2>
          <p className="text-slate-700 mb-6">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>With service providers necessary for fulfilling your booking</li>
            <li>With government authorities when required by law</li>
            <li>With your explicit consent for specific purposes</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>We implement industry-standard security measures to protect your data</li>
            <li>All payment information is encrypted and processed securely</li>
            <li>Access to personal information is restricted to authorized personnel only</li>
            <li>We regularly review and update our security practices</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Rights</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to request deletion of your data (subject to legal requirements)</li>
            <li>Right to opt-out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
          <p className="text-slate-700">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <p className="text-slate-700">Email: privacy@pawanhansyatra.com</p>
            <p className="text-slate-700">Phone: +91-XXXXXXXXXX</p>
          </div>
        </div>
      </div>
    </div>
  );
}