import Skeleton from '../Skeleton';

/**
 * BlogCardSkeleton mirrors the standard BlogCard layout
 */
export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      <Skeleton height="13rem" className="rounded-none" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="3rem" height="1rem" />
        </div>
        <Skeleton className="mb-3 h-7 w-full" />
        <Skeleton className="mb-6 h-12 w-full" />
        <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-800/50 flex items-center justify-between">
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="4rem" height="1rem" />
        </div>
      </div>
    </div>
  );
}

/**
 * BlogGridSkeleton renders a grid of BlogCardSkeletons
 */
export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * PostSkeleton mirrors the SinglePost page layout
 */
export function PostSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto pb-16">
      <Skeleton width="8rem" height="1rem" className="mb-8" />
      
      <header className="mb-8">
        <div className="flex gap-2 mb-6">
          <Skeleton width="5rem" height="1.5rem" />
          <Skeleton width="4rem" height="1.5rem" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-3/4 mb-8" />
        
        <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Skeleton circle width="3rem" height="3rem" />
            <div className="space-y-2">
              <Skeleton width="8rem" height="1rem" />
              <Skeleton width="6rem" height="0.75rem" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton width="5rem" height="2.5rem" className="rounded-lg" />
            <Skeleton width="4rem" height="2.5rem" className="rounded-lg" />
          </div>
        </div>
      </header>
      
      <Skeleton height="400px" className="rounded-2xl mb-12" />
      
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
      </div>
    </div>
  );
}

/**
 * CommentSkeleton mirrors a single comment layout
 */
export function CommentSkeleton() {
  return (
    <div className="flex gap-5 py-2">
      <Skeleton circle width="2.5rem" height="2.5rem" className="shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="4rem" height="0.75rem" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
