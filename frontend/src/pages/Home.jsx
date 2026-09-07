import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../services/api';
import {
  Building2,
  Home as HomeIcon,
  Castle,
  Briefcase,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const data = await propertyService.getFeatured();
        setFeaturedProperties(data);
      } catch (err) {
        console.error('Error loading featured:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    {
      name: 'Luxury Apartments',
      type: 'Apartment',
      count: '420+ Listings',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      icon: Building2,
    },
    {
      name: 'Gated Villas',
      type: 'Villa',
      count: '180+ Listings',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
      icon: Castle,
    },
    {
      name: 'Independent Houses',
      type: 'House',
      count: '290+ Listings',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
      icon: HomeIcon,
    },
    {
      name: 'Commercial Spaces',
      type: 'Commercial',
      count: '115+ Listings',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section - Sleek Interface Theme */}
      <header className="relative bg-indigo-900 py-16 sm:py-24 px-6 sm:px-12 flex flex-col justify-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
              <TrendingUp className="w-3.5 h-3.5" /> India's Premier Real Estate Network
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
              Find Your Perfect <br className="hidden sm:inline" />Next Home.
            </h1>
            <p className="text-indigo-100 text-base sm:text-lg max-w-md font-normal leading-relaxed">
              Explore over 10,000+ premium properties across Mumbai, Bangalore, and Delhi.
            </p>
          </div>
        </div>

        {/* Geometric Architectural Backdrop Pattern from design */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none hidden md:block">
          <div className="grid grid-cols-4 gap-3 transform -rotate-12 translate-x-16">
            <div className="h-44 bg-white rounded-xl"></div>
            <div className="h-44 bg-white rounded-xl translate-y-8"></div>
            <div className="h-44 bg-white rounded-xl"></div>
            <div className="h-44 bg-white rounded-xl translate-y-8"></div>
          </div>
        </div>
      </header>

      {/* Floating Sleek Search Bar */}
      <div className="relative z-20 -mt-10 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <SearchBar />
      </div>

      {/* Featured Listings Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-14 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Featured Listings</h2>
            <p className="text-slate-500 text-sm font-medium">
              Handpicked properties based on high demand and value
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/properties"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              Explore all properties <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3"
              >
                <div className="h-44 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id || property.id} property={property} />
            ))}
          </div>
        )}
      </main>

      {/* Property Categories / Types */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Diverse Portfolios
              </span>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                Explore by Property Type
              </h2>
            </div>
            <Link
              to="/properties"
              className="mt-2 sm:mt-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Browse categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.type}
                  to={`/properties?propertyType=${cat.type}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="h-36 w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 opacity-85 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-white font-bold text-sm">{cat.name}</span>
                    </div>
                  </div>
                  <div className="p-3.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{cat.count}</span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose HomeFind Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              The HomeFind Advantage
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">
              Why 50,000+ Indians Trust HomeFind
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              We eliminate traditional brokerage friction with transparent listings and verified paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">100% Verified Titles</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Every property listing undergoes municipal and legal title verification.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Zero Hidden Brokerage</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Direct connections with property owners. Clear, upfront prices with no surprise fees.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Instant Tour Inquiries</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Schedule weekend walkthroughs or virtual tours directly with authorized hosts.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">End-to-End Assistance</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                From agreement drafting to connecting with home loan advisors at major banks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action Banner */}
      <section className="py-14 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="text-2xl font-extrabold text-white">
                Are You a Property Owner or Builder?
              </h3>
              <p className="text-xs text-indigo-100 max-w-xl">
                List your residential apartment, villa, or commercial office to reach thousands of pre-qualified buyers and verified tenants.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full bg-white text-indigo-700 font-semibold text-xs shadow-sm hover:bg-indigo-50 transition"
              >
                Register as Owner
              </Link>
              <Link
                to="/properties"
                className="px-5 py-2.5 rounded-full bg-indigo-800 hover:bg-indigo-700 text-white font-semibold text-xs border border-indigo-500/40 transition"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
