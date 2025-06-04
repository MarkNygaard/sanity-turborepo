import { groq } from "next-sanity";

import { pageBuilderFragment } from "../../../../components/PageBuilder/pageBuilder.sanity";

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
