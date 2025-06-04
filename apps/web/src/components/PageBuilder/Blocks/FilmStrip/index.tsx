import React from "react";
import Container from "@/Primitives/Container";
import { FilmStrip as FilmStripType } from "types/sanity";

import Card from "./Card";

export default function FilmStrip({ cards }: FilmStripType) {
  if (cards.length === 0) return null;

  return (
    <Container className="flex gap-4 overflow-x-auto py-12 lg:justify-center">
      {cards.map((card) => (
        <Card key={card._key} card={card} />
      ))}
    </Container>
  );
}
