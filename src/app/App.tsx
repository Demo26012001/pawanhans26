import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import Home from './Home';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Blogs from './pages/Blogs';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import AdminPanel from './admin/AdminPanel';
import { AdminProvider } from './admin/AdminContext';

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:id" element={<PackageDetail />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="cookies" element={<CookiesPolicy />} />
          </Route>
        </Routes>
      </Router>
    </AdminProvider>
  );
}
