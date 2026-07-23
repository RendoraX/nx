// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#faf9f6] z-50">
      <div className="relative flex items-center justify-center">
        {/* Outer breathing/pulsing circle */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-emerald-700/20 animate-ping duration-1000" />
        
        {/* Core rotating custom spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin" />
        
        {/* Center organic dot/leaf accent */}
        <div className="absolute w-3 h-3 bg-amber-600 rounded-full" />
      </div>
      
      {/* Healing/Wellness context text */}
      <p className="mt-6 text-sm font-medium tracking-wide text-emerald-900/70 animate-pulse">
        Restoring balance...
      </p>
    </div>
  );
}