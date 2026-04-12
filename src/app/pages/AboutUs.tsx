import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">About Us</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-slate-700 mb-6">
            Pawan Hans Yatra is a premium helicopter service dedicated to providing spiritual journeys
            to the sacred Char Dham destinations in the Himalayas. As a Government of India enterprise,
            we combine safety, comfort, and spiritual fulfillment in every pilgrimage.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-700 mb-6">
            To make the divine journey to Char Dham accessible, comfortable, and spiritually enriching
            for pilgrims from around the world, while maintaining the highest standards of safety and service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-slate-700 mb-6 space-y-2">
            <li>Premium helicopter fleet with experienced pilots</li>
            <li>VIP darshan passes for priority temple visits</li>
            <li>Luxury accommodations and guided tours</li>
            <li>24/7 support and emergency services</li>
            <li>Government-backed reliability and safety standards</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Heritage</h2>
          <p className="text-slate-700">
            Established as part of Pawan Hans Limited, India's premier helicopter service provider,
            we bring decades of aviation excellence to spiritual tourism. Our commitment to safety
            and service excellence makes us the preferred choice for Char Dham pilgrimages.
          </p>
        </div>
      </div>
    </div>
  );
}