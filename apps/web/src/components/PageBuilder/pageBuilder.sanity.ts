import { groq } from "next-sanity";

import { accordionFragment } from "../../components/PageBuilder/Blocks/Accordion/accordion.sanity";
import { filmStripFragment } from "../../components/PageBuilder/Blocks/FilmStrip/filmStrip.sanity";
import { heroFragment } from "../../components/PageBuilder/Blocks/Hero/hero.sanity";

export const pageBuilderFragment = groq`
  pageBuilder[] {
    ${heroFragment},
    ${filmStripFragment},
    ${accordionFragment}
  }
`;
