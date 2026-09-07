import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      {/* Sleek Top Metrics Bar from design */}
      <div className="border-b border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white">
              <div className="w-2.5 h-2.5 border-2 border-white rotate-45"></div>
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">
              Home<span className="text-indigo-600">Find</span> Real Estate Network
            </span>
          </div>

          <div className="flex gap-6 items-center">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Properties</span>
              <span className="text-sm font-bold text-slate-800">12,482+</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cities Covered</span>
              <span className="text-sm font-bold text-slate-800">24+</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Listings</span>
              <span className="text-sm font-bold text-emerald-600">98.4%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                Home<span className="text-indigo-600">Find</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              India's modern real estate platform. Discover verified premium apartments, luxury villas, and studio rentals with seamless online inquiries and instant scheduling.
            </p>
            <div className="pt-1 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>BKC Corporate Park, Bandra Kurla Complex, Mumbai 400051</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>+91 (022) 8900-4500 / toll-free 1800-HOMEFIND</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>contact@homefind.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/properties" className="hover:text-indigo-600 transition">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=Buy" className="hover:text-indigo-600 transition">
                  Buy Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?purpose=Rent" className="hover:text-indigo-600 transition">
                  Rent Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-indigo-600 transition">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Commercial" className="hover:text-indigo-600 transition">
                  Commercial Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Major Cities */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Top Cities
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-indigo-600 transition">
                  Mumbai, Maharashtra
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bangalore" className="hover:text-indigo-600 transition">
                  Bangalore, Karnataka
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi" className="hover:text-indigo-600 transition">
                  Delhi NCR
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Pune" className="hover:text-indigo-600 transition">
                  Pune, Maharashtra
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad" className="hover:text-indigo-600 transition">
                  Hyderabad, Telangana
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Get weekly curated property drops and market price reports.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to HomeFind updates!'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} HomeFind Real Estate Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">RERA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
