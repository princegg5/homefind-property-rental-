import axios from 'axios';
import { initialSampleProperties } from '../data/sampleProperties';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get local mock storage
const getLocalProperties = () => {
  try {
    const data = localStorage.getItem('homefind_local_properties');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('homefind_local_properties', JSON.stringify(initialSampleProperties));
  return initialSampleProperties;
};

const saveLocalProperties = (properties) => {
  localStorage.setItem('homefind_local_properties', JSON.stringify(properties));
};

const getLocalInquiries = () => {
  try {
    const data = localStorage.getItem('homefind_local_inquiries');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  const defaultInquiries = [
    {
      _id: 'inq-101',
      property: initialSampleProperties[0],
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      visitDate: '2025-05-15',
      message: 'Interested in booking a weekend site inspection for the 3BHK sea-facing apartment.',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'inq-102',
      property: initialSampleProperties[1],
      name: 'Ananya Verma',
      email: 'ananya@example.com',
      phone: '+91 98234 56789',
      visitDate: '2025-05-18',
      message: 'Would like to know the maintenance charges and lease terms.',
      status: 'Contacted',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem('homefind_local_inquiries', JSON.stringify(defaultInquiries));
  return defaultInquiries;
};

const saveLocalInquiries = (inquiries) => {
  localStorage.setItem('homefind_local_inquiries', JSON.stringify(inquiries));
};

// API Services
export const propertyService = {
  // Fetch properties with filters
  getAll: async (params = {}) => {
    try {
      const res = await axios.get(`${API_BASE}/properties`, { params, timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.properties;
      }
    } catch (e) {
      console.warn('Backend not detected, running with local data store');
    }

    // Local filter fallback
    let list = getLocalProperties();

    if (params.purpose && params.purpose !== 'All') {
      list = list.filter((p) => p.purpose === params.purpose);
    }
    if (params.city && params.city !== 'All') {
      list = list.filter((p) =>
        p.location?.city?.toLowerCase().includes(params.city.toLowerCase())
      );
    }
    if (params.propertyType && params.propertyType !== 'All') {
      list = list.filter((p) => p.propertyType === params.propertyType);
    }
    if (params.minPrice) {
      list = list.filter((p) => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      list = list.filter((p) => p.price <= Number(params.maxPrice));
    }
    if (params.bedrooms && params.bedrooms !== 'All') {
      list = list.filter((p) => p.bedrooms >= Number(params.bedrooms));
    }
    if (params.bathrooms && params.bathrooms !== 'All') {
      list = list.filter((p) => p.bathrooms >= Number(params.bathrooms));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location?.city?.toLowerCase().includes(q) ||
          p.location?.address?.toLowerCase().includes(q)
      );
    }
    if (params.sort === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  },

  // Fetch featured properties
  getFeatured: async () => {
    try {
      const res = await axios.get(`${API_BASE}/properties/featured`, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.properties;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalProperties();
    return all.filter((p) => p.isFeatured).slice(0, 6);
  },

  // Get single property by ID
  getById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/properties/${id}`, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.property;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalProperties();
    return all.find((p) => (p._id || p.id) === id) || null;
  },

  // Create property (Admin)
  create: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/properties`, data, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.property;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalProperties();
    const newProp = {
      ...data,
      _id: 'prop-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    all.unshift(newProp);
    saveLocalProperties(all);
    return newProp;
  },

  // Update property (Admin)
  update: async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/properties/${id}`, data, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.property;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalProperties();
    const index = all.findIndex((p) => (p._id || p.id) === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...data };
      saveLocalProperties(all);
      return all[index];
    }
    throw new Error('Property not found');
  },

  // Delete property (Admin)
  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE}/properties/${id}`, { timeout: 3000 });
      return true;
    } catch (e) {
      // Local fallback
    }
    let all = getLocalProperties();
    all = all.filter((p) => (p._id || p.id) !== id);
    saveLocalProperties(all);
    return true;
  },

  // Get Admin stats
  getStats: async () => {
    try {
      const res = await axios.get(`${API_BASE}/properties/admin/stats`, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.stats;
      }
    } catch (e) {
      // Local fallback
    }
    const properties = getLocalProperties();
    const inquiries = getLocalInquiries();
    const activeRentals = properties.filter((p) => p.purpose === 'Rent').length;
    const totalSalesValue = properties
      .filter((p) => p.purpose === 'Buy')
      .reduce((sum, p) => sum + Number(p.price || 0), 0);

    return {
      totalProperties: properties.length,
      totalInquiries: inquiries.length,
      activeRentals,
      totalSalesValue,
    };
  },
};

export const inquiryService = {
  // Create tour inquiry
  create: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/inquiries`, data, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.inquiry;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalInquiries();
    const properties = getLocalProperties();
    const targetProp = properties.find((p) => (p._id || p.id) === data.propertyId);

    const newInquiry = {
      _id: 'inq-' + Date.now(),
      property: targetProp || { title: 'Selected Property', _id: data.propertyId },
      name: data.name,
      email: data.email,
      phone: data.phone,
      visitDate: data.visitDate,
      message: data.message,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    all.unshift(newInquiry);
    saveLocalInquiries(all);
    return newInquiry;
  },

  // Get inquiries for logged-in user
  getMyInquiries: async (userEmail) => {
    try {
      const res = await axios.get(`${API_BASE}/inquiries/my`, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.inquiries;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalInquiries();
    if (!userEmail) return all;
    return all.filter((inq) => inq.email?.toLowerCase() === userEmail.toLowerCase());
  },

  // Get all inquiries (Admin)
  getAll: async () => {
    try {
      const res = await axios.get(`${API_BASE}/inquiries`, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.inquiries;
      }
    } catch (e) {
      // Local fallback
    }
    return getLocalInquiries();
  },

  // Update status (Admin)
  updateStatus: async (id, status) => {
    try {
      const res = await axios.put(`${API_BASE}/inquiries/${id}/status`, { status }, { timeout: 3000 });
      if (res.data && res.data.success) {
        return res.data.inquiry;
      }
    } catch (e) {
      // Local fallback
    }
    const all = getLocalInquiries();
    const index = all.findIndex((inq) => inq._id === id);
    if (index !== -1) {
      all[index].status = status;
      saveLocalInquiries(all);
      return all[index];
    }
    throw new Error('Inquiry not found');
  },

  // Delete inquiry (Admin)
  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE}/inquiries/${id}`, { timeout: 3000 });
      return true;
    } catch (e) {
      // Local fallback
    }
    let all = getLocalInquiries();
    all = all.filter((inq) => inq._id !== id);
    saveLocalInquiries(all);
    return true;
  },
};
