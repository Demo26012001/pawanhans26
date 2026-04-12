import { useState, useEffect } from 'react';
import { Trash2, Plus, X, Upload, Loader2 } from 'lucide-react';
import { galleryAPI } from '../../services/api';

interface GalleryImage {
  _id: string;
  title: string;
  image: {
    url: string;
    publicId: string;
    alt: string;
  };
  category: string;
  description?: string;
  isActive: boolean;
  featured: boolean;
  order: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    alt: '',
    category: 'other',
    description: '',
    featured: false,
    tags: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await galleryAPI.getAllAdmin();
      setGallery(response.data || []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      setFormError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setFormError('');
    }
  };

  const handleAdd = async () => {
    setFormError('');
    
    if (!selectedFile) {
      setFormError('Please select an image file');
      return;
    }
    if (!formData.title?.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formData.alt?.trim()) {
      setFormError('Alt text is required');
      return;
    }

    try {
      setUploading(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedFile);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('alt', formData.alt.trim());
      uploadFormData.append('category', formData.category);
      if (formData.description?.trim()) {
        uploadFormData.append('description', formData.description.trim());
      }
      uploadFormData.append('featured', formData.featured.toString());
      if (formData.tags?.trim()) {
        uploadFormData.append('tags', formData.tags.split(',').map(tag => tag.trim()).join(','));
      }

      await galleryAPI.upload(uploadFormData);
      
      // Reset form
      setFormData({
        title: '',
        alt: '',
        category: 'other',
        description: '',
        featured: false,
        tags: '',
      });
      setSelectedFile(null);
      setShowForm(false);
      
      // Reload gallery
      await loadGallery();
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      setFormError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      await galleryAPI.delete(id);
      await loadGallery();
    } catch (error: any) {
      console.error('Failed to delete image:', error);
      setFormError(error.message || 'Failed to delete image');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await galleryAPI.update(id, { featured: !currentFeatured });
      await loadGallery();
    } catch (error: any) {
      console.error('Failed to update image:', error);
      setFormError(error.message || 'Failed to update image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        <span className="ml-2 text-slate-600">Loading gallery...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-[24px] p-4 text-sm text-blue-800">
        <p><strong>Recommended Image Ratio:</strong> 4:3 (e.g., 1600x1200 or 1200x900)</p>
        <p><strong>Supported Formats:</strong> JPG, PNG, WebP (max 5MB)</p>
        <p><strong>Cloud Storage:</strong> Images uploaded to AWS S3 for fast global delivery</p>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-semibold">
          {formError}
        </div>
      )}

      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Manage Gallery ({gallery.length} images)</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              Upload Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((image) => (
              <div key={image._id} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition">
                <img 
                  src={image.image.url} 
                  alt={image.image.alt}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex-1">{image.title}</h3>
                    <button
                      onClick={() => handleToggleFeatured(image._id, image.featured)}
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold transition ${
                        image.featured 
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {image.featured ? 'Featured' : 'Feature'}
                    </button>
                  </div>
                  <p className="text-sm text-slate-600"><strong>Category:</strong> {image.category}</p>
                  <p className="text-sm text-slate-600"><strong>Alt Text:</strong> {image.image.alt}</p>
                  {image.description && (
                    <p className="text-sm text-slate-600"><strong>Description:</strong> {image.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {gallery.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p>No gallery images yet. Click "Upload Image" to add your first image.</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Upload New Image</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image File *</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-orange-400 transition"
                >
                  {selectedFile ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Click to select image</p>
                      <p className="text-xs text-slate-500">JPG, PNG, WebP (max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Image Title *</label>
              <input
                type="text"
                placeholder="e.g., Himalayan Dawn"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Alt Text (Accessibility) *</label>
              <textarea
                placeholder="Describe the image for accessibility..."
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="destination">Destination</option>
                  <option value="helicopter">Helicopter</option>
                  <option value="experience">Experience</option>
                  <option value="nature">Nature</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-semibold text-slate-700">Featured Image</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
              <textarea
                placeholder="Optional description of the image..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (Optional)</label>
              <input
                type="text"
                placeholder="e.g., mountain, sunrise, adventure (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={() => setShowForm(false)}
              disabled={uploading}
              className="px-6 py-3 border border-slate-300 rounded-full font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={uploading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-full font-semibold transition flex items-center gap-2"
            >
              {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
