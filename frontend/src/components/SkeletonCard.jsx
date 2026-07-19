import { memo } from 'react';

/**
 * SkeletonCard — animated loading placeholder.
 * @param {string} variant - 'service' | 'project' (default: 'service')
 */
const SkeletonCard = memo(({ variant = 'service' }) => {
  if (variant === 'project') {
    return (
      <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-white animate-pulse">
        <div className="w-full h-64 bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 animate-pulse">
      {/* Image / Icon placeholder */}
      <div className="w-full h-48 bg-slate-200 rounded-md mb-6" />
      {/* Title */}
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
      {/* Description lines */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-4/6" />
      </div>
      {/* Link */}
      <div className="h-4 bg-slate-200 rounded w-24" />
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export default SkeletonCard;
