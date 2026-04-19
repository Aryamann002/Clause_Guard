
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer rounded-lg", className)}
      aria-hidden="true"
    />
  );
}

export function ResultsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {}
        <div className="space-y-4">
          <div className="card p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="card p-5">
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-8 w-full rounded-xl mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-2">
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="space-y-4">
          <div className="card p-5 min-h-[240px]">
            <Skeleton className="h-5 w-32 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function LawyersSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card p-5 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
