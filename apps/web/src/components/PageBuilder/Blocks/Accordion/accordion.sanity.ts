import { groq } from "next-sanity";

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
