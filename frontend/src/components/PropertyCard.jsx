import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper to format currency in Indian numbering system
export const formatPrice = (price, purpose) => {
  if (typeof price !== 'number') price = Number(price) || 0;

  if (purpose === 'Rent') {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L/mo`;
    }
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }

  // Buy
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakh`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

const PropertyCard = ({ property }) => {
  const { savedPropertyIds, toggleSaveProperty } = useAuth();

  if (!property) return null;

  const id = property._id || property.id;
  const isSaved = savedPropertyIds.includes(id);

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProperty(id);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide uppercase shadow-sm ${
              property.purpose === 'Buy' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}
          >
            {property.purpose === 'Buy' ? 'FOR SALE' : 'FOR RENT'}
          </span>
          {property.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm">
              <Sparkles className="w-3 h-3 fill-current" /> FEATURED
            </span>
          )}
        </div>

        {/* Save/Favorite Heart Button */}
        <button
          onClick={handleHeartClick}
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition-transform active:scale-90 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Price Floating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-xs font-bold text-slate-900 shadow-sm">
          {formatPrice(property.price, property.purpose)}
        </div>
      </div>

      {/* Body content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <Link to={`/properties/${id}`} className="block">
          <h3 className="font-bold text-slate-800 text-base truncate hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <p className="text-xs text-slate-500 mb-3 truncate">
          {property.location?.address
            ? `${property.location.address}, ${property.location.city}`
            : property.location?.city || 'Prime Location'}
        </p>

        {/* Key Specs Row */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-slate-600 text-[11px] font-semibold">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 opacity-60" />
            <span>{property.bedrooms > 0 ? `${property.bedrooms} Bed` : 'Studio'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 opacity-60" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 opacity-60" />
            <span>{property.areaSqFt ? `${property.areaSqFt} sqft` : 'Spacious'}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            {property.propertyType}
          </span>
          <Link
            to={`/properties/${id}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
