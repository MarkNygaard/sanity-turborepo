"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

import { cn } from "@repo/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";

interface CategoryColumn {
  title?: string;
  links: {
    name: string;
    href: string;
    target?: string;
  }[];
}

interface CategoryData {
  label: string;
  columns: CategoryColumn[];
}

interface Props {
  category: CategoryData;
}

export default function CategoryPopover({ category }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={triggerRef}
          onPointerEnter={() => setOpen(true)}
          onMouseLeave={() => {
            setOpen(false);
            triggerRef.current?.blur();
          }}
          className={cn(
            "cursor-pointer px-3 font-semibold hover:text-gray-700",
            "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black",
            "no-focus-ring",
          )}
        >
          <span className="border-b-2 border-transparent py-1 transition-all hover:border-black">
            {category.label}
          </span>
        </PopoverTrigger>

        <AnimatePresence>
          {open && (
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={0}
              className="z-50 w-screen !max-w-none translate-y-2 border-0 p-0 py-6 shadow-none"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              forceMount
            >
              {/* Hover bridge to clear the gap between button and content */}
              <div className="pointer-events-auto absolute left-0 top-[-8px] h-2 w-full bg-transparent" />

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="overflow-hidden bg-white"
              >
                <div className="relative mx-auto flex w-full max-w-5xl grid-cols-1 justify-center gap-6 p-6">
                  {category.columns.map((col, index) => (
                    <div
                      key={`${col.title ?? "column"}-${index}`}
                      className="min-w-[220px]"
                    >
                      {col.title && (
                        <h3 className="mb-2 text-sm font-bold text-gray-900">
                          {col.title}
                        </h3>
                      )}
                      <ul className="space-y-1">
                        {col.links.map((link, linkIndex) => (
                          <li key={`${link.name}-${linkIndex}`}>
                            <Link
                              href={link.href}
                              target={link.target}
                              rel={
                                link.target === "_blank"
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="text-gray-500 hover:text-black"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>

      {/* Overlay */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-40 bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
