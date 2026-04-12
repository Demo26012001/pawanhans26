import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../siteConfig';
import { galleryAPI } from '../services/api';

interface GalleryImage {
  _id: string;
  title: string;
  image: {
    url: string;
    alt: string;
  };
  category: string;
  description?: string;
  featured: boolean;
  tags: string[];
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAll();
      setImages(response.data || []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      setError('Failed to load gallery images');
      // Fallback to siteConfig if API fails
      setImages(siteConfig.gallery.images.map((image, index) => ({
        _id: `fallback-${index}`,
        title: image.title,
        image: {
          url: `${siteConfig.gallery.basePath}${image.file}`,
          alt: image.alt
        },
        category: 'other',
        featured: false,
        tags: []
      })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Gallery</h1>
        <p className="text-lg text-slate-700 text-center mb-3 max-w-3xl mx-auto">
          Experience the divine beauty of Char Dham, from mountain temples to helicopter landings, captured for your journey inspiration.
        </p>
        <p className="text-sm text-slate-500 text-center mb-10 max-w-3xl mx-auto">
          {siteConfig.gallery.notes}
        </p>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-700 text-sm text-center max-w-3xl mx-auto">
            {error} - Showing default images
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image._id} className="group overflow-hidden rounded-[32px] bg-white/5 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-64 overflow-hidden sm:h-72 md:h-80">
                <img
                  src={image.image.url}
                  alt={image.image.alt}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {image.featured && (
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">{image.title}</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full capitalize">
                    {image.category}
                  </span>
                </div>
                <p className="text-slate-600 mt-2 text-sm">
                  {image.description || 'A serene moment from our premium Char Dham helicopter services.'}
                </p>
                {image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {image.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No gallery images available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
