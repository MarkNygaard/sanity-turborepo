import type {
  Accordion,
  FilmStrip,
  Hero,
  PageBuilder as PageBuilderType,
} from "types/sanity";

import AccordionBlock from "./Blocks/Accordion";
import FilmStripBlock from "./Blocks/FilmStrip";
import HeroBlock from "./Blocks/Hero";

interface PageBuilderProps {
  blocks: PageBuilderType;
}

export default function PageBuilder({ blocks }: PageBuilderProps) {
  if (!blocks) return null;

  return (
    <>
      {blocks?.map((block) => {
        switch (block._type) {
          case "hero":
            return <HeroBlock key={block._key} {...(block as Hero)} />;
          case "filmStrip":
            return (
              <FilmStripBlock key={block._key} {...(block as FilmStrip)} />
            );
          case "accordion":
            return (
              <AccordionBlock key={block._key} {...(block as Accordion)} />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
