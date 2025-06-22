
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 text-stone-600">
      <div className="w-2 h-2 bg-stone-500 rounded-full animate-pulse delay-0"></div>
      <div className="w-2 h-2 bg-stone-500 rounded-full animate-pulse delay-200"></div>
      <div className="w-2 h-2 bg-stone-500 rounded-full animate-pulse delay-400"></div>
      <span className="text-sm">Pensando...</span>
    </div>
  );
};
