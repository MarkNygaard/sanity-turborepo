import React from "react";
import { Hero as HeroType } from "types/sanity";

import { Carousel, CarouselContent, CarouselItem } from "@repo/ui/carousel";

import { Slide } from "./Slide";

export default function Hero({ slides }: HeroType) {
  if (!slides || slides.length === 0) return null;

  if (slides.length === 1) {
    const content = slides[0];
    if (!content) return null;

    return <Slide content={content} slideCount={slides.length} />;
  }

  return (
    <Carousel autoplay delay={6000} opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((content, index) => (
          <CarouselItem key={index}>
            <Slide content={content} slideCount={slides.length} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
