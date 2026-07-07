'use client';

import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap, HOUSE_EASE } from '@/lib/anim';

// GSAP "lift + spotlight" hover for the gallery plates. Replaces the old
// CSS wall-dim (which faded every OTHER tile): here only the hovered plate
// moves, lifting with an accent-keyed glow while the rest of the wall stays
// fully lit. One pair of delegated listeners on the grid, one paused,
// reversible timeline per card built lazily and cached on a WeakMap.
export function useCardSpotlight(gridRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      // Same gate as the paper-highlight effect: fine-pointer desktop only,
      // never under reduced motion. Touch/feed layouts keep the base CSS.
      if (
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(max-width: 720px)').matches
      ) {
        return;
      }

      const timelines = new WeakMap<Element, gsap.core.Timeline>();

      const timelineFor = (card: Element) => {
        let tl = timelines.get(card);
        if (tl) return tl;
        const frame = card.querySelector('.card-frame');
        if (!frame) return null;
        tl = gsap
          .timeline({ paused: true })
          .to(frame, { y: -8, scale: 1.02, duration: 0.4, ease: HOUSE_EASE }, 0)
          .to(card, { '--glow': 1, duration: 0.4, ease: HOUSE_EASE }, 0);
        timelines.set(card, tl);
        return tl;
      };

      // pointerover/out (and focusin/out) bubble, so one listener covers the
      // whole grid. Guard on relatedTarget so moving between a card's own
      // children never re-triggers the enter/leave.
      const enter = (target: EventTarget | null, related: EventTarget | null) => {
        const card = target instanceof Element ? target.closest('.card') : null;
        if (!card) return;
        if (related instanceof Node && card.contains(related)) return;
        timelineFor(card)?.play();
      };
      const leave = (target: EventTarget | null, related: EventTarget | null) => {
        const card = target instanceof Element ? target.closest('.card') : null;
        if (!card) return;
        if (related instanceof Node && card.contains(related)) return;
        timelineFor(card)?.reverse();
      };

      const onOver = (e: PointerEvent) => enter(e.target, e.relatedTarget);
      const onOut = (e: PointerEvent) => leave(e.target, e.relatedTarget);
      const onFocusIn = (e: FocusEvent) => enter(e.target, e.relatedTarget);
      const onFocusOut = (e: FocusEvent) => leave(e.target, e.relatedTarget);

      grid.addEventListener('pointerover', onOver);
      grid.addEventListener('pointerout', onOut);
      grid.addEventListener('focusin', onFocusIn);
      grid.addEventListener('focusout', onFocusOut);

      return () => {
        grid.removeEventListener('pointerover', onOver);
        grid.removeEventListener('pointerout', onOut);
        grid.removeEventListener('focusin', onFocusIn);
        grid.removeEventListener('focusout', onFocusOut);
      };
    },
    { scope: gridRef }
  );
}
