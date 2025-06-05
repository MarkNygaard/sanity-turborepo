import type { SanityImageSource } from "@sanity/asset-utils";
import { SanityImageAsset } from "types/sanity";

import { urlFor } from "@repo/sanity/image";

interface ImageProps {
  image: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  };
  imgClassName?: string;
  pictureClassName?: string;
}

export default function PrimitiveImage({
  image,
  imgClassName,
  pictureClassName,
}: ImageProps) {
  if (!image?.asset?._ref) return null;

  const imageUrl = urlFor(image as SanityImageSource)
    .width(800)
    .height(600)
    .fit("crop")
    .url();

  if (!imageUrl) return null;

  return (
    <picture className={pictureClassName}>
      <img src={imageUrl} alt={image.alt || ""} className={imgClassName} />
    </picture>
  );
}
