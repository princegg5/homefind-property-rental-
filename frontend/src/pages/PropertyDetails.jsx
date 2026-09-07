import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService, inquiryService } from '../services/api';
import { formatPrice } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  User,
  Shield,
  Send,
  ArrowLeft,
  Sparkles,
  Building2,
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, savedPropertyIds, toggleSaveProperty } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    visitDate: '',
    message: 'Hello, I am interested in this property and would like to schedule a site tour.',
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    if (user) {
      setInquiryForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await propertyService.getById(id);
        setProperty(data);
      } catch (err) {
        console.error('Fetch property details error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const isSaved = property ? savedPropertyIds.includes(property._id || property.id) : false;

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquiryError('');

    try {
      await inquiryService.create({
        propertyId: property._id || property.id,
        ...inquiryForm,
      });
      setInquirySuccess(true);
    } catch (err) {
      setInquiryError(err.message || 'Failed to submit inquiry');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
          <h2 className="text-xl font-black text-slate-900">Property Not Found</h2>
          <p className="text-xs text-slate-500">The property you are looking for might have been sold or removed.</p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  const amenitiesList = [
    'Parking',
    'Gym',
    'Swimming Pool',
    'Security',
    'Elevator',
    'Balcony',
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Listings
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  property.purpose === 'Buy'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {property.purpose === 'Buy' ? 'For Sale' : 'For Rent'}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200 text-slate-800">
                {property.propertyType}
              </span>
              {property.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Featured Listing
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              {property.title}
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1.5">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              {property.location?.address}, {property.location?.city}, {property.location?.state} -{' '}
              {property.location?.pincode}
            </p>
          </div>

          {/* Right Header Price & Favorite */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {property.purpose === 'Rent' ? 'Monthly Lease' : 'Guaranteed Price'}
              </p>
              <p className="text-2xl sm:text-4xl font-extrabold text-indigo-600">
                {formatPrice(property.price, property.purpose)}
              </p>
            </div>
            <button
              onClick={() => toggleSaveProperty(property._id || property.id)}
              className={`p-3.5 rounded-2xl border transition shadow-sm ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
              }`}
              title={isSaved ? 'Saved to favorites' : 'Save property'}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-md">
              Photo {activeImageIndex + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Main Content (Details & Inquiry Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Specs, Description, Amenities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Specs Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Key Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Bedrooms</p>
                    <p className="text-base font-bold text-slate-800">
                      {property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Bathrooms</p>
                    <p className="text-base font-bold text-slate-800">{property.bathrooms} Baths</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Carpet Area</p>
                    <p className="text-base font-bold text-slate-800">{property.areaSqFt} sqft</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Property Type</p>
                    <p className="text-base font-bold text-slate-800">{property.propertyType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">About This Residence</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenity Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Featured Amenities & Facilities</h3>
              <p className="text-xs text-slate-500">
                Verified high-tier amenities provided in this premises
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {amenitiesList.map((amenity) => {
                  const hasAmenity = property.amenities && property.amenities.includes(amenity);
                  return (
                    <div
                      key={amenity}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold ${
                        hasAmenity
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 shrink-0 ${
                          hasAmenity ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Owner / Agent Card */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  {property.owner?.name ? property.owner.name.charAt(0) : 'H'}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    Verified Listing Partner
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {property.owner?.name || 'HomeFind Prime Realty'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {property.owner?.email || 'sales@homefind.in'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition"
                >
                  <Phone className="w-4 h-4" /> Call Agent
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Tour / Inquiry Request Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-lg space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  Direct Inquiries
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Request a Tour or Info
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Schedule a private visit or ask questions directly with the owner.
                </p>
              </div>

              {inquirySuccess ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900">Inquiry Received!</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Thank you, {inquiryForm.name}. Our representative has received your tour request for{' '}
                    <span className="font-bold">{inquiryForm.visitDate}</span> and will contact you at{' '}
                    <span className="font-bold">{inquiryForm.phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setInquirySuccess(false);
                      setInquiryForm({
                        ...inquiryForm,
                        visitDate: '',
                        message: 'Hello, I am interested in scheduling another visit.',
                      });
                    }}
                    className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {inquiryError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                      {inquiryError}
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-indigo-500" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Requested Tour Date
                    </label>
                    <input
                      type="date"
                      required
                      value={inquiryForm.visitDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, visitDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Message / Request Details</label>
                    <textarea
                      rows={3}
                      required
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    {submittingInquiry ? (
                      'Submitting Request...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Request Site Tour
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    Your contact information is protected under HomeFind privacy policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
