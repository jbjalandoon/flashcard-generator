"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { Card as CardComponent } from "~/components/ui/card";

export function Card({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <CarouselItem>
      <CardComponent
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl px-5"
        onClick={() => setFlipped((prev) => !prev)}
      >
        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute flex h-full w-full flex-col items-center justify-center gap-3"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-muted-foreground text-lg">Question</span>
            <span className="text-2xl">{question}</span>
          </div>
          <div
            className="absolute flex h-full w-full flex-col items-center justify-center gap-3"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-muted-foreground text-lg">Answer</span>
            <span className="text-2xl">{answer}</span>
          </div>
        </div>
        {/* <span className="text-muted-foreground text-lg">
          {!flipped ? "Question" : "Answer"}
        </span>
        <span className="text-2xl">{!flipped ? question : answer}</span> */}
      </CardComponent>
    </CarouselItem>
  );
}

export function Cards({
  cards,
}: {
  cards: {
    question: string;
    answer: string;
    id: number;
    flashcardId: number;
  }[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi}>
      <CarouselContent className="h-85 text-center select-none">
        {cards.map((el) => (
          <Card
            key={`${el.flashcardId}-${el.id}`}
            question={el.question}
            answer={el.answer}
          />
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden cursor-pointer sm:inline-flex" />
      <CarouselNext className="hidden cursor-pointer sm:inline-flex" />
      <div className="text-muted-foreground py-2 text-center text-sm">
        Slide {current} of {count}
      </div>
    </Carousel>
  );
}
