import { useEffect, useState } from 'react';
import { Phone, Calendar, Users, Clock, Star, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './components/ImageWithFallback';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './components/ui/carousel';
import { packagesAPI, inquiriesAPI } from './services/api';
import { siteConfig } from './siteConfig';

interface Package {
  _id?: string;
  id?: string;
  title?: string;
  name: string;
  duration: string;
  price: number;
  location?: string;
  image: string | {
    url: string;
    alt?: string;
  };
  description: string;
  highlights?: string[];
  itinerary?: Array<{ day: string; activities: string[] }>;
  inclusions?: string[];
  exclusions?: string[];
  featured?: boolean;
  isActive?: boolean;
}

const resolvePackageImage = (image: string | { url: string; alt?: string }) =>
  typeof image === 'string' ? image : image.url;

const resolvePackageAlt = (image: string | { url: string; alt?: string }, fallback: string) =>
  typeof image === 'string' ? fallback : image.alt ?? fallback;

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [reviewCarouselApi, setReviewCarouselApi] = useState<CarouselApi | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '',
    travelDate: '',
    package: '',
    message: '',
  });

  // Load packages from API
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        const response = await packagesAPI.getAll();
        const activePackages = response.data.filter((pkg: Package) => pkg.isActive);
        setPackages(activePackages);

        if (activePackages.length > 0) {
          setSelectedPackage(activePackages[0]._id);
          setFormData(prev => ({ ...prev, package: activePackages[0]._id }));
        }
      } catch (error) {
        console.error('Failed to load packages:', error);
        // Fallback to siteConfig if API fails
        setPackages(siteConfig.packages);
        if (siteConfig.packages.length > 0) {
          setSelectedPackage(siteConfig.packages[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const selectedPackageData = packages.find((pkg) => pkg._id === selectedPackage || pkg.id === selectedPackage);

  useEffect(() => {
    if (!reviewCarouselApi) return;
    const interval = window.setInterval(() => {
      reviewCarouselApi.scrollNext();
    }, 4500);

    return () => window.clearInterval(interval);
  }, [reviewCarouselApi]);

  const handleViewPackage = (pkgId: string) => {
    setSelectedPackage(pkgId);
    const detailSection = document.getElementById('packageDetails');
    detailSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedPackageImage = selectedPackageData ? resolvePackageImage(selectedPackageData.image) : '';
  const selectedPackageAlt = selectedPackageData ? resolvePackageAlt(selectedPackageData.image, selectedPackageData.name) : '';

  return (
    <div className="bg-background text-foreground">

      <section id="home" className="relative h-[500px] sm:h-[600px] lg:h-[620px] overflow-hidden bg-slate-950/5" style={{ backgroundImage: `url(${siteConfig.hero.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0">
          <video className="absolute inset-0 w-full h-full object-cover opacity-90" autoPlay muted loop playsInline poster={siteConfig.hero.poster}>
            <source src={siteConfig.hero.video} type="video/mp4" />
            Your browser does not support video playback.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-orange-950/20 to-green-950/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="text-white max-w-2xl space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight animate-slide-up">{siteConfig.hero.title}</h1>
            <p className="text-base sm:text-lg max-w-xl text-slate-100/90 animate-fade-in">{siteConfig.hero.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {siteConfig.hero.details.map((detail) => (
                <div key={detail} className="rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 px-4 sm:px-5 py-3 sm:py-4 text-sm text-slate-100 backdrop-blur-xl shadow-lg animate-pop">
                  {detail}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => setShowBookingForm(true)} className="bg-orange-600 hover:bg-orange-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base font-semibold text-white shadow-xl transition transform hover:-translate-y-1">
                Book Your Journey
              </button>
              <Link to="/packages" className="inline-flex items-center justify-center border border-white/30 bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white text-base transition hover:bg-white/20">
                View Packages
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section className="bg-gradient-to-r from-orange-600 to-green-500 text-white py-8 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {siteConfig.stats.map((stat) => (
              <div key={stat} className="rounded-3xl bg-white/10 px-6 py-6 backdrop-blur-xl shadow-lg animate-fade-in">
                <div className="text-4xl font-semibold">{stat.value}</div>
                <div className="mt-2 text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold mb-4 text-slate-900">Our Helicopter Tour Packages</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Choose from easy-to-edit packages tailored for spiritual travelers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const packageImage = resolvePackageImage(pkg.image);
              const packageAlt = resolvePackageAlt(pkg.image, pkg.name);
              const packageId = pkg._id || pkg.id || '';

              return (
                <div
                  key={packageId}
                  className={`bg-white rounded-[32px] overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-2 border border-slate-200 ${selectedPackage === packageId ? 'ring-4 ring-orange-200' : ''} animate-fade-in`}
                  onClick={() => handleViewPackage(packageId)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={packageImage}
                      alt={packageAlt}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium text-slate-800 shadow-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-slate-500/90">({pkg.reviews})</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-900">{pkg.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div>
                      <div className="text-3xl font-semibold text-orange-600">{pkg.price}</div>
                      <div className="text-sm text-slate-500">per person</div>
                    </div>
                    <div className="space-y-2">
                      {pkg.highlights?.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-700">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/packages/${packageId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center bg-orange-600 text-white py-3 rounded-full text-base font-semibold transition hover:bg-orange-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedPackageData && (
        <section id="packageDetails" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="space-y-8">
                <div className="rounded-[32px] overflow-hidden shadow-2xl bg-white">
                  <div className="relative h-96 overflow-hidden">
                    <ImageWithFallback src={selectedPackageImage} alt={selectedPackageAlt} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                        <Calendar className="w-4 h-4" />
                        {selectedPackageData.duration}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-4xl font-semibold text-slate-900">{selectedPackageData.name}</h2>
                        <p className="mt-3 text-slate-600 max-w-2xl">{selectedPackageData.description}</p>
                      </div>
                      <div className="rounded-3xl bg-orange-600 px-6 py-4 text-right text-white shadow-lg">
                        <div className="text-sm uppercase opacity-90">Starting from</div>
                        <div className="mt-2 text-3xl font-semibold">{selectedPackageData.price}</div>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      {selectedPackageData.highlights.map((highlight, idx) => (
                        <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
                          <div className="flex items-center gap-3 text-slate-900 font-medium">
                            <Check className="w-5 h-5 text-green-600" />
                            {highlight}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[32px] bg-white p-8 shadow-xl">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-4">Quick Highlights</h3>
                    <p className="text-slate-600 mb-6">A premium spiritual tour crafted for comfort, fast darshan, and luxury travel across the Char Dham.</p>
                    <ul className="space-y-3">
                      <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-600 mt-1" /><span>Priority temple darshan across all sites.</span></li>
                      <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-600 mt-1" /><span>Luxury hotel stays and VIP ground transfers.</span></li>
                      <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-600 mt-1" /><span>Experienced guides and dedicated support team.</span></li>
                      <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-600 mt-1" /><span>Flexible booking assistance and easy cancellations.</span></li>
                    </ul>
                  </div>
                  <div className="rounded-[32px] bg-white p-8 shadow-xl">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-4">Tour Route Map</h3>
                    <div className="overflow-hidden rounded-3xl border border-slate-200">
                      <ImageWithFallback src="https://images.unsplash.com/photo-1519121780023-eef668d72b4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Route map" className="w-full h-64 object-cover" />
                    </div>
                    <p className="mt-4 text-slate-600">Route includes Dehradun, Kedarnath, Badrinath, Gangotri and Yamunotri with helicopter transfers and hotel pickups.</p>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[32px] bg-white p-8 shadow-xl sticky top-8">
                  <div className="mb-6">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">Best Seller</span>
                  </div>
                  <div className="mb-6">
                    <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Package Price</div>
                    <div className="mt-3 text-4xl font-semibold text-orange-600">{selectedPackageData.price}</div>
                    <div className="mt-2 text-sm text-slate-500">Per person on twin sharing basis</div>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => setShowBookingForm(true)} className="w-full rounded-full bg-orange-600 px-5 py-4 text-white font-semibold transition hover:bg-orange-700">Request Booking</button>
                    <button className="w-full rounded-full border border-slate-200 px-5 py-4 text-slate-700 transition hover:bg-slate-100">WhatsApp Chat</button>
                  </div>
                </div>
                <div className="rounded-[32px] bg-white p-8 shadow-xl">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4">Why Choose This Package?</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex gap-3"><Check className="w-5 h-5 text-orange-600 mt-1" />VIP darshan and fast-track access.</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-orange-600 mt-1" />Safe helicopter transfers with experienced pilots.</li>
                    <li className="flex gap-3"><Check className="w-5 h-5 text-orange-600 mt-1" />Luxury accommodation and all meals included.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      <section id="itinerary" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold mb-4 text-slate-900">Day-by-Day Itinerary</h2>
            <p className="text-slate-600 text-lg">Your spiritual journey, planned to perfection.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {siteConfig.itinerary.map((day, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-8 shadow-xl animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 text-white px-4 py-2 rounded-2xl flex-shrink-0">
                    <div className="text-lg font-semibold">{day.day}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900">{day.title}</h3>
                    <ul className="space-y-3">
                      {day.activities.map((activity, actIdx) => (
                        <li key={actIdx} className="flex gap-3 text-slate-700">
                          <Check className="w-5 h-5 text-orange-500 mt-1" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-[32px] p-8 shadow-lg animate-fade-in">
              <h3 className="text-2xl mb-6 text-green-800">Package Inclusions</h3>
              <ul className="space-y-3">
                {siteConfig.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-600 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-[32px] p-8 shadow-lg animate-fade-in">
              <h3 className="text-2xl mb-6 text-red-800">Package Exclusions</h3>
              <ul className="space-y-3">
                {siteConfig.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="similarTours" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold mb-4 text-slate-900">Similar Tours You Might Like</h2>
            <p className="text-slate-600 text-lg">Explore other spiritual journeys.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {siteConfig.similarTours.map((tour, idx) => (
              <div key={idx} className="bg-white rounded-[32px] overflow-hidden shadow-2xl transition-transform duration-300 hover:-translate-y-2 animate-slide-up">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback src={tour.image} alt={tour.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full flex items-center gap-1 text-xs text-slate-800 shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{tour.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{tour.name}</h3>
                  <div className="flex items-center gap-2 text-slate-600 text-sm mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold text-orange-600">{tour.price}</div>
                      <div className="text-xs text-slate-500">per person</div>
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm transition">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-600 font-semibold">Customer Reviews</p>
            <h2 className="text-4xl font-semibold mt-4 text-slate-900">What Indian pilgrims are saying</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Real feedback from travelers who booked with Pawan Hans Yatra.</p>
          </div>
          <div className="relative">
            <Carousel
              opts={{ loop: true, align: 'start', containScroll: 'trimSnaps', draggable: true }}
              setApi={setReviewCarouselApi}
              className="overflow-visible"
            >
              <CarouselContent className="flex gap-4 pb-6">
                {siteConfig.reviews.map((review, idx) => (
                  <CarouselItem key={idx} className="basis-full md:basis-1/2 lg:basis-1/3 xl:basis-[31%]">
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-semibold text-orange-700">
                            {review.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900">{review.name}</h3>
                            <p className="text-sm text-slate-500">{review.city}</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-orange-600 text-sm font-semibold">
                          <Star className="w-4 h-4" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-4 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <Star key={starIdx} className="w-4 h-4" />
                        ))}
                      </div>
                      <p className="text-slate-700 leading-7">“{review.message}”</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:inline-flex" />
              <CarouselNext className="hidden md:inline-flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold mb-4 text-slate-900">Why Choose Pawan Hans Yatra?</h2>
            <p className="text-slate-600 text-lg">Your safety and comfort are our top priorities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-[32px] bg-white shadow-xl animate-pop">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3">100% Safety Record</h3>
              <p className="text-slate-600">Modern helicopters with regular maintenance and experienced pilots.</p>
            </div>
            <div className="text-center p-6 rounded-[32px] bg-white shadow-xl animate-pop">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3">Luxury Experience</h3>
              <p className="text-slate-600">Premium hotels, VIP darshan, and personalized service throughout.</p>
            </div>
            <div className="text-center p-6 rounded-[32px] bg-white shadow-xl animate-pop">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3">Expert Guidance</h3>
              <p className="text-slate-600">Professional tour guides with deep knowledge of temples and rituals.</p>
            </div>
          </div>
        </div>
      </section>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBookingForm(false)}>
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-orange-600 text-white p-6 flex justify-between items-center rounded-t-[32px]">
              <h2 className="text-2xl">Book Your Journey</h2>
              <button onClick={() => setShowBookingForm(false)} className="text-white hover:text-orange-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {successMessage ? (
              <div className="p-12 text-center">
                <div className="mb-4 text-6xl">✓</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Booking Inquiry Received!</h3>
                <p className="text-slate-600 mb-3">Welcome! We have received your inquiry and a confirmation has been sent to your email.</p>
                <p className="text-slate-600 mb-6">Our team will contact you within 24 hours to confirm your booking.</p>
                <button
                  onClick={() => {
                    setShowBookingForm(false);
                    setSuccessMessage('');
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormError('');
                  setSubmitting(true);

                  try {
                    if (!formData.name?.trim() || !formData.email?.trim() || !formData.phone?.trim() || !formData.travelers || !formData.travelDate || !formData.package) {
                      setFormError('Please fill in all required fields');
                      return;
                    }

                    const selectedPkg = packages.find(pkg => pkg._id === formData.package);

                    const inquiryData = {
                      name: formData.name.trim(),
                      email: formData.email.trim(),
                      phone: formData.phone.trim(),
                      travelers: parseInt(formData.travelers),
                      travelDate: formData.travelDate,
                      package: formData.package,
                      packageName: selectedPkg?.title || 'Unknown Package',
                      message: formData.message?.trim() || '',
                    };

                    await inquiriesAPI.create(inquiryData);

                    setSuccessMessage('Thank you! Your inquiry has been submitted and a welcome confirmation has been sent.');
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      travelers: '',
                      travelDate: '',
                      package: '',
                      message: '',
                    });
                  } catch (error) {
                    console.error('Failed to submit inquiry:', error);
                    setFormError('Failed to submit booking inquiry. Please try again.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="p-6 space-y-6"
              >
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-semibold">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-slate-700">Number of Travelers *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.travelers}
                      onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="Enter number of travelers"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-slate-700">Preferred Travel Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.travelDate}
                      onChange={(e) => setFormData({...formData, travelDate: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-slate-700">Select Package *</label>
                    <select
                      required
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">Choose a package</option>
                      {loading ? (
                        <option disabled>Loading packages...</option>
                      ) : (
                        packages.map((pkg) => (
                          <option key={pkg._id} value={pkg._id}>
                            {pkg.title} - ₹{pkg.price?.toLocaleString()}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-slate-700">Special Requirements (Optional)</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Any dietary restrictions, medical conditions, or special requests..."
                  />
                </div>
                <div className="bg-orange-50 p-4 rounded-3xl">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-600 mt-1" />
                    <p className="text-sm text-slate-700">By submitting this form, you agree to our terms and conditions. Our team will contact you within 24 hours to confirm your booking.</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-4 rounded-full text-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}