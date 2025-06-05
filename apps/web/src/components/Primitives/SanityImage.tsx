import Image from "next/image";

import { urlFor } from "@repo/sanity/image";

interface SanityImageType {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  media?: unknown;
  hotspot?: any;
  crop?: any;
  _type: "image";
}

interface SanityImageProps {
  image: SanityImageType & { alt?: string };
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  sizes,
}: SanityImageProps) {
  if (!image.asset) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm text-gray-400">No image</span>
      </div>
    );
  }

  // Use Sanity's image URL builder for optimized images
  const imageUrl = urlFor(image)
    .width(width)
    .height(height)
    .auto("format")
    .url();

  return (
    <Image
      src={imageUrl}
      alt={image.alt ?? alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
