import { defineQuery, groq } from "next-sanity";

export const LANGUAGES_QUERY = defineQuery(`*[
  _type == "language"
] | order(title asc) {
  _id,
  title,
  code,
  isDefault
}`);

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
      title,
      slug {
        _type,
        current
      }
    },
    externalLink
  }
`;

// Page Builder Fragments (as string literals for composition)

const heroFields = /* groq */ `
  _type,
  _key,
  autoplay,
  slideInterval,
  slides[] {
    title,
    subTitle,
    contentAlignment,
    buttons[] {
      text,
      linkType,
      openInNewTab,
      variant,
      internalLink-> {
        _id,
        _type,
        title,
        slug {
          _type,
          current
        }
      },
      externalLink
    },
    mediaType,
    image {
      asset-> {
        _id,
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt,
      hotspot,
      crop
    },
    video {
      asset-> {
        _id,
        url
      },
      alt,
      poster {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop
      }
    }
  }
`;

const filmStripFields = /* groq */ `
  _type,
  _key,
  cards[] {
    _key,
    label,
    buttons[] {
      text,
      linkType,
      openInNewTab,
      variant,
      internalLink-> {
        _id,
        _type,
        title,
        slug {
          _type,
          current
        }
      },
      externalLink
    },
    mediaType,
    image {
      asset-> {
        _id,
        url,
        altText,
        metadata {
          lqip,
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt,
      hotspot,
      crop
    },
    video {
      asset-> {
        _id,
        url
      },
      alt,
      poster {
        asset-> {
          _id,
          url
        },
        hotspot,
        crop
      }
    }
  }
`;

const accordionFields = /* groq */ `
  _type,
  _key,
  title,
  allowMultiple,
  variant,
  panels[] {
    _key,
    label,
    content,
    defaultOpen
  }
`;

// Page Builder Query

export const pageBuilderFragment = groq`
  pageBuilder[] {
    _type == "hero" => {
      ${heroFields}
    },
    _type == "filmStrip" => {
      ${filmStripFields}
    },
    _type == "accordion" => {
      ${accordionFields}
    }
  }
`;

// Home Page Query

export const HOME_PAGE_QUERY = defineQuery(`*[
  _type == "homePage"
  && language == $language
][0] {
  _id,
  _type,
  title,
  language,
  market,
  ${pageBuilderFragment}
}`);

// Page Query

export const PAGE_QUERY = defineQuery(`*[
  _type == "page"
  && slug.current == $slug
  && language == $language
][0] {
  _id,
  _type,
  title,
  slug,
  language,
  ${pageBuilderFragment}
}`);

// Settings Query

export const SETTINGS_QUERY = defineQuery(`*[
  _type == "settings"
  && language == $language
][0] {
  _id,
  label,
  siteTitle,
  siteDescription,
  logo {
    asset-> {
      _id,
      url
    },
    hotspot,
    crop
  },
  favicon {
    asset-> {
      _id,
      url
    },
    hotspot,
    crop
  },
  socialShareImage {
    asset-> {
      _id,
      url
    },
    hotspot,
    crop
  },
  language,
  market
}`);

// Navigation Query

export const NAVIGATION_QUERY = defineQuery(`*[
  _type == "navigation"
  && language == $language
][0] {
  _id,
  label,
  language,
  market,
  navigationItems[] {
    _type == "navigationLink" => {
      _type,
      name,
      linkType,
      openInNewTab,
      internalLink-> {
        _id,
        _type,
        title,
        slug {
          current
        }
      },
      externalLink
    },
    _type == "navigationDropdown" => {
      _type,
      title,
      columns[] {
        title,
        links[] {
          name,
          linkType,
          openInNewTab,
          internalLink-> {
            _id,
            _type,
            title,
            slug {
              current
            }
          },
          externalLink
        }
      }
    }
  }
}`);

// Footer Query

export const FOOTER_QUERY = defineQuery(`*[
  _type == "footer"
  && language == $language
][0] {
  _id,
  label,
  subtitle,
  copyrightText,
  language,
  market,
  logo {
    asset-> {
      _id,
      url
    },
    hotspot,
    crop
  },
  columns[] {
    title,
    links[] {
      name,
      linkType,
      openInNewTab,
      internalLink-> {
        _id,
        _type,
        title,
        slug {
          current
        }
      },
      externalLink
    }
  }
}`);

// Markets Query

export const MARKETS_QUERY = defineQuery(`*[
  _type == "market" && code == $code
] | order(title asc) {
  _id,
  title,
  code,
  languages[]-> {
    _id,
    title,
    code,
    isDefault
  }
}`);

// Person Query (for personalization features)

export const PERSON_QUERY = defineQuery(`*[
  _type == "person"
  && userId == $userId
][0] {
  _id,
  name,
  userId,
  profileImage,
  bookmarks[] {
    _key,
    reference-> {
      _id,
      _type,
      title,
      name,
      siteTitle,
      label
    },
    note
  },
  languages[]-> {
    _id,
    title,
    code,
    isDefault
  }
}`);
