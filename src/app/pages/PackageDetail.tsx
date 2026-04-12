import { ArrowLeft, Calendar, Check, Star, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { siteConfig } from '../siteConfig';
import { safeJsonParse } from '../utils/localStorage';

interface Package {
  id: string;
  name: string;
  duration: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  itinerary?: Array<{ day: string; title: string; activities: string[] }>;
  inclusions?: string[];
  exclusions?: string[];
}

export default function PackageDetail() {
  const { id } = useParams();
  const allPackages = safeJsonParse<Package[]>('adminPackages', siteConfig.packages);
  const pkg = allPackages.find((item) => item.id === id || item._id === id);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Package Not Found</h1>
          <p className="text-slate-600 mb-6">The package you are looking for does not exist. Please go back to the packages page and choose another tour.</p>
          <Link to="/packages" className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-white font-semibold hover:bg-orange-700 transition">
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/packages" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </Link>

        <div className="grid gap-10 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[32px] overflow-hidden shadow-2xl bg-white">
              <div className="relative h-96 overflow-hidden">
                <ImageWithFallback src={typeof pkg.image === 'string' ? pkg.image : pkg.image?.url} alt={pkg.name ?? pkg.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium text-slate-800 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{pkg.rating}</span>
                  <span className="text-slate-500/90">({pkg.reviews})</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-4xl font-semibold text-slate-900">{pkg.name ?? pkg.title}</h1>
                    <p className="mt-3 text-slate-600 max-w-2xl">{pkg.description}</p>
                  </div>
                  <div className="rounded-3xl bg-orange-600 px-6 py-4 text-right text-white shadow-lg">
                    <div className="text-sm uppercase opacity-90">Starting from</div>
                    <div className="mt-2 text-3xl font-semibold">{pkg.price}</div>
                  </div>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-900 font-medium">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-900 font-medium">
                      <Users className="w-5 h-5 text-green-600" />
                      <span>Group Tour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[32px] bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Package Highlights</h2>
                <ul className="space-y-3 text-slate-700">
                  {pkg.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex gap-3">
                      <Check className="w-5 h-5 text-orange-600 mt-1" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[32px] bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">What’s Included</h2>
                <ul className="space-y-3 text-slate-700">
                  {siteConfig.inclusions.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-slate-900">Book This Package</h2>
              <p className="mt-2 text-slate-600">Fill the form below and our team will contact you to confirm the booking.</p>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block mb-2 text-slate-700">Full Name *</label>
                <input type="text" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block mb-2 text-slate-700">Email Address *</label>
                <input type="email" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="your.email@example.com" />
              </div>
              <div>
                <label className="block mb-2 text-slate-700">Phone Number *</label>
                <input type="tel" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block mb-2 text-slate-700">Selected Package</label>
                <input type="text" readOnly value={pkg.name} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600" />
              </div>
              <div>
                <label className="block mb-2 text-slate-700">Preferred Travel Date *</label>
                <input type="date" required className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600" />
              </div>
              <div>
                <label className="block mb-2 text-slate-700">Number of Passengers *</label>
                <select className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600">
                  <option>1 Passenger</option>
                  <option>2 Passengers</option>
                  <option>3 Passengers</option>
                  <option>4+ Passengers</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-slate-700">Special Requests</label>
                <textarea rows={4} className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="Dietary needs, medical assistance, or other requests" />
              </div>
              <div className="rounded-3xl bg-orange-50 p-4 text-slate-700">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-orange-600 mt-1" />
                  <p className="text-sm">By submitting this request, you agree to our terms and conditions. Our team will contact you within 24 hours.</p>
                </div>
              </div>
              <button type="submit" className="w-full rounded-full bg-orange-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-orange-700">
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
