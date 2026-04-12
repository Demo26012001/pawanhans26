import { useState } from 'react';
import { LogOut, Package, Image as ImageIcon, MessageSquare, Download, Upload } from 'lucide-react';
import { useAdmin } from './AdminContext';
import AdminPackages from './sections/AdminPackages';
import AdminGallery from './sections/AdminGallery';
import AdminInquiries from './sections/AdminInquiries';

type TabType = 'packages' | 'gallery' | 'inquiries';

export default function AdminDashboard() {
  const { logout, user, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('packages');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      window.location.href = '/admin';
    }
  };

  // Data export/import functions
  const exportData = () => {
    try {
      const data = {
        adminPackages: localStorage.getItem('adminPackages'),
        adminGallery: localStorage.getItem('adminGallery'),
        bookingInquiries: localStorage.getItem('bookingInquiries'),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pawanhans-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('✅ Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export data');
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm('⚠️ This will overwrite all existing admin data. Continue?')) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.adminPackages) localStorage.setItem('adminPackages', data.adminPackages);
        if (data.adminGallery) localStorage.setItem('adminGallery', data.adminGallery);
        if (data.bookingInquiries) localStorage.setItem('bookingInquiries', data.bookingInquiries);

        alert('✅ Data imported successfully! Refresh the page to see changes.');
        window.location.reload();
      } catch (error) {
        console.error('Import error:', error);
        alert('❌ Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'packages', label: 'Packages', icon: <Package className="w-5 h-5" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'inquiries', label: 'Inquiries', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pawan Hans" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-xs text-slate-500">
                Welcome back, {user?.name || 'Admin'} • {user?.role || 'Administrator'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Data Management Buttons */}
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold transition text-sm"
              title="Export all admin data"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>

            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-[24px] shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 flex gap-4 p-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'packages' && <AdminPackages />}
            {activeTab === 'gallery' && <AdminGallery />}
            {activeTab === 'inquiries' && <AdminInquiries />}
          </div>
        </div>
      </div>
    </div>
  );
}
