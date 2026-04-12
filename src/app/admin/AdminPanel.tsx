import { useAdmin } from './AdminContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function AdminPanel() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  return <AdminDashboard />;
}
