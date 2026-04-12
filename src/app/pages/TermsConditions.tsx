import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms & Conditions</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 mb-6">
            Please read these terms and conditions carefully before booking your helicopter pilgrimage with Pawan Hans Yatra.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Booking and Payment</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>All bookings are subject to availability and confirmation</li>
            <li>Full payment is required at the time of booking</li>
            <li>Payments are non-refundable except in cases of cancellation by Pawan Hans Yatra</li>
            <li>Prices are subject to change without prior notice</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Cancellation Policy</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Cancellation 30 days before departure: 50% refund</li>
            <li>Cancellation 15-29 days before departure: 25% refund</li>
            <li>Cancellation less than 15 days before departure: No refund</li>
            <li>In case of medical emergency, partial refund may be considered on case-by-case basis</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Travel Requirements</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Valid government-issued photo ID is mandatory</li>
            <li>Medical fitness certificate may be required for certain packages</li>
            <li>Passengers must comply with all aviation security regulations</li>
            <li>Weight restrictions apply for helicopter travel</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Safety and Liability</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Pawan Hans Yatra maintains the highest safety standards</li>
            <li>Flights may be delayed or cancelled due to weather conditions</li>
            <li>Pawan Hans Yatra is not liable for acts of nature or force majeure</li>
            <li>Travel insurance is recommended for all passengers</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Health and Medical</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Passengers must be medically fit to travel at high altitudes</li>
            <li>Pregnant women and individuals with certain medical conditions may not be eligible</li>
            <li>Medical assistance will be provided in case of emergencies</li>
            <li>Passengers are responsible for their own health insurance</li>
          </ul>

          <p className="text-slate-700 mt-8">
            By booking with Pawan Hans Yatra, you acknowledge that you have read, understood, and agree to these terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}