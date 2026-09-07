import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, IndianRupee } from 'lucide-react';

const SearchBar = ({ initialPurpose = 'Buy', onSearch = null }) => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState(initialPurpose);
  const [city, setCity] = useState('All');
  const [propertyType, setPropertyType] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();

    let minPrice = '';
    let maxPrice = '';

    if (purpose === 'Buy') {
      if (priceRange === 'under50L') maxPrice = 5000000;
      if (priceRange === '50L-1Cr') { minPrice = 5000000; maxPrice = 10000000; }
      if (priceRange === '1Cr-3Cr') { minPrice = 10000000; maxPrice = 30000000; }
      if (priceRange === 'above3Cr') minPrice = 30000000;
    } else {
      // Rent
      if (priceRange === 'under25k') maxPrice = 25000;
      if (priceRange === '25k-50k') { minPrice = 25000; maxPrice = 50000; }
      if (priceRange === '50k-1L') { minPrice = 50000; maxPrice = 100000; }
      if (priceRange === 'above1L') minPrice = 100000;
    }

    const params = new URLSearchParams();
    if (purpose && purpose !== 'All') params.set('purpose', purpose);
    if (city && city !== 'All') params.set('city', city);
    if (propertyType && propertyType !== 'All') params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    if (onSearch) {
      onSearch({
        purpose,
        city: city === 'All' ? '' : city,
        propertyType: propertyType === 'All' ? '' : propertyType,
        minPrice,
        maxPrice,
      });
    } else {
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100">
      {/* Purpose Tabs (Buy / Rent) */}
      <div className="flex items-center gap-2 mb-3 px-2">
        <button
          type="button"
          onClick={() => setPurpose('Buy')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition ${
            purpose === 'Buy'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setPurpose('Rent')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition ${
            purpose === 'Rent'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Rent
        </button>
      </div>

      {/* Filter inputs grid */}
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
        {/* City Filter */}
        <div className="flex-1 lg:border-r border-slate-100 px-3 py-1.5 text-left">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            Location
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent font-medium text-sm text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Cities (India)</option>
            <option value="Mumbai">Mumbai, Maharashtra</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Bangalore">Bangalore, Karnataka</option>
            <option value="Pune">Pune, Maharashtra</option>
            <option value="Hyderabad">Hyderabad, Telangana</option>
          </select>
        </div>

        {/* Property Type Filter */}
        <div className="flex-1 lg:border-r border-slate-100 px-3 py-1.5 text-left">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full bg-transparent font-medium text-sm text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Property Types</option>
            <option value="Apartment">Apartment / Flat</option>
            <option value="House">Independent House</option>
            <option value="Villa">Luxury Villa</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex-1 lg:border-r border-slate-100 px-3 py-1.5 text-left">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            Price Range
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full bg-transparent font-medium text-sm text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="All">Any Budget</option>
            {purpose === 'Buy' ? (
              <>
                <option value="under50L">Under ₹50L</option>
                <option value="50L-1Cr">₹50L - ₹1Cr</option>
                <option value="1Cr-3Cr">₹1Cr - ₹3Cr</option>
                <option value="above3Cr">₹3Cr+</option>
              </>
            ) : (
              <>
                <option value="under25k">Under ₹25,000/mo</option>
                <option value="25k-50k">₹25,000 - ₹50,000/mo</option>
                <option value="50k-1L">₹50,000 - ₹1L/mo</option>
                <option value="above1L">₹1L+/mo</option>
              </>
            )}
          </select>
        </div>

        {/* Search Action Button */}
        <div className="lg:pl-3 flex items-center justify-center">
          <button
            type="submit"
            aria-label="Search properties"
            className="w-full lg:w-14 h-12 lg:h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 transition-colors active:scale-95 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span className="lg:hidden ml-2 text-sm font-semibold">Search Properties</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
