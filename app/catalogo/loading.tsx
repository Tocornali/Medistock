import ProductGridSkeleton from '@/components/skeletons/ProductGridSkeleton'
import FilterSidebarSkeleton from '@/components/skeletons/FilterSidebarSkeleton'

export default function LoadingCatalogo() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-brand-dark/20 transition-colors">
      <div className="max-w-7xl mx-auto mt-44">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebarSkeleton />
          <div className="flex-1 w-full">
            <ProductGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}

