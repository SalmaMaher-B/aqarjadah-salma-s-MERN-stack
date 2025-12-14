// src/pages/PropertyDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaDollarSign,
  FaImage, FaTimes, FaEdit, FaTrash, FaSave, FaSignOutAlt, FaArrowLeft
} from 'react-icons/fa';

const API_BASE = 'https://backend-mern-stack-aqarjadah.vercel.app';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [propertyData, setPropertyData] = useState({
    id: '',
    title: '',
    type: '',
    category: '',
    price: '',
    priceFrom: '',
    priceTo: '',
    location: '',
    area: '',
    rooms: '',
    bathrooms: '',
    description: '',
    phone: '',
    whatsapp: '',
    images: []
  });

  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const isWanted = propertyData.type === 'wanted';

  const colors = {
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#60a5fa",
    dark: "#0f172a",
    text: "#e2e8f0"
  };

  const glassCardStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.4)"
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    setIsAdmin(!!token);
    fetchPropertyData();
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [id]);

  const fetchPropertyData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ads/${id}`);
      const data = await res.json();
      const ad = data.ad || data;

      const processedImages = Array.isArray(ad.images)
        ? ad.images.map(img =>
            typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:'))
              ? img
              : `${API_BASE}/uploads/${img}`
          )
        : [];

      setPropertyData({
        id: ad._id || id,
        title: ad.title || '',
        type: ad.type || '',
        category: ad.category || '',
        price: ad.price ? String(ad.price) : '',
        priceFrom: ad.priceFrom ? String(ad.priceFrom) : '',
        priceTo: ad.priceTo ? String(ad.priceTo) : '',
        location: ad.location || '',
        area: ad.area ? String(ad.area) : '',
        rooms: ad.rooms ? String(ad.rooms) : '',
        bathrooms: ad.bathrooms ? String(ad.bathrooms) : '',
        description: ad.description || '',
        phone: ad.phone || '',
        whatsapp: ad.whatsapp || '',
        images: processedImages
      });
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب البيانات' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  /* =========================
      FIXED FORM INPUT
     ========================= */
  const FormInput = React.memo(({ name, value, icon, label, unit, readOnly, onChange }) => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${readOnly ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.5)'}`,
      borderRadius: 16,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }}>
      {icon}
      <div style={{ flexGrow: 1 }}>
        {label && <label style={{ fontSize: 14, color: '#94a3b8', marginBottom: 4, display: 'block' }}>{label}</label>}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          style={{
            background: 'transparent',
            border: 'none',
            color: colors.text,
            width: '100%',
            fontSize: 18,
            fontWeight: 600,
            outline: 'none'
          }}
        />
      </div>
      {unit && <span style={{ color: '#94a3b8' }}>{unit}</span>}
    </div>
  ));

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ background: colors.dark, minHeight: '100vh', padding: 20, direction: 'rtl', color: colors.text }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <FormInput
          name="title"
          value={propertyData.title}
          onChange={handleInputChange}
          readOnly={!isEditMode}
          label="العنوان"
        />

      </div>
    </div>
  );
};

export default PropertyDetailsPage;
