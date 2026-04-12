import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const ADMIN_EMAIL = 'admin@pawanhans.com';
const ADMIN_PASSWORD = 'admin123';
const AUTH_TOKEN_KEY = 'authToken';
const ADMIN_USER_KEY = 'adminUser';

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(ADMIN_USER_KEY);
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AdminUser;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: AdminUser = {
          id: 'admin',
          name: 'Administrator',
          email: ADMIN_EMAIL,
          role: 'Administrator',
        };

        localStorage.setItem(AUTH_TOKEN_KEY, `static-token-${Date.now()}`);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
        setUser(adminUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      loading,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
