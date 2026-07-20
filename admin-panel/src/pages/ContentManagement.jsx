import { useState, useEffect } from 'react';
import { Save, Globe, Phone, MapPin, Link2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import API from '../api/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers & Subcomponents
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  company_name: '',
  about_description: '',
  phone: '',
  email: '',
  address: '',
  hero_title: '',
  hero_subtitle: '',
  footer_text: '',
  facebook_link: '',
  instagram_link: '',
  linkedin_link: '',
  youtube_link: '',
  whatsapp_number: '',
  google_map_embed: '',
};

const toForm = (data) => {
  const out = { ...EMPTY_FORM };
  for (const key of Object.keys(EMPTY_FORM)) {
    out[key] = data?.[key] ?? '';
  }
  return out;
};

// Moving these OUTSIDE the main component prevents React from treating them
// as new component types on every render, which fixes the input focus loss bug.
const Field = ({ label, name, value, onChange, type = 'text', placeholder = '', hint = '' }) => (
  <div>
    <label htmlFor={`cm-${name}`} className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      id={`cm-${name}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue transition-colors"
    />
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

const TextArea = ({ label, name, value, onChange, rows = 3, placeholder = '', hint = '' }) => (
  <div>
    <label htmlFor={`cm-${name}`} className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <textarea
      id={`cm-${name}`}
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue transition-colors resize-none"
    />
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const ContentManagement = () => {
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  // ── Load current settings on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/settings');
        setFormData(toForm(res.data.data));
      } catch (err) {
        setError('Failed to load settings. Please refresh the page.');
        console.error('fetchSettings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear status messages on edit
    setSuccess(false);
    setError('');
  };

  // ── Submit handler ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await API.put('/settings', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Sync form with what the DB actually saved
      setFormData(toForm(res.data.data));
      setSuccess(true);
      // Auto-dismiss success banner after 4 s
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to save settings. Please try again.';
      setError(msg);
      console.error('updateSettings:', err);
    } finally {
      setSaving(false);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm">Loading website settings…</p>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2">
            <Globe size={24} />
            Website Content
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            All changes are saved directly to the database and appear on the live site immediately.
          </p>
        </div>
        <button
          type="submit"
          form="content-form"
          disabled={saving}
          className="flex items-center gap-2 bg-corporateBlue hover:bg-corporateBlue-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : (
            <><Save size={16} /> Save Changes</>
          )}
        </button>
      </div>

      {/* Status banners */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 mb-6 text-sm">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>Settings saved successfully! The live website will reflect these changes immediately.</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form id="content-form" onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

        {/* ── Section: Homepage Hero ── */}
        <section className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Globe size={18} className="text-corporateBlue" />
            Homepage Hero Section
          </h3>
          <div className="space-y-4">
            <Field
              label="Hero Heading"
              name="hero_title"
              value={formData.hero_title}
              onChange={handleChange}
              placeholder="Building Reliable Infrastructure & Renewable Solutions"
              hint="Main heading displayed on the homepage hero banner."
            />
            <TextArea
              label="Hero Subheading"
              name="hero_subtitle"
              value={formData.hero_subtitle}
              onChange={handleChange}
              placeholder="Professional pipeline, construction, solar and industrial services…"
              hint="Supporting text shown below the main heading."
            />
          </div>
        </section>

        {/* ── Section: Company Details ── */}
        <section className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Company Details</h3>
          <div className="space-y-4">
            <Field
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Janki Ballabh Services"
              hint="Used in the Navbar, Footer, and About page."
            />
            <TextArea
              label="About / Company Description"
              name="about_description"
              value={formData.about_description}
              onChange={handleChange}
              rows={4}
              placeholder="Janki Ballabh Services is a premier industrial infrastructure company…"
              hint="Short paragraph about the company — displayed in the About page and Footer."
            />
            <Field
              label="Footer Text"
              name="footer_text"
              value={formData.footer_text}
              onChange={handleChange}
              placeholder="Building reliable infrastructure & renewable energy solutions…"
              hint="Short tagline displayed in the Footer column."
            />
          </div>
        </section>

        {/* ── Section: Contact Information ── */}
        <section className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Phone size={18} className="text-corporateBlue" />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Contact Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="+91 9079139959"
              />
              <Field
                label="Contact Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="info@yourcompany.com"
              />
            </div>
            <Field
              label="Office Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Plot No. D-32A, Narottampura, Jaipur, Rajasthan – 302026"
              hint="Displayed in the Footer and Contact page."
            />
            <Field
              label="WhatsApp Number"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              type="tel"
              placeholder="+919079139959"
              hint="Used for the WhatsApp chat button (no spaces or dashes)."
            />
          </div>
        </section>

        {/* ── Section: Social Links ── */}
        <section className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Link2 size={18} className="text-corporateBlue" />
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Facebook URL" name="facebook_link" value={formData.facebook_link} onChange={handleChange} placeholder="https://facebook.com/yourpage" />
            <Field label="Instagram URL" name="instagram_link" value={formData.instagram_link} onChange={handleChange} placeholder="https://instagram.com/yourhandle" />
            <Field label="LinkedIn URL" name="linkedin_link" value={formData.linkedin_link} onChange={handleChange} placeholder="https://linkedin.com/company/yourcompany" />
            <Field label="YouTube URL" name="youtube_link" value={formData.youtube_link} onChange={handleChange} placeholder="https://youtube.com/@yourchannel" />
          </div>
        </section>

        {/* ── Section: Google Maps ── */}
        <section className="bg-slate-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-corporateBlue" />
            Google Maps Embed
          </h3>
          <TextArea
            label="Google Maps iFrame src URL"
            name="google_map_embed"
            value={formData.google_map_embed}
            onChange={handleChange}
            rows={3}
            placeholder="https://www.google.com/maps/embed?pb=..."
            hint="Paste only the src URL from the Google Maps embed code. The iFrame wrapper is added automatically."
          />
        </section>

        {/* Bottom save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            form="content-form"
            disabled={saving}
            className="flex items-center gap-2 bg-corporateBlue hover:bg-corporateBlue-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-md font-medium transition-colors"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={16} /> Save All Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentManagement;
