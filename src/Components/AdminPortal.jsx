import React from 'react';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate,} from 'react-router-dom';

const AdminPortal = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if we're at the root admin route
    if (window.location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Portal</h2>
          <nav className="mt-8">
            <ul>
              <li className="mb-4">
                <NavLink to="/admin/dashboard" className={({ isActive }) => 
                  isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
                }>
                  Dashboard
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink to="/admin/users" className={({ isActive }) => 
                  isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
                }>
                  Manage Users
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink to="/admin/vacancies" className={({ isActive }) => 
                  isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
                }>
                  Manage Vacancies
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink to="/admin/reports" className={({ isActive }) => 
                  isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
                }>
                  Reports
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink to="/admin/settings" className={({ isActive }) => 
                  isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
                }>
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPortal;