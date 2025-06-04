import type { Button as ButtonType, Page } from "types/sanity";
import React from "react";
import Link from "next/link";

import { cn } from "@repo/ui";
import { Button } from "@repo/ui/button";

interface SanityButtonsProps {
  data: ButtonType[] | undefined;
  className?: string;
  isDraftMode?: boolean;
}

export default function SanityButtons({ data, className }: SanityButtonsProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {data.map((button, index) => {
        const internalLink = button.internalLink as Page | undefined;
        const href =
          button.linkType === "internal" && internalLink?.slug.current
            ? `/${internalLink.slug.current}`
            : button.externalLink;

        return (
          <Button
            key={index}
            variant={button.variant ?? "default"}
            className={className}
            asChild
          >
            <Link
              href={href ?? "/"}
              target={button.openInNewTab ? "_blank" : undefined}
              rel={button.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {button.text}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

{
  /* <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
  {content.buttons.map((cta, index) => {
    const href =
      cta.linkType === "internal" && cta.internalLink
        ? `/${cta.internalLink._ref}`
        : cta.externalLink;

    return (
      <Button variant="cta" key={index}>
        <Link href={href ?? "#"} className="text-lg">
          {cta.label}
        </Link>
      </Button>
    );
  })}
</div>; */
}
