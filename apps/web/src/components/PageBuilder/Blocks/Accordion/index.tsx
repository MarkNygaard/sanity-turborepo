import type { Accordion as AccordionType } from "types/sanity";
import React from "react";
import Container from "@/Primitives/Container";
import PrimitiveText from "@/Primitives/Text";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion as UIAccordion,
} from "@repo/ui/accordion";

interface AccordionProps extends AccordionType {
  isDraftMode?: boolean;
}

export default function Accordion({
  panels,
  isDraftMode = false,
}: AccordionProps) {
  if (!panels || panels.length === 0) return null;

  return (
    <Container className="max-w-7xl py-12">
      <UIAccordion type="single" collapsible>
        {panels.map((item) => (
          <AccordionItem key={item._key} value={item._key}>
            <AccordionTrigger>{item.label}</AccordionTrigger>
            <AccordionContent>
              <PrimitiveText content={item.content} isDraftMode={isDraftMode} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </UIAccordion>
    </Container>
  );
}
