interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export default function Skeleton({ 
  className = '', 
  width, 
  height, 
  circle = false 
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`
        bg-gray-200 dark:bg-gray-800 
        relative overflow-hidden
        ${circle ? 'rounded-full' : 'rounded-md'}
        ${className}
      `}
      style={style}
    >
      <div className="shimmer absolute inset-0" />
    </div>
  );
}
