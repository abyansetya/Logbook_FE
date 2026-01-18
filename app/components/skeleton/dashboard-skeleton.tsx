const DashboardSkeleton = () => (
  <div className="min-h-screen p-6 lg:p-10 bg-[#F8FAFC] animate-pulse">
    <div className="mx-auto space-y-8">
      {/* Header Skeleton */}
      <header className="space-y-3">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-64 bg-gray-300 rounded" />
        <div className="h-4 w-80 bg-gray-200 rounded" />
      </header>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-white border border-gray-100 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chart Skeleton */}
        <div className="lg:col-span-3 h-[450px] bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-100 rounded-xl" />
              <div className="h-9 w-20 bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div className="h-64 w-full bg-gray-50 rounded-lg flex items-end justify-around p-4">
            {[1, 2, 3, 4, 5, 6].map((b) => (
              <div
                key={b}
                className="w-12 bg-gray-200 rounded-t"
                style={{ height: `${((b * 13) % 40) + 40}%` }}
              />
            ))}
          </div>
        </div>

        {/* Status Dokumen Skeleton */}
        <div className="lg:col-span-2 h-[450px] bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
          <div className="h-5 w-40 bg-gray-200 rounded mb-8" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-10 bg-gray-200 rounded" />
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full" />
            </div>
          ))}
          <div className="flex justify-center pt-8">
            <div className="h-32 w-32 rounded-full border-8 border-gray-100" />
          </div>
        </div>
      </div>

      {/* Activity Skeleton */}
      <div className="h-64 bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 items-center border-b border-gray-50 pb-4"
          >
            <div className="h-10 w-10 bg-gray-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
