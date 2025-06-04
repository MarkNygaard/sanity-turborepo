import { buttonFragment } from "@/Primitives/Link/button.sanity";
import { groq } from "next-sanity";

export const filmStripFragment = groq`
  _type == "filmStrip" => {
    _type,
    _key,
    cards[]{
      _key,
      label,
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
      video{
        asset->{
          _id,
          url
        },
        alt,
        poster{
          asset->{
            _id,
            url
          },
          alt
        }
      },
      ctaButtons[]{
        _key,
        label,
        linkType,
        internalLink->{_ref, slug},
        externalLink
      }
    }
  }
`;
