"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

// SVG arrow helper function used to render next and previous carousel navigation icons
function ArrowIcon({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      {direction === "left" ? (
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 5.5 16 12l-6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

// Carousel wrapper component using Embla for smooth responsive card swiping
export default function VehicleCarousel({
  items,
  renderItem,
  autoplayDelay = 2400,
  onReachEnd,
  hasMore = false,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
    skipSnaps: false,
  });
  const [isInteracting, setIsInteracting] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const autoplayDirectionRef = useRef(1);

  // Checks and updates button states matching Embla pagination limits
  const updateScrollability = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Syncs navigation state checkers on active slider snaps or page loads
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateScrollability);
    emblaApi.on("reInit", updateScrollability);
    updateScrollability();
    return () => {
      emblaApi.off("select", updateScrollability);
      emblaApi.off("reInit", updateScrollability);
    };
  }, [emblaApi, updateScrollability, items]);

  // Slides carousel one index backward on arrow action click
  const scrollPrev = useCallback(() => {
    setIsInteracting(true);
    autoplayDirectionRef.current = -1;
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  // Slides carousel one index forward on arrow action click
  const scrollNext = useCallback(() => {
    setIsInteracting(true);
    autoplayDirectionRef.current = 1;
    emblaApi?.scrollNext();
  }, [emblaApi]);

  // Mouse wheel interceptor translating horizontal swipes into Embla movements
  const handleWheel = useCallback(
    (event) => {
      if (!emblaApi) return;

      // Allow default vertical scrolling (top-to-bottom)
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;

      // Handle horizontal trackpad swipe
      event.preventDefault();

      if (event.deltaX > 0) {
        emblaApi.scrollNext();
      } else if (event.deltaX < 0) {
        emblaApi.scrollPrev();
      }
    },
    [emblaApi],
  );

  // Appends trackpad wheel listeners to Embla root DOM elements
  useEffect(() => {
    if (!emblaApi) return undefined;

    const rootNode = emblaApi.rootNode();
    rootNode.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      rootNode.removeEventListener("wheel", handleWheel);
    };
  }, [emblaApi, handleWheel]);

  // Evaluates reach-end limits to trigger paginated data loading calls
  useEffect(() => {
    if (!emblaApi) return;

    const checkEnd = () => {
      if (!emblaApi.canScrollNext() && onReachEnd) {
        onReachEnd();
      }
    };

    emblaApi.on("select", checkEnd);

    return () => {
      emblaApi.off("select", checkEnd);
    };
  }, [emblaApi, onReachEnd]);

  // Stops automated page shifts if user clicks/holds carousel slides
  useEffect(() => {
    if (!emblaApi) return;
    const stopAutoplay = () => setIsInteracting(true);
    emblaApi.on("pointerDown", stopAutoplay);
    return () => {
      emblaApi.off("pointerDown", stopAutoplay);
    };
  }, [emblaApi]);

  // Controls automated slider looping offsets periodically
  useEffect(() => {
    if (!emblaApi || isInteracting) return undefined;

    const id = window.setInterval(() => {
      const currentIndex = emblaApi.selectedScrollSnap();
      
      // Automatic slider loops back to the start (index 0) after showing 8 records (index 7)
      if (currentIndex >= 7 || !emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0);
      } else {
        emblaApi.scrollNext();
      }
    }, autoplayDelay);

    return () => window.clearInterval(id);
  }, [emblaApi, isInteracting, autoplayDelay]);

  return (
    <div className="ok-home-carousel-shell">
      {canScrollPrev && (
        <button
          type="button"
          className="ok-home-carousel__btn ok-home-carousel__btn--left"
          onClick={scrollPrev}
          aria-label="Previous cards"
        >
          <ArrowIcon direction="left" />
        </button>
      )}

      <div
        className="ok-home-carousel"
        ref={emblaRef}
        onMouseDown={() => setIsInteracting(true)}
        onTouchStart={() => setIsInteracting(true)}
      >
        <div className="ok-home-carousel__track">
          {items.map((item) => (
            <div key={item.id} className="ok-home-carousel__slide">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {(canScrollNext || hasMore) && (
        <button
          type="button"
          className="ok-home-carousel__btn ok-home-carousel__btn--right"
          onClick={scrollNext}
          aria-label="Next cards"
        >
          <ArrowIcon direction="right" />
        </button>
      )}
    </div>
  );
}
