import { groq } from "next-sanity";

export const languagesQuery = groq`
  {
    "languages": *[_type == "language"]|order(title asc) {
      _id,
      title,
      code,
      isDefault
    },
  }
`;

// Primitives

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

// Page Builder Fragments

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

export const accordionFragment = groq`
  _type == "accordion" => {
    _type,
    _key,
    panels[]{
      _key,
      label,
      content
    }
  }
`;

// Page Builder Query

export const pageBuilderFragment = groq`
  pageBuilder[] {
    ${heroFragment},
    ${filmStripFragment},
    ${accordionFragment}
  }
`;

// Home Page Query

export const homeQuery = groq`
  *[_id == $docId][0] {
    _id,
    _type,
    title,
    description,
    language,
    ${pageBuilderFragment},
    seoTitle,
    seoDescription,
    seoImage {
      asset->,
      alt
    },
    ogTitle,
    ogDescription
  }
`;
