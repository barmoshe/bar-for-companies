import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

// Only imported from 'use client' components.
gsap.registerPlugin(Flip, ScrollTrigger, CustomEase);

// The house easing used by every CSS transition in the project.
CustomEase.create('house', '0.22,1,0.36,1');

export const HOUSE_EASE = 'house';
export { gsap, Flip, ScrollTrigger };
