import { useState, useEffect } from 'react';
import { Search, Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import API from '../api/index.js';

const EMPTY_SEO = {
  seo_meta_title: '',
  seo_meta_description: '',
};

const toForm = (data) => ({
  seo_meta_title:       data?.seo_meta_title       ?? '',
  seo_meta_description: data?.seo_meta_description ?? '',
});

const SeoSettings = () => {
  const [formData, setFormData] = useState(EMPTY_SEO);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  // ── Load current SEO settings on mount ──────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/settings');
        setFormData(toForm(res.data.data));
      } catch (err) {
        setError('Failed to load SEO settings. Please refresh the page.');
        console.error('SeoSettings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await API.put('/settings', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setFormData(toForm(res.data.data));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Failed to save SEO settings. Please try again.';
      setError(msg);
      console.error('SeoSettings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Character-count colour helper
  const countColour = (len, warn, max) => {
    if (len > max) return 'text-red-500';
    if (len > warn) return 'text-yellow-500';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm">Loading SEO settings…</p>
        </div>
      </div>
    );
  }

  const titleLen = (formData.seo_meta_title || '').length;
  const descLen  = (formData.seo_meta_description || '').length;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 min-h-[600px]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-corporateBlue flex items-center gap-2">
            <Search size={24} />
            SEO Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage metadata and search engine optimisation for the main website.
          </p>
        </div>
        <button
          type="submit"
          form="seo-form"
          disabled={saving}
          className="flex items-center gap-2 bg-corporateBlue hover:bg-corporateBlue-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : (
            <><Save size={16} /> Update SEO</>
          )}
        </button>
      </div>

      {/* Status banners */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-3 mb-6 text-sm">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>SEO settings saved! Search engines will pick up the new metadata on the next crawl.</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mb-6 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Note */}
      <div className="bg-blue-50 border border-blue-100 rounded-md px-4 py-3 mb-8 text-sm text-blue-700">
        <strong>Note:</strong> These global SEO fields are stored in the database and returned by the{' '}
        <code className="bg-blue-100 rounded px-1">/api/settings</code> endpoint. They override the
        default values hardcoded in the frontend only when both fields are filled in.
      </div>

      <form id="seo-form" onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

        {/* Meta Title */}
        <div>
          <label htmlFor="seo-meta-title" className="block text-sm font-medium text-slate-700 mb-1">
            Global Meta Title
          </label>
          <input
            id="seo-meta-title"
            type="text"
            name="seo_meta_title"
            value={formData.seo_meta_title}
            onChange={handleChange}
            placeholder="Janki Ballabh Services | Industrial Infrastructure"
            maxLength={80}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue transition-colors"
          />
          <p className="text-xs mt-1">
            <span className={countColour(titleLen, 50, 60)}>
              {titleLen} / 60 characters
            </span>
            <span className="text-slate-400 ml-2">— Keep under 60 characters for best results.</span>
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="seo-meta-desc" className="block text-sm font-medium text-slate-700 mb-1">
            Global Meta Description
          </label>
          <textarea
            id="seo-meta-desc"
            name="seo_meta_description"
            rows={4}
            value={formData.seo_meta_description}
            onChange={handleChange}
            placeholder="Professional pipeline, construction, solar and industrial services with safety, innovation and quality."
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-corporateBlue focus:ring-1 focus:ring-corporateBlue transition-colors resize-none"
          />
          <p className="text-xs mt-1">
            <span className={countColour(descLen, 140, 160)}>
              {descLen} / 160 characters
            </span>
            <span className="text-slate-400 ml-2">— Keep between 120–160 characters for best results.</span>
          </p>
        </div>

        {/* SERP Preview */}
        {(formData.seo_meta_title || formData.seo_meta_description) && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">SERP Preview</p>
            <div className="text-blue-600 text-lg font-medium leading-tight mb-1 truncate">
              {formData.seo_meta_title || 'Page Title'}
            </div>
            <div className="text-green-700 text-xs mb-2">https://jankiballabhservices.in/</div>
            <div className="text-slate-600 text-sm leading-relaxed line-clamp-2">
              {formData.seo_meta_description || 'Page description will appear here…'}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            form="seo-form"
            disabled={saving}
            className="flex items-center gap-2 bg-corporateBlue hover:bg-corporateBlue-light disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-md font-medium transition-colors"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={16} /> Update SEO Settings</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeoSettings;
