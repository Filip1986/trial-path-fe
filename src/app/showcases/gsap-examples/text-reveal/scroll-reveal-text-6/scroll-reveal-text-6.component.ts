import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-reveal-text-6',
  standalone: true,
  imports: [],
  templateUrl: './scroll-reveal-text-6.component.html',
  styleUrl: './scroll-reveal-text-6.component.scss',
})
export class ScrollRevealText6Component implements AfterViewInit, OnDestroy {
  @ViewChild('quote', { static: false }) quoteElement!: ElementRef<HTMLElement>;
  @ViewChild('decoys', { static: false }) decoysElement!: ElementRef<HTMLElement>;
  @ViewChild('container', { static: false }) container!: ElementRef<HTMLElement>;

  // Input to enable pinning the view in place
  @Input() pinInPlace = false;

  private quoteSplit: SplitText | null = null;
  private decoySplit: SplitText | null = null;
  private timeline: gsap.core.Timeline | null = null;

  constructor() {
    gsap.registerPlugin(SplitText, ScrollTrigger);
  }

  ngAfterViewInit(): void {
    // Wait for fonts to load and for potential horizontal scroll sections to initialize
    document.fonts.ready.then(() => {
      setTimeout(() => {
        this.initAnimation();
      }, 1000);
    });
  }

  private initAnimation(): void {
    console.log('Initializing ScrollRevealText6 animation');

    const quote = this.quoteElement.nativeElement;
    const decoy = this.decoysElement.nativeElement;

    // Create SplitText instances
    this.quoteSplit = new SplitText(quote, { type: 'words' });
    this.decoySplit = new SplitText(decoy, { type: 'words' });

    // Combine all words
    const allWords = [...this.quoteSplit.words, ...this.decoySplit.words];

    // Set initial styles - all words start invisible
    gsap.set([quote, decoy], { visibility: 'visible' });
    gsap.set(allWords, {
      boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.8)',
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
      force3D: true,
      autoAlpha: 0,
      scale: 0.5,
    });

    // Find the scrollable container
    const scrollContainer = document.querySelector('.content-container');

    if (!scrollContainer) {
      console.error('Scroll container (.content-container) not found!');
      return;
    }

    // Track occupied positions to prevent overlap
    const occupiedPositions: Array<{ x: number; y: number; width: number; height: number }> = [];
    const minDistance = 100; // Minimum distance between word centers

    // Helper function to check if position overlaps with existing words
    const isPositionValid = (x: number, y: number, width: number, height: number): boolean => {
      for (const pos of occupiedPositions) {
        const distanceX = Math.abs(x - pos.x);
        const distanceY = Math.abs(y - pos.y);
        const minDistanceX = (width + pos.width) / 2 + 20; // Add padding
        const minDistanceY = (height + pos.height) / 2 + 20; // Add padding

        if (distanceX < minDistanceX && distanceY < minDistanceY) {
          return false; // Overlap detected
        }
      }
      return true;
    };

    // Helper function to find a valid non-overlapping position
    const findValidPosition = (
      minX: number,
      maxX: number,
      minY: number,
      maxY: number,
      wordElement: HTMLElement,
    ): { x: number; y: number } => {
      const wordWidth = wordElement.offsetWidth || 80;
      const wordHeight = wordElement.offsetHeight || 30;
      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        const x = this.randomInteger(minX, maxX);
        const y = this.randomInteger(minY, maxY);

        if (isPositionValid(x, y, wordWidth, wordHeight)) {
          occupiedPositions.push({ x, y, width: wordWidth, height: wordHeight });
          return { x, y };
        }
        attempts++;
      }

