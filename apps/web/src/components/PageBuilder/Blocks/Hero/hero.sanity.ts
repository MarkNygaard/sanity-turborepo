import { groq } from "next-sanity";

import { buttonFragment } from "../../../Primitives/Link/button.sanity";

export const heroFragment = groq`
  _type == "hero" => {
    _type,
    _key,
    slides[] {
      title,
      subTitle,
      ${buttonFragment},
      mediaType,
      image {
        ...,
        ...asset-> {
          altText,
          caption,
          ...metadata {
            lqip,
            ...dimensions {
              width,
              height
            }
          }
        }
      },
      video {
        asset,
        alt,
        poster {
          asset
        }
      }
    }
  }
`;
