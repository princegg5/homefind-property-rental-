import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../services/api';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Building,
  MapPin,
  IndianRupee,
  Layers,
  Sparkles,
} from 'lucide-react';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'All');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL query params with state
  useEffect(() => {
    if (searchParams.get('purpose')) setPurpose(searchParams.get('purpose'));
    if (searchParams.get('city')) setCity(searchParams.get('city'));
    if (searchParams.get('propertyType')) setPropertyType(searchParams.get('propertyType'));
    if (searchParams.get('minPrice')) setMinPrice(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) setMaxPrice(searchParams.get('maxPrice'));
  }, [searchParams]);

  // Fetch properties when filters change
  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const data = await propertyService.getAll({
        purpose,
        city,
        propertyType,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        search,
        sort,
      });
      setProperties(data);
    } catch (err) {
      console.error('Fetch properties error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProperties();
  }, [purpose, city, propertyType, minPrice, maxPrice, bedrooms, bathrooms, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProperties();
  };

  const handleResetFilters = () => {
    setPurpose('All');
    setCity('All');
    setPropertyType('All');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('All');
    setBathrooms('All');
    setSearch('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Verified Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Browse Property Listings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {properties.length} verified homes and commercial properties across India
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main 2-column Grid (Filter Sidebar + Property Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filter Sidebar */}
          <aside
            className={`lg:block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6 ${
              mobileFilterOpen ? 'block mb-6' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filter Criteria
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Address, builder, locality..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </form>

            {/* Purpose (Buy / Rent) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Listing Type
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {['All', 'Buy', 'Rent'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurpose(p)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      purpose === p
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-500" /> Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Types</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-indigo-500" /> Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min (₹)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max (₹)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Bedrooms (Min)</label>
              <div className="grid grid-cols-5 gap-1 text-center">
                {['All', '1', '2', '3', '4+'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBedrooms(b === '4+' ? '4' : b)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      (bedrooms === b || (b === '4+' && bedrooms === '4'))
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Bathrooms (Min)</label>
              <div className="grid grid-cols-4 gap-1 text-center">
                {['All', '1', '2', '3+'].map((bath) => (
                  <button
                    key={bath}
                    type="button"
                    onClick={() => setBathrooms(bath === '3+' ? '3' : bath)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      (bathrooms === bath || (bath === '3+' && bathrooms === '3'))
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {bath}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={fetchFilteredProperties}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition active:scale-95"
            >
              Apply All Filters
            </button>
          </aside>

          {/* Property Cards Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-3"
                  >
                    <div className="aspect-[16/10] bg-slate-200 rounded-xl"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id || property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Building className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No properties match your filters</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try clearing some criteria or expanding your price and bedroom thresholds.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Properties;
