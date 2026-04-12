import { siteConfig } from '../siteConfig';

const STORAGE_KEYS = {
  packages: 'adminPackages',
  gallery: 'adminGallery',
  inquiries: 'bookingInquiries',
  authToken: 'authToken',
  adminUser: 'adminUser',
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const ADMIN_CREDENTIALS = {
  id: 'admin',
  name: 'Administrator',
  email: 'admin@pawanhans.com',
  role: 'Administrator',
  password: 'admin123',
};

const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
};

const writeStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
};

const makeId = () => `id-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;

const normalizePackageForStorage = (raw: any) => {
  const imageString = typeof raw.image === 'string' ? raw.image : raw.image?.url || '';
  const title = raw.title || raw.name || 'New Package';
  const id = raw.id || raw._id || makeId();

  return {
    _id: id,
    id,
    title,
    name: raw.name || title,
    duration: raw.duration || raw.duration || '2 Days / 1 Night',
    price: raw.price ?? raw.price ?? '₹0',
    description: raw.description || '',
    image: imageString || '/placeholder-package.jpg',
    rating: raw.rating ?? 0,
    reviews: raw.reviews ?? 0,
    highlights: raw.highlights || [],
    itinerary: raw.itinerary || [],
    inclusions: raw.inclusions || [],
    exclusions: raw.exclusions || [],
    isActive: raw.isActive !== false,
  };
};

const normalizePackageForApi = (item: any) => ({
  ...item,
  _id: item._id || item.id,
  id: item.id || item._id,
  title: item.title || item.name || 'Package',
  name: item.name || item.title || 'Package',
  image: {
    url: typeof item.image === 'string' ? item.image : item.image?.url || '/placeholder-package.jpg',
    alt: item.image?.alt || item.title || item.name || 'Package image',
  },
});

const normalizeGalleryForStorage = (raw: any) => {
  const imageUrl = typeof raw.image === 'string' ? raw.image : raw.image?.url || '/placeholder-gallery.jpg';
  const imageAlt = raw.image?.alt || raw.alt || raw.title || 'Gallery image';
  const id = raw._id || raw.id || makeId();

  return {
    _id: id,
    title: raw.title || 'Gallery Image',
    category: raw.category || 'other',
    description: raw.description || '',
    isActive: raw.isActive !== false,
    featured: raw.featured ?? false,
    order: raw.order ?? 0,
    tags: raw.tags || [],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    image: {
      url: imageUrl,
      alt: imageAlt,
      publicId: raw.image?.publicId || raw.publicId || id,
    },
  };
};

const normalizeGalleryForApi = (item: any) => ({
  ...item,
  image: {
    url: item.image?.url || '/placeholder-gallery.jpg',
    alt: item.image?.alt || item.title || 'Gallery image',
    publicId: item.image?.publicId || item._id || item.id || 'gallery-image',
  },
  tags: item.tags || [],
  category: item.category || 'other',
  featured: Boolean(item.featured),
  isActive: item.isActive !== false,
  order: item.order ?? 0,
});

const createDefaultPackages = () => siteConfig.packages.map(normalizePackageForStorage);

const createDefaultGallery = () =>
  siteConfig.gallery.images.map((item, index) =>
    normalizeGalleryForStorage({
      _id: `gallery-${index}`,
      title: item.title,
      image: item.file ? `${siteConfig.gallery.basePath}${item.file}` : item.image,
      category: 'other',
      alt: item.alt,
      featured: false,
      order: index,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  );

const ensureDefaultData = () => {
  const packages = readStorage(STORAGE_KEYS.packages, createDefaultPackages());
  writeStorage(STORAGE_KEYS.packages, packages);

  const gallery = readStorage(STORAGE_KEYS.gallery, createDefaultGallery());
  writeStorage(STORAGE_KEYS.gallery, gallery);

  const inquiries = readStorage(STORAGE_KEYS.inquiries, [] as any[]);
  writeStorage(STORAGE_KEYS.inquiries, inquiries);
};

const getData = <T>(key: string, fallback: T) => readStorage(key, fallback);

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('File conversion failed'));
    reader.readAsDataURL(file);
  });

ensureDefaultData();

export const authAPI = {
  login: async ({ email, password }: { email: string; password: string }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = `static-token-${makeId()}`;
      localStorage.setItem(STORAGE_KEYS.authToken, token);
      writeStorage(STORAGE_KEYS.adminUser, {
        id: ADMIN_CREDENTIALS.id,
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role,
      });
      return {
        data: {
          token,
          admin: {
            id: ADMIN_CREDENTIALS.id,
            name: ADMIN_CREDENTIALS.name,
            email: ADMIN_CREDENTIALS.email,
            role: ADMIN_CREDENTIALS.role,
          },
        },
      };
    }
    throw new Error('Invalid admin credentials');
  },

  register: async () => {
    throw new Error('Registration is not available for the static admin panel');
  },

  getProfile: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    const admin = readStorage(STORAGE_KEYS.adminUser, null as any);
    if (!token || !admin) {
      throw new Error('Admin is not authenticated');
    }
    return { data: admin };
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.adminUser);
    return { data: { success: true } };
  },
};

export const packagesAPI = {
  getAll: async () => {
    const packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    return {
      data: packages
        .filter((pkg) => pkg.isActive)
        .map(normalizePackageForApi),
    };
  },

  getAllAdmin: async () => {
    const packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    return {
      data: packages.map(normalizePackageForApi),
    };
  },

  getById: async (id: string) => {
    const packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    const found = packages.find((pkg) => pkg._id === id || pkg.id === id);
    if (!found) throw new Error('Package not found');
    return { data: normalizePackageForApi(found) };
  },

  create: async (packageData: any) => {
    const packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    const newPackage = normalizePackageForStorage({
      ...packageData,
      id: packageData.id || makeId(),
      _id: packageData._id || packageData.id || makeId(),
      title: packageData.title || packageData.name,
      name: packageData.name || packageData.title,
      image:
        typeof packageData.image === 'string'
          ? packageData.image
          : packageData.image?.url || '/placeholder-package.jpg',
    });
    packages.push(newPackage);
    writeStorage(STORAGE_KEYS.packages, packages);
    return { data: normalizePackageForApi(newPackage) };
  },

  update: async (id: string, packageData: any) => {
    const packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    const index = packages.findIndex((pkg) => pkg._id === id || pkg.id === id);
    if (index === -1) throw new Error('Package not found');

    packages[index] = normalizePackageForStorage({
      ...packages[index],
      ...packageData,
      title: packageData.title || packageData.name || packages[index].title,
      name: packageData.name || packageData.title || packages[index].name,
      image:
        typeof packageData.image === 'string'
          ? packageData.image
          : packageData.image?.url || packages[index].image,
    });

    writeStorage(STORAGE_KEYS.packages, packages);
    return { data: normalizePackageForApi(packages[index]) };
  },

  updateImage: async (id: string, formData: FormData) => {
    const packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    const index = packages.findIndex((pkg) => pkg._id === id || pkg.id === id);
    if (index === -1) throw new Error('Package not found');

    const imageFile = formData.get('image') as File | null;
    if (!imageFile) throw new Error('Image file is required');

    const imageUrl = await fileToDataUrl(imageFile);
    packages[index].image = imageUrl;
    writeStorage(STORAGE_KEYS.packages, packages);

    return { data: normalizePackageForApi(packages[index]) };
  },

  delete: async (id: string) => {
    let packages = getData(STORAGE_KEYS.packages, createDefaultPackages());
    packages = packages.filter((pkg) => pkg._id !== id && pkg.id !== id);
    writeStorage(STORAGE_KEYS.packages, packages);
    return { data: { success: true } };
  },
};

export const galleryAPI = {
  getAll: async (category?: string) => {
    const gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    const result = gallery.filter((item) => item.isActive);
    return {
      data:
        category && category !== 'all'
          ? result.filter((item) => item.category.toLowerCase() === category.toLowerCase())
          : result,
    };
  },

  getAllAdmin: async () => {
    const gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    return {
      data: gallery.map(normalizeGalleryForApi),
    };
  },

  getById: async (id: string) => {
    const gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    const item = gallery.find((entry) => entry._id === id || entry.id === id);
    if (!item) throw new Error('Gallery image not found');
    return { data: normalizeGalleryForApi(item) };
  },

  upload: async (formData: FormData) => {
    const gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      throw new Error('Image file is required');
    }

    const imageUrl = await fileToDataUrl(imageFile);
    const title = String(formData.get('title') || 'Gallery Image');
    const alt = String(formData.get('alt') || title);
    const category = String(formData.get('category') || 'other');
    const description = String(formData.get('description') || '');
    const featured = String(formData.get('featured') || 'false') === 'true';
    const tags = String(formData.get('tags') || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const newItem = normalizeGalleryForStorage({
      _id: makeId(),
      title,
      image: imageUrl,
      alt,
      category,
      description,
      featured,
      tags,
      order: gallery.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    gallery.push(newItem);
    writeStorage(STORAGE_KEYS.gallery, gallery);
    return { data: normalizeGalleryForApi(newItem) };
  },

  update: async (id: string, imageData: any) => {
    const gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    const index = gallery.findIndex((entry) => entry._id === id || entry.id === id);
    if (index === -1) throw new Error('Gallery image not found');

    gallery[index] = normalizeGalleryForStorage({
      ...gallery[index],
      ...imageData,
      image: imageData.image?.url || gallery[index].image,
      title: imageData.title || gallery[index].title,
      category: imageData.category || gallery[index].category,
      description: imageData.description || gallery[index].description,
      featured: imageData.featured ?? gallery[index].featured,
      tags: imageData.tags || gallery[index].tags,
      updatedAt: new Date().toISOString(),
    });

    writeStorage(STORAGE_KEYS.gallery, gallery);
    return { data: normalizeGalleryForApi(gallery[index]) };
  },

  updateImage: async (id: string, formData: FormData) => {
    const gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    const index = gallery.findIndex((entry) => entry._id === id || entry.id === id);
    if (index === -1) throw new Error('Gallery image not found');

    const imageFile = formData.get('image') as File | null;
    if (!imageFile) throw new Error('Image file is required');

    const imageUrl = await fileToDataUrl(imageFile);
    gallery[index].image.url = imageUrl;
    gallery[index].updatedAt = new Date().toISOString();
    writeStorage(STORAGE_KEYS.gallery, gallery);

    return { data: normalizeGalleryForApi(gallery[index]) };
  },

  delete: async (id: string) => {
    let gallery = getData(STORAGE_KEYS.gallery, createDefaultGallery());
    gallery = gallery.filter((entry) => entry._id !== id && entry.id !== id);
    writeStorage(STORAGE_KEYS.gallery, gallery);
    return { data: { success: true } };
  },
};

export const inquiriesAPI = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const inquiries = getData(STORAGE_KEYS.inquiries, [] as any[]);
    let result = inquiries;
    if (params?.status) {
      result = result.filter((item) => item.status === params.status);
    }
    return { data: result };
  },

  getById: async (id: string) => {
    const inquiries = getData(STORAGE_KEYS.inquiries, [] as any[]);
    const inquiry = inquiries.find((item) => item._id === id || item.id === id);
    if (!inquiry) throw new Error('Inquiry not found');
    return { data: inquiry };
  },

  create: async (inquiryData: any) => {
    const apiUrl = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, '')}/api/inquiries` : '/api/inquiries';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Inquiry service failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { data };
    const newInquiry = {
      _id: inquiryData.id || makeId(),
      id: inquiryData.id || inquiryData._id || makeId(),
      name: inquiryData.name || '',
      email: inquiryData.email || '',
      phone: inquiryData.phone || '',
      package: inquiryData.package || '',
      packageName: inquiryData.packageName || '',
      travelers: inquiryData.travelers || 1,
      travelDate: inquiryData.travelDate || '',
      message: inquiryData.message || '',
      status: inquiryData.status || 'new',
      priority: inquiryData.priority || 'medium',
      notes: inquiryData.notes || [],
      source: inquiryData.source || 'web',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inquiries.push(newInquiry);
    writeStorage(STORAGE_KEYS.inquiries, inquiries);
    return { data: newInquiry };
  },

  update: async (id: string, inquiryData: any) => {
    const inquiries = getData(STORAGE_KEYS.inquiries, [] as any[]);
    const index = inquiries.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) throw new Error('Inquiry not found');

    inquiries[index] = {
      ...inquiries[index],
      ...inquiryData,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.inquiries, inquiries);
    return { data: inquiries[index] };
  },

  addNote: async (id: string, noteContent: string) => {
    const inquiries = getData(STORAGE_KEYS.inquiries, [] as any[]);
    const index = inquiries.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) throw new Error('Inquiry not found');

    const note = {
      content: noteContent,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
    };

    inquiries[index].notes = [...(inquiries[index].notes || []), note];
    inquiries[index].updatedAt = new Date().toISOString();
    writeStorage(STORAGE_KEYS.inquiries, inquiries);
    return { data: inquiries[index] };
  },

  delete: async (id: string) => {
    let inquiries = getData(STORAGE_KEYS.inquiries, [] as any[]);
    inquiries = inquiries.filter((item) => item._id !== id && item.id !== id);
    writeStorage(STORAGE_KEYS.inquiries, inquiries);
    return { data: { success: true } };
  },
};

export const healthAPI = {
  check: async () => ({ data: { status: 'ok' } }),
};

export default {
  auth: authAPI,
  packages: packagesAPI,
  gallery: galleryAPI,
  inquiries: inquiriesAPI,
  health: healthAPI,
};