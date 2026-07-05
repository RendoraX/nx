import React from 'react';

export default function Loading() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  );
}