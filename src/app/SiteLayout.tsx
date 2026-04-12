import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import { siteConfig } from './siteConfig';

export default function SiteLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="Pawan Hans logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <img src="/brand-text.png" alt="Pawan Hans Yatra" className="h-12 sm:h-16 object-contain" />
            </div>

            <nav className="hidden md:flex items-center gap-8 text-slate-700">
              {siteConfig.navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="transition hover:text-orange-600 text-sm lg:text-base">
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>

            <div className="hidden sm:flex items-center text-orange-600 gap-3">
              <Phone className="w-5 h-5" />
              <a href={`tel:${siteConfig.contact.phone}`} className="font-medium hover:text-orange-700 text-sm lg:text-base">
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
              <nav className="py-4 space-y-2">
                {siteConfig.navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-colors rounded-lg mx-4"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 py-3 border-t border-slate-200 mt-4">
                  <div className="flex items-center text-orange-600 gap-3">
                    <Phone className="w-5 h-5" />
                    <a href={`tel:${siteConfig.contact.phone}`} className="font-medium hover:text-orange-700">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[40px] border border-white/10 bg-slate-950/95 p-8 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Pawan Hans logo" className="w-12 h-12 object-contain" />
                  <div>
                    <h3 className="text-2xl font-semibold">Pawan Hans Yatra</h3>
                    <p className="text-sm text-slate-400">Premium spiritual helicopter journeys across Char Dham.</p>
                  </div>
                </div>
                <p className="text-slate-400 max-w-sm">Your trusted partner for spiritual helicopter tours in Uttarakhand. Experience divine darshan with unmatched comfort, safety, and care.</p>
              </div>
              <div>
                <h3 className="text-xl mb-4">Quick Contact</h3>
                <div className="space-y-3 text-slate-200">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-400" />
                    <span>{siteConfig.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400">📧</span>
                    <span>{siteConfig.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400">📍</span>
                    <span>{siteConfig.contact.location}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl mb-4">Useful Links</h3>
                <div className="flex flex-col gap-3 text-slate-300">
                  <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
                  <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                  <Link to="/cookies" className="hover:text-white">Cookies Policy</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500">
              <p>&copy; 2026 Pawan Hans Yatra. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
