import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function MaskCard() {
  const items = [
  {
    title: "The Strategists",
    image: "/9.png",
    className: "absolute top-10 left-[5%] rotate-[-5deg]",
  },
  {
    title: "The Hidden Thinkers",
    image: "/10.png",
    className: "absolute top-40 left-[20%] rotate-[-7deg]",
  },
  {
    title: "The Free Spirits",
    image: "/8.png",
    className: "absolute top-5 left-[35%] rotate-[8deg]",
  },
  {
    title: "The Restless Minds",
    image: "/7.png",
    className: "absolute top-32 left-[50%] rotate-[10deg]",
  },
  {
    title: "The Healing Hearts",
    image: "/11.png",
    className: "absolute top-20 left-[65%] rotate-[2deg]",
  },
  {
    title: "The Soul-Aligned",
    image: "/12.png",
    className: "absolute top-24 left-[80%] rotate-[-7deg]",
  },
];
  return (
    <DraggableCardContainer className="h-full flex w-full items-center justify-center">
      {items.map((item, index) => (
        <DraggableCardBody key={index} className={item.className}>
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none h-80 w-80 object-cover"
          />
          <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
