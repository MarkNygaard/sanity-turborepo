import { groq } from "next-sanity";

export const buttonFragment = groq`
  buttons[] {
    text,
    linkType,
    openInNewTab,
    variant,
    internalLink-> {
      _id,
      _type,
      _ref,
      slug {
        _type,
        current
      }
    },
    externalLink
  }
`;
