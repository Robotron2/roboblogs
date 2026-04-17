import type { ReactNode } from 'react';

interface BlogGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function BlogGrid({ children, columns = 3, className = '' }: BlogGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <section className={`grid ${gridCols} gap-8 ${className}`}>
      {children}
    </section>
  );
}
