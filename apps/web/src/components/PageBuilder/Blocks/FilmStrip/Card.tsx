import type { FilmStrip } from "types/sanity";
import React from "react";
import Image from "next/image";
import SanityButtons from "components/Primitives/Link";

import { urlFor } from "@repo/sanity";

interface CardProps {
  card: FilmStrip["cards"][number];
}

export default function Card({ card }: CardProps) {
  return (
    <>
      {card.image && (
        <div className="relative w-full min-w-[300px] md:min-w-[600px] lg:min-w-[300px]">
          <Image
            src={urlFor(card.image).width(600).height(800).url()}
            alt={card.image.alt ?? ""}
            width={600}
            height={800}
          />
          <div className="absolute bottom-12 left-6 z-10 px-4 text-white">
            <SanityButtons
              data={card.buttons}
              className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8"
            />
          </div>
        </div>
      )}
    </>
  );
}
