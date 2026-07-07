import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

// Only imported from 'use client' components. (ScrollTrigger left the
// bundle when the gallery entrance became a CSS scroll timeline.)
gsap.registerPlugin(Flip, CustomEase);

// The house easing used by every CSS transition in the project.
CustomEase.create('house', '0.22,1,0.36,1');

export const HOUSE_EASE = 'house';
export { gsap, Flip };
