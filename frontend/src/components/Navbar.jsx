import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Heart,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, savedPropertyIds } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              Home<span className="text-indigo-600">Find</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`transition-colors hover:text-indigo-600 ${
                isActive('/') ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={`transition-colors hover:text-indigo-600 ${
                isActive('/properties') ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Explore
            </Link>
            <Link
              to="/properties?purpose=Buy"
              className="transition-colors hover:text-indigo-600"
            >
              Buy
            </Link>
            <Link
              to="/properties?purpose=Rent"
              className="transition-colors hover:text-indigo-600"
            >
              Rent
            </Link>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Saved favorites badge */}
                <Link
                  to="/profile"
                  className="relative p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-50 transition"
                  title="Saved Favorites"
                >
                  <Heart className="w-5 h-5" />
                  {savedPropertyIds.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {savedPropertyIds.length}
                    </span>
                  )}
                </Link>

                {/* Admin Dashboard button */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Admin
                  </Link>
                )}

                {/* Profile menu */}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[100px]">
                      {user.name}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold shadow-sm transition active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            All Properties
          </Link>
          <Link
            to="/properties?purpose=Buy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Buy Properties
          </Link>
          <Link
            to="/properties?purpose=Rent"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Rental Properties
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                <User className="w-5 h-5 text-indigo-600" />
                Profile & Saved ({savedPropertyIds.length})
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-amber-700 bg-amber-50 rounded-lg"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                Sign Out ({user.name})
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-4 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
