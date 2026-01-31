import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 pb-4 bg-white rounded-xl overflow-hidden shadow-sm border border-transparent animate-pulse">
      <div className="w-full aspect-square bg-gray-200" />
      <div className="px-4 pb-2">
        <div className="flex flex-col mb-4 gap-2">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-8 bg-gray-200 rounded w-20" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded flex-1" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
