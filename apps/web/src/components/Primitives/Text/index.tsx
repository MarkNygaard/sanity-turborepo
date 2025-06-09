import type { SanityImageSource } from "@sanity/asset-utils";
import type { RichText } from "types/sanity";
import React from "react";
import { PortableText } from "@portabletext/react";

import { urlFor } from "@repo/sanity/image";

interface TextProps {
  content: RichText | null | undefined;
}

export default function PrimitiveText({ content }: TextProps) {
  if (!content) return null;

  return (
    <div className="prose">
      <PortableText
        value={content}
        components={{
          types: {
            image: ({ value }) => {
              if (!value?.asset?._ref) return null;
              return (
                <img
                  src={urlFor(value as SanityImageSource)
                    .width(800)
                    .height(600)
                    .fit("crop")
                    .url()}
                  alt={value.alt || ""}
                  className="rounded-lg"
                />
              );
            },
          },
        }}
      />
    </div>
  );
}
