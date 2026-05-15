import React from 'react'

export default function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-brand-dark/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="h-12 w-12 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse rounded-xl mx-auto mb-6"></div>
        <div className="h-8 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-48 rounded-lg mx-auto mb-2"></div>
        <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-64 rounded mx-auto"></div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#242729] py-8 px-4 shadow-xl sm:rounded-[2rem] sm:px-10 border border-slate-200 dark:border-white/10 space-y-6">
          {/* Inputs */}
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-24 rounded"></div>
              <div className="h-12 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-xl"></div>
            </div>
          ))}

          {/* Button */}
          <div className="pt-2">
            <div className="h-12 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-full rounded-xl"></div>
          </div>

          {/* Links */}
          <div className="flex justify-center pt-4">
            <div className="h-4 bg-brand-primary/10 dark:bg-brand-primary/5 animate-pulse w-40 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
