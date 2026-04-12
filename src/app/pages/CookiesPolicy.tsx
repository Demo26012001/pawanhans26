import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Cookies Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 mb-6">
            This Cookies Policy explains how Pawan Hans Yatra uses cookies and similar technologies on our website.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">What Are Cookies?</h2>
          <p className="text-slate-700 mb-6">
            Cookies are small text files that are stored on your device when you visit our website.
            They help us provide you with a better browsing experience and allow certain features to work properly.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Types of Cookies We Use</h2>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">Essential Cookies</h3>
          <p className="text-slate-700 mb-4">
            These cookies are necessary for the website to function properly. They enable core functionality
            such as page navigation, access to secure areas, and basic site features.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">Analytics Cookies</h3>
          <p className="text-slate-700 mb-4">
            We use analytics cookies to understand how visitors interact with our website. This helps us
            improve our website's performance and user experience.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">Functional Cookies</h3>
          <p className="text-slate-700 mb-4">
            These cookies remember your preferences and settings, such as language selection or
            previously viewed content, to enhance your browsing experience.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Cookies</h2>
          <p className="text-slate-700 mb-6">
            We may use third-party services that set their own cookies, such as:
          </p>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Google Analytics for website analytics</li>
            <li>Social media plugins for sharing functionality</li>
            <li>Payment processors for secure transactions</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Managing Cookies</h2>
          <p className="text-slate-700 mb-4">
            You can control and manage cookies in various ways:
          </p>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Most web browsers allow you to control cookies through their settings</li>
            <li>You can delete all cookies that are already on your computer</li>
            <li>You can set most browsers to prevent cookies from being placed</li>
            <li>Note that disabling cookies may affect the functionality of our website</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Updates to This Policy</h2>
          <p className="text-slate-700 mb-6">
            We may update this Cookies Policy from time to time. Any changes will be posted on this page
            with an updated revision date.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
          <p className="text-slate-700">
            If you have any questions about our use of cookies, please contact us at:
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