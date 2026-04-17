import { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  aspectRatio?: string; // e.g., '16/9'
}

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  aspectRatio,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);
    
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={{ aspectRatio }}
    >
      {/* Skeleton Placeholder */}
      {!isLoaded && !error && (
        <Skeleton className="absolute inset-0 z-0 h-full w-full rounded-none" />
      )}

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
           <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`
          ${className}
          transition-opacity duration-500 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
