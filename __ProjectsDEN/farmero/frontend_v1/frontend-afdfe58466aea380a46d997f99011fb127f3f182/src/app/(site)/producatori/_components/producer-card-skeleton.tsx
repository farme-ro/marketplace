/**
 * Producer Card Skeleton Component
 * 
 * Skeleton loading pentru cardurile de producători
 */

export function ProducerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220] shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="h-[140px] bg-slate-200 dark:bg-slate-800" />
      
      {/* Content */}
      <div className="pt-12 pb-5 px-5 flex-1 flex flex-col">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto -mt-10 mb-3" />
        
        {/* Name */}
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto mb-2" />
        
        {/* Location */}
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto mb-4" />
        
        {/* Rating */}
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mx-auto mb-4" />
        
        {/* Tags */}
        <div className="flex gap-2 justify-center mb-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
        </div>
        
        {/* Products */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
        </div>
        
        {/* Button */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

