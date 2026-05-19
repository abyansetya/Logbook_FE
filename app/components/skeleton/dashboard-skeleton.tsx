const DashboardSkeleton = () => (
  <div className="min-h-full bg-[#F8FAFC] animate-pulse lg:h-full lg:overflow-hidden">
    <div className="mx-auto flex h-full min-h-0 flex-col gap-3">
      {/* Header Skeleton */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded bg-gray-300" />
          <div className="h-4 w-80 rounded bg-gray-200" />
        </div>
        <div className="h-3 w-40 rounded bg-gray-200" />
      </header>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 space-y-2 rounded-xl border border-gray-100 bg-white p-4"
          >
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-6 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      <div className="grid flex-1 gap-3 overflow-hidden lg:min-h-0 lg:grid-cols-12">
        {/* Chart Skeleton */}
        <div className="rounded-xl border border-gray-100 bg-white p-3 lg:col-span-7 lg:flex lg:min-h-0 lg:flex-col">
          <div className="mb-6 flex justify-between">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-gray-100 rounded-xl" />
              <div className="h-9 w-20 bg-gray-100 rounded-xl" />
            </div>
          </div>
          <div className="flex h-56 w-full items-end justify-around rounded-lg bg-gray-50 p-4 lg:h-full lg:min-h-[180px]">
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
        <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 lg:col-span-5 lg:flex lg:min-h-0 lg:flex-col">
          <div className="mb-1 flex items-center justify-between">
            <div className="h-5 w-40 rounded bg-gray-200" />
            <div className="h-10 w-24 rounded-lg bg-gray-100" />
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border border-slate-100 p-2.5">
                <div className="mb-2 flex justify-between">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-4 w-10 rounded bg-gray-200" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
