import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export function ImageWithFallback({ src, alt, fallback, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultFallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';

  return (
    <img
      {...props}
      src={error ? (fallback || defaultFallback) : src}
      alt={alt}
      onError={() => setError(true)}
      onLoad={() => setLoading(false)}
      style={{
        ...props.style,
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }}
    />
  );
}
