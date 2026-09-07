import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { propertyService, inquiryService } from '../services/api';
import { formatPrice } from '../components/PropertyCard';
import {
  Building2,
  Inbox,
  Key,
  IndianRupee,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('properties');
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalInquiries: 0,
    activeRentals: 0,
    totalSalesValue: 0,
  });
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Property Modal (Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: 'Buy',
    propertyType: 'Apartment',
    price: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    images: '',
    amenities: ['Parking', 'Security'],
    isFeatured: false,
  });

  const availableAmenities = ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Balcony'];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadDashboard();
  }, [user, navigate]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, propsData, inqsData] = await Promise.all([
        propertyService.getStats(),
        propertyService.getAll(),
        inquiryService.getAll(),
      ]);
      setStats(statsData);
      setProperties(propsData);
      setInquiries(inqsData);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      description: '',
      purpose: 'Buy',
      propertyType: 'Apartment',
      price: '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1200,
      images: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      amenities: ['Parking', 'Security', 'Elevator'],
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      purpose: property.purpose || 'Buy',
      propertyType: property.propertyType || 'Apartment',
      price: property.price || '',
      address: property.location?.address || '',
      city: property.location?.city || 'Mumbai',
      state: property.location?.state || 'Maharashtra',
      pincode: property.location?.pincode || '',
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      areaSqFt: property.areaSqFt || 1000,
      images: property.images ? property.images.join(', ') : '',
      amenities: property.amenities || [],
      isFeatured: !!property.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        purpose: formData.purpose,
        propertyType: formData.propertyType,
        price: Number(formData.price),
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        amenities: formData.amenities,
        isFeatured: formData.isFeatured,
      };

      if (editingProperty) {
        await propertyService.update(editingProperty._id || editingProperty.id, payload);
      } else {
        await propertyService.create(payload);
      }

      setModalOpen(false);
      loadDashboard();
    } catch (err) {
      alert('Failed to save property: ' + err.message);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this property listing?')) {
      try {
        await propertyService.delete(id);
        loadDashboard();
      } catch (err) {
        alert('Failed to delete property: ' + err.message);
      }
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await inquiryService.updateStatus(inquiryId, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Delete this inquiry?')) {
      try {
        await inquiryService.delete(inquiryId);
        setInquiries((prev) => prev.filter((inq) => inq._id !== inquiryId));
      } catch (err) {
        alert('Failed to delete inquiry');
      }
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      if (exists) {
        return { ...prev, amenities: prev.amenities.filter((a) => a !== amenity) };
      }
      return { ...prev, amenities: [...prev.amenities, amenity] };
    });
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Admin & Owner Control Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Platform Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage inventory, monitor buyer inquiries, and update lead pipeline.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Property
          </button>
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Properties
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalProperties}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Live in Database</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Inquiries
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalInquiries}</p>
              <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Customer Leads</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Rentals
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.activeRentals}</p>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Lease Units</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Sales Value
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatPrice(stats.totalSalesValue, 'Buy')}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Market Volume</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'properties'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Properties Catalog ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'inquiries'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="w-4 h-4" /> Incoming Inquiries ({inquiries.length})
          </button>
        </div>

        {/* Tab 1: Properties Table */}
        {activeTab === 'properties' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Property</th>
                    <th className="px-4 py-3.5">Type & Purpose</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Specs</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {properties.map((p) => {
                    const id = p._id || p.id;
                    const img = p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80';
                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-slate-900 truncate">{p.title}</p>
                            {p.isFeatured && (
                              <span className="text-[10px] text-amber-600 font-bold uppercase">
                                ★ Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mr-1.5 ${
                              p.purpose === 'Buy'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {p.purpose}
                          </span>
                          <span className="text-slate-500">{p.propertyType}</span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          {formatPrice(p.price, p.purpose)}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">
                          {p.bedrooms}BHK • {p.bathrooms}B • {p.areaSqFt} sqft
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 truncate max-w-[150px]">
                          {p.location?.city || 'India'}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Tab 2: Inquiries Table */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Property</th>
                    <th className="px-4 py-3.5">Client Details</th>
                    <th className="px-4 py-3.5">Tour Date</th>
                    <th className="px-4 py-3.5">Client Note</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {inquiries.map((inq) => {
                    const prop = inq.property || {};
                    return (
                      <tr key={inq._id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                          {prop.title || 'Selected Property'}
                        </td>
                        <td className="px-4 py-3.5 space-y-0.5">
                          <p className="font-bold text-slate-900">{inq.name}</p>
                          <p className="text-[11px] text-slate-500">{inq.email}</p>
                          <p className="text-[11px] text-indigo-600 font-semibold">{inq.phone}</p>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">
                          {inq.visitDate}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate text-[11px]">
                          "{inq.message}"
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              inq.status === 'Contacted'
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : inq.status === 'Closed'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add or Edit Property */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-900">
                  {editingProperty ? 'Edit Property Listing' : 'Create New Property Listing'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProperty} className="mt-4 space-y-4 text-xs">
                {/* Title */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Highrise 3BHK Apartment"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Purpose, Type, Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Purpose</label>
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    >
                      <option value="Buy">Buy (For Sale)</option>
                      <option value="Rent">Rent (Monthly Lease)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4500000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                {/* Specs: Bedrooms, Bathrooms, SqFt */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Carpet SqFt</label>
                    <input
                      type="number"
                      required
                      value={formData.areaSqFt}
                      onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                {/* Location: Address, City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address or landmark"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Pune">Pune</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                {/* Images (Comma separated URLs) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Image URLs (comma-separated URLs)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://...jpg, https://...jpg"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  ></textarea>
                </div>

                {/* Amenities checklist */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableAmenities.map((amenity) => (
                      <label
                        key={amenity}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                          formData.amenities.includes(amenity)
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="rounded text-indigo-600"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <label htmlFor="isFeatured" className="font-bold text-slate-700 cursor-pointer">
                    Show in Featured Listings on Home Page
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-100"
                  >
                    {editingProperty ? 'Update Listing' : 'Create Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
