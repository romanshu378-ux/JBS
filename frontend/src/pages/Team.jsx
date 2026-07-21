import { useState, useEffect, memo } from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { cachedGet, getImageUrl } from '../api/index.js';
import SEOHead, { SITE } from '../hooks/useSEO.jsx';

// Local SVG placeholder — no external request, no tech-stack leak
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='60' font-family='sans-serif'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";

// ─── Memoized Team Member Card ────────────────────────────────────────────────
const TeamMemberCard = memo(({ member }) => (
  <article
    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group flex flex-col"
    itemScope
    itemType="https://schema.org/Person"
  >
    <div className="h-80 overflow-hidden relative">
      <img
        loading="lazy"
        decoding="async"
        src={getImageUrl(member.image, PLACEHOLDER_IMAGE)}
        alt={`${member.name} — ${member.role} at Janki Ballabh Services`}
        width="400"
        height="400"
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        itemProp="image"
        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
      />

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-corporateBlue to-transparent h-1/2 opacity-60" aria-hidden="true"></div>

      <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          className="bg-white/20 p-2 rounded-full hover:bg-corporateGold text-white transition-colors backdrop-blur-sm"
          aria-label={`View ${member.name}'s LinkedIn profile`}
        >
          <Linkedin size={18} aria-hidden="true" />
        </button>

        <button
          className="bg-white/20 p-2 rounded-full hover:bg-corporateGold text-white transition-colors backdrop-blur-sm"
          aria-label={`Email ${member.name}`}
        >
          <Mail size={18} aria-hidden="true" />
        </button>
      </div>
    </div>

    <div className="p-6 text-center border-t-4 border-corporateGold">
      <h2 className="text-2xl font-bold text-corporateBlue mb-1" itemProp="name">
        {member.name}
      </h2>
      <p className="text-slate-500 font-medium" itemProp="jobTitle">
        {member.role}
      </p>
    </div>
  </article>
));

TeamMemberCard.displayName = 'TeamMemberCard';

// ─── Team Page ────────────────────────────────────────────────────────────────
const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTeam = async () => {
      try {
        const { data } = await cachedGet('/team');

        if (!cancelled) {
          setTeamMembers(data.data || []);
        }
      } catch (_err) {
        // silently handled — loading spinner stops in finally
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTeam();
    return () => { cancelled = true; };
  }, []);

  // Build Person schema array from team members
  const personSchemas = teamMembers.map((member) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    worksFor: { '@id': `${SITE.domain}/#organization` },
    ...(member.image && {
      image: {
        '@type': 'ImageObject',
        url: getImageUrl(member.image, PLACEHOLDER_IMAGE),
        name: member.name,
      },
    }),
  }));

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* ── SEO Head ── */}
      <SEOHead
        title="Our Leadership Team — Janki Ballabh Services, Jaipur"
        description="Meet the expert leadership team behind Janki Ballabh Services — the driving force behind premier industrial infrastructure, Solar EPC, pipeline and construction projects in Jaipur, Rajasthan."
        keywords="Janki Ballabh Services Team, Industrial Company Leadership Jaipur, Infrastructure Company Directors Rajasthan, Solar EPC Team India"
        canonicalPath="/team"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Team', path: '/team' },
        ]}
        structuredData={personSchemas}
      />

      <div className="container mx-auto px-4">
        {/* ── Breadcrumb nav ── */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-corporateBlue transition-colors">Home</a></li>
            <li aria-hidden="true" className="text-slate-300">/</li>
            <li className="text-corporateBlue font-medium">Team</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-heading font-bold text-corporateBlue mb-4 text-center">
          Meet Our Leadership
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mb-16">
          The driving force behind Janki Ballabh Services' success and commitment to excellence in industrial infrastructure and renewable energy across Rajasthan.
        </p>

        {loading ? (
          <div className="text-center py-12 text-slate-600 text-xl font-medium" role="status" aria-label="Loading team members">
            Loading Team...
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-600 text-xl font-medium">
            No team members found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id || index} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Team);