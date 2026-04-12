import { ArrowLeft, Star, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
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

export default function Packages() {
  const packages = safeJsonParse<Package[]>('adminPackages', siteConfig.packages);

  const normalizedPackages = packages.map((pkg) => ({
    ...pkg,
    id: pkg.id ?? (pkg as any)._id,
    name: pkg.name ?? (pkg as any).title,
    imageUrl: typeof pkg.image === 'string' ? pkg.image : pkg.image?.url,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Our Packages</h1>
        <p className="text-lg text-slate-700 text-center mb-12">
          Choose the perfect helicopter pilgrimage package for your spiritual journey
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {normalizedPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{pkg.rating}</span>
                  <span className="text-sm text-slate-600">({pkg.reviews})</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                <div className="flex items-center gap-4 text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Group Tour
                  </div>
                </div>

                <p className="text-slate-700 mb-4">{pkg.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Package Highlights:</h4>
                  <ul className="grid grid-cols-2 gap-1 text-sm text-slate-600">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-orange-600">{pkg.price}</span>
                    <span className="text-slate-600"> per person</span>
                  </div>
                  <Link
                    to={`/packages/${pkg.id}`}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}