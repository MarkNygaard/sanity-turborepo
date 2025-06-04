import type { SanityImageSource } from "@sanity/asset-utils";
import type { Metadata } from "next";

import { urlFor } from "@repo/sanity";

interface MetaDataInput {
  _type?: string;
  _id?: string;
  seoTitle?: string;
  seoDescription?: string;
  title?: string;
  description?: string;
  seoImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    media?: unknown;
    hotspot?: {
      _type: "sanity.imageHotspot";
      x?: number;
      y?: number;
      height?: number;
      width?: number;
    };
    crop?: {
      _type: "sanity.imageCrop";
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    _type: "image";
  };
  ogTitle?: string;
  ogDescription?: string;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

function getOgImage(image?: MetaDataInput["seoImage"]): string | undefined {
  if (!image?.asset) return undefined;
  return urlFor(image as SanityImageSource).url();
}

export async function getMetaData(data: MetaDataInput = {}): Promise<Metadata> {
  const {
    _type,
    seoDescription,
    seoTitle,
    title,
    description,
    _id,
    seoImage,
    ogTitle,
    ogDescription,
  } = data;

  const baseUrl = getBaseUrl();
  const ogImageUrl = getOgImage(seoImage);

  const meta = {
    title: seoTitle || title || "Home",
    description: seoDescription || description || "",
  };

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: ogTitle || meta.title,
      description: ogDescription || meta.description,
      images: ogImageUrl ? [ogImageUrl] : [],
      type: "website",
      url: baseUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}
