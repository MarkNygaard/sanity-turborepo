import type { Hero } from "types/sanity";
import Image from "next/image";
import SanityButtons from "@/Primitives/Link";

import { urlFor } from "@repo/sanity/image";
import {
  CarouselAutoplayToggle,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/carousel";

interface SlideProps {
  content: Hero["slides"][number];
  slideCount: number;
}

export function Slide({ content, slideCount }: SlideProps) {
  return (
    <div className="relative">
      {content.mediaType === "image" && content.image && (
        <div className="relative flex aspect-[2/3] w-full items-center justify-center overflow-hidden text-center md:aspect-[72/35] lg:aspect-auto lg:h-[700px]">
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(content.image).url()}
              alt={content.image.alt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {(content.title ??
            content.subTitle ??
            content.ctaButtons?.length) && (
            <div className="absolute z-10 mt-16 px-4 text-white md:mt-24 lg:mt-24">
              {content.title && (
                <h1 className="py-2 text-5xl font-extrabold md:text-5xl">
                  {content.title}
                </h1>
              )}
              {content.subTitle && (
                <p className="mt-2 text-lg md:text-xl">{content.subTitle}</p>
              )}

              <SanityButtons
                data={content.buttons}
                className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8"
              />
            </div>
          )}

          {slideCount > 1 && (
            <div className="absolute bottom-8 right-12 z-20 flex">
              <CarouselAutoplayToggle className="bg-white/80 text-black hover:bg-white" />
              <CarouselPrevious className="bg-white/80 text-black hover:bg-white" />
              <CarouselNext className="bg-white/80 text-black hover:bg-white" />
            </div>
          )}
        </div>
      )}

      {/* {content.video &&
        content.video.asset?.playbackId && (
          <BackgroundVideo
            video={content.video.asset.playbackId}
            title={content.title || ""}
            subtitle={content.subtitle || ""}
            cta={content.cta as LinkRecord[]}
            slideCount={slideCount || 0}
          />,
        )} */}
    </div>
  );
}
