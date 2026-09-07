import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inquiryService, propertyService } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import {
  User,
  Mail,
  Shield,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
} from 'lucide-react';

const Profile = () => {
  const { user, savedPropertyIds } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserData = async () => {
      setLoading(true);
      try {
        // Fetch user's submitted inquiries
        const inqList = await inquiryService.getMyInquiries(user.email);
        setInquiries(inqList);

        // Fetch saved properties
        if (savedPropertyIds.length > 0) {
          const allProps = await propertyService.getAll();
          const filteredSaved = allProps.filter((p) =>
            savedPropertyIds.includes(p._id || p.id)
          );
          setSavedProperties(filteredSaved);
        } else {
          setSavedProperties([]);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, savedPropertyIds, navigate]);

  if (!user) return null;

  const getStatusBadge = (status) => {
    if (status === 'Contacted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          <Clock className="w-3.5 h-3.5" /> Agent Contacted
        </span>
      );
    }
    if (status === 'Closed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" /> Tour Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
        <AlertCircle className="w-3.5 h-3.5" /> Inquiry Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-indigo-100">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user.role}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xl font-black text-indigo-600">{inquiries.length}</p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Inquiries</p>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xl font-black text-rose-600">{savedPropertyIds.length}</p>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Favorites</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'inquiries'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" /> Tour Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'favorites'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" /> Saved Properties ({savedProperties.length})
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading your profile data...</div>
        ) : activeTab === 'inquiries' ? (
          <div className="space-y-4">
            {inquiries.length > 0 ? (
              inquiries.map((inq) => {
                const prop = inq.property || {};
                const propId = prop._id || prop.id;
                return (
                  <div
                    key={inq._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(inq.status)}
                        <span className="text-xs text-slate-400">
                          Requested for: <span className="font-semibold text-slate-700">{inq.visitDate}</span>
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">
                        {prop.title || 'Inquiry for Property'}
                      </h3>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                        "{inq.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {propId && (
                        <Link
                          to={`/properties/${propId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition"
                        >
                          View Property <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Tour Inquiries Yet</h3>
                <p className="text-xs text-slate-500">
                  When you schedule tours or submit inquiries on property pages, they will be tracked here.
                </p>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Explore Properties
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((p) => (
                  <PropertyCard key={p._id || p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Saved Properties</h3>
                <p className="text-xs text-slate-500">
                  Click the heart icon on any property card to bookmark your favorite residences.
                </p>
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Browse Homes
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