      // Fallback: return position anyway but mark it as occupied
      const x = this.randomInteger(minX, maxX);
      const y = this.randomInteger(minY, maxY);
      occupiedPositions.push({ x, y, width: wordWidth || 80, height: wordHeight || 30 });
      return { x, y };
    };

    // Create the ScrollTrigger configuration
    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: this.container.nativeElement,
      scroller: scrollContainer,
      start: 'top 80%',
      scrub: 1, // Enable scrubbing - animation follows scroll position
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => console.log('ScrollRevealText6 entered viewport'),
      onLeave: () => console.log('ScrollRevealText6 left viewport'),
    };

    // If pinInPlace is enabled, add pin configuration
    if (this.pinInPlace) {
      scrollTriggerConfig.pin = true;
      scrollTriggerConfig.start = 'top top';
      scrollTriggerConfig.end = '+=300%'; // Extended for two-part animation
      scrollTriggerConfig.anticipatePin = 2;
      scrollTriggerConfig.pinReparent = true;

      console.log('Pin in place enabled for ScrollRevealText6');
    } else {
      scrollTriggerConfig.end = 'top 20%';
    }

    // Create timeline with ScrollTrigger
    this.timeline = gsap.timeline({
      scrollTrigger: scrollTriggerConfig,
    });

    // PART 1: All words fly in from random positions and form a shuffled pile
    // Animate decoy words flying in - more spread out
    this.decoySplit.words.forEach((word) => {
      const startX = this.randomInteger(-500, 500);
      const startY = this.randomInteger(-400, 400);
      const startRotation = this.randomInteger(-180, 180);
      const finalPosition = findValidPosition(-250, 250, -150, 150, word as HTMLElement);
      const finalRotation = this.randomInteger(-40, 40);

      this.timeline!.to(
        word,
        {
          x: finalPosition.x,
          y: finalPosition.y,
          rotation: finalRotation,
          autoAlpha: 1,
          scale: 1,
          ease: 'power2.out',
          force3D: true,
        },
        Math.random() * 0.5, // Stagger start times randomly
      );
    });

    // Animate quote words flying in - clustered together in a smaller region
    this.quoteSplit.words.forEach((word) => {
      const startX = this.randomInteger(-500, 500);
      const startY = this.randomInteger(-400, 400);
      const startRotation = this.randomInteger(-180, 180);
      // Quote words end up in a tighter cluster (smaller range)
      const finalPosition = findValidPosition(-80, 80, -40, 40, word as HTMLElement);
      const finalRotation = this.randomInteger(-15, 15);

      this.timeline!.to(
        word,
        {
          x: finalPosition.x,
          y: finalPosition.y,
          rotation: finalRotation,
          autoAlpha: 1,
          scale: 1,
          ease: 'power2.out',
          force3D: true,
        },
        Math.random() * 0.5, // Stagger start times randomly
      );
    });

    // Add a label for the shuffled state
    this.timeline!.addLabel('shuffled', '+=0.3');

    // PART 2: Extract quote words and move them above the shuffled pile
    // Calculate actual widths of all quote words for perfect centering
    const quoteWordWidths: number[] = [];
    let totalQuoteWidth = 0;

    this.quoteSplit.words.forEach((word) => {
      const wordElement = word as HTMLElement;
      const wordWidth = wordElement.offsetWidth || 80;
      quoteWordWidths.push(wordWidth);
      totalQuoteWidth += wordWidth;
    });

    // Add spacing between words (10px per gap)
    const spacing = 10;
    const totalSpacing = (this.quoteSplit.words.length - 1) * spacing;
    const totalLineWidth = totalQuoteWidth + totalSpacing;

    // Calculate starting X position to center the entire line
    // Start from the left edge of the centered line
    let currentX = -totalLineWidth / 2;

    this.quoteSplit.words.forEach((word, i) => {
      const wordWidth = quoteWordWidths[i];
      // targetX should be at the LEFT edge of where the word starts, not center
      // GSAP transforms are relative to the element's own center by default
      const targetX = currentX;
      const targetY = -150; // Position above the shuffled words

      // Animate quote word moving up and settling into position
      this.timeline!.to(
        word,
        {
          x: targetX,
          y: targetY,
          rotation: this.randomInteger(-3, 3), // Slight rotation for natural look
          scale: 1.1, // Slightly larger to emphasize
          ease: 'power2.inOut',
          force3D: true,
        },
        `shuffled+=${i * 0.08}`, // Stagger the extraction
      );

      // Move to next word position (current word width + spacing)
      currentX += wordWidth + spacing;
    });

    // Optional: Slightly fade down the decoy words to emphasize the quote
    this.timeline!.to(
      this.decoySplit.words,
      {
        autoAlpha: 0.5,
        scale: 0.9,
        ease: 'power2.inOut',
      },
      'shuffled+=0.5',
    );

    // Multiple refreshes at different intervals for stability
    setTimeout(() => ScrollTrigger.refresh(), 100);
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1000);
  }

  private randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (1 + max - min) + min);
  }

  ngOnDestroy(): void {
    // Cleanup ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === this.container?.nativeElement) {
        trigger.kill();
      }
    });

    // Kill timeline
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    // Revert SplitText changes
    if (this.quoteSplit) {
      this.quoteSplit.revert();
      this.quoteSplit = null;
    }

    if (this.decoySplit) {
      this.decoySplit.revert();
      this.decoySplit = null;
    }
  }
}
