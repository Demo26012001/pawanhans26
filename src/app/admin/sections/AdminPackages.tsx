import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { packagesAPI } from '../../services/api';

interface Package {
  _id: string;
  id?: string;
  title: string;
  name?: string;
  duration?: string;
  location?: string;
  price: string | number;
  highlights?: string[];
  description: string;
  image?: {
    url: string;
  } | string;
  isActive?: boolean;
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');

  const initialForm = {
    title: '',
    duration: '',
    location: '',
    price: '',
    highlights: '',
    description: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await packagesAPI.getAllAdmin();
      setPackages(res.data || []);
    } catch {
      setFormError('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return setFormError('Package name is required');
    if (!formData.duration.trim()) return setFormError('Duration is required');
    if (!formData.description.trim()) return setFormError('Description is required');
    if (!String(formData.price).trim()) return setFormError('Price is required');

    setSaving(true);
    setFormError('');

    const highlights = formData.highlights
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      name: formData.title,
      duration: formData.duration,
      location: formData.location,
      price: String(formData.price).trim(),
      description: formData.description,
      highlights,
      isActive: formData.isActive,
      image: imagePreview || undefined,
    };

    try {
      if (editingId) {
        await packagesAPI.update(editingId, payload);
      } else {
        await packagesAPI.create(payload);
      }

      await loadPackages();

      setFormData(initialForm);
      setImagePreview('');
      setEditingId(null);
      setShowForm(false);
    } catch {
      setFormError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      title: pkg.title,
      duration: pkg.duration || '',
      location: pkg.location || '',
      price: pkg.price ?? '',
      highlights: pkg.highlights?.join(', ') || '',
      description: pkg.description,
      isActive: pkg.isActive ?? true,
    });
    setImagePreview(pkg.image?.url || '');
    setEditingId(pkg._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this package?')) return;

    try {
      await packagesAPI.delete(id);
      loadPackages();
    } catch {
      setFormError('Delete failed');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
    setImagePreview('');
    setFormError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {formError && <div className="text-red-600">{formError}</div>}

      {!showForm ? (
        <>
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Packages</h2>
            <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-4 py-2 rounded">
              <Plus /> Add
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((p) => (
              <div key={p._id} className="border p-3 rounded">
                <img
                  src={p.image?.url || (typeof p.image === 'string' ? p.image : '/placeholder-package.jpg')}
                  className="h-40 w-full object-cover"
                  alt={p.title}
                />
                <h3 className="font-bold">{p.title}</h3>
                <p>{p.price}</p>
                {p.duration ? <p className="text-sm text-slate-500">{p.duration}</p> : null}

                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(p)}><Edit /></button>
                  <button onClick={() => handleDelete(p._id)}><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <input
            placeholder="Package Name"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <input
            placeholder="Duration (e.g. 4 Days / 3 Nights)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />

          <input
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <input
            placeholder="Price (e.g. ₹1,25,000)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />

          <input
            placeholder="Highlights (comma separated)"
            value={formData.highlights}
            onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive">Active package</label>
          </div>

          <input type="file" onChange={handleImageUpload} />

          {imagePreview && <img src={imagePreview} className="h-40 w-full object-cover rounded" />}

          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
              {saving ? 'Saving...' : 'Save'}
            </button>

            <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}