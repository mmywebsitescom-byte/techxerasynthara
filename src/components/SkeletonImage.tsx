import React, { useState, useRef, useEffect } from 'react';

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  showSkeleton?: boolean;
  aspectRatio?: string;
}

export default function SkeletonImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  containerClassName = '',
  skeletonClassName = '',
  showSkeleton = true,
  aspectRatio,
  onLoad,
  onError,
  ...rest
}: SkeletonImageProps) {
  const combinedWrapper = `${containerClassName} ${wrapperClassName}`.trim();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check if image is already cached and loaded
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <div
      className={`relative overflow-hidden ${combinedWrapper}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Cyber Shimmer Skeleton Loader */}
      {showSkeleton && !isLoaded && !hasError && (
        <div
          className={`absolute inset-0 z-10 animate-skeleton-shimmer flex items-center justify-center pointer-events-none select-none ${skeletonClassName}`}
        >
          {/* Subtle scanning glow line */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#D4AF37]/5 to-transparent animate-pulse" />
          
          {/* Subtle Cyber Corner Reticles */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#D4AF37]/40 pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#D4AF37]/40 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#D4AF37]/40 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#D4AF37]/40 pointer-events-none" />
        </div>
      )}

      {/* Actual Image with smooth fade-in */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${className} transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
}
