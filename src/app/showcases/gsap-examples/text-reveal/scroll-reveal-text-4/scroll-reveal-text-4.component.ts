import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-reveal-text-4',
  standalone: true,
  imports: [],
  templateUrl: './scroll-reveal-text-4.component.html',
  styleUrl: './scroll-reveal-text-4.component.scss',
})
export class ScrollRevealText4Component implements AfterViewInit, OnDestroy {
  @ViewChild('textElement', { static: false }) textElement!: ElementRef<HTMLElement>;
  @ViewChild('container', { static: false }) container!: ElementRef<HTMLElement>;

  // New input to enable pinning the view in place
  @Input() pinInPlace = false;

  private splitTextInstance: SplitText | null = null;

  constructor() {
    gsap.registerPlugin(SplitText, ScrollTrigger);
  }

  ngAfterViewInit(): void {
    // Wait longer to ensure a horizontal scroll section is fully initialized
    setTimeout(() => {
      this.initScrollAnimation();
    }, 800);
  }

  private initScrollAnimation(): void {
    const textEl = this.textElement.nativeElement;

    console.log('Initializing ScrollRevealText4 animation with word-breaking effect');

    // Set performance optimizations BEFORE animations
    gsap.set(textEl, {
      opacity: 1,
      willChange: 'transform', // ← Added for performance
    });

    // Create a SplitText instance with line masking - THIS IS KEY!
    this.splitTextInstance = new SplitText(textEl, {
      type: 'chars,words,lines',
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      mask: 'lines', // CRITICAL: This enables the line masking for a proper breaking effect
    });

    console.log('Total chars created:', this.splitTextInstance.chars.length);

    // CRITICAL: Find the scrollable container
    const scrollContainer = document.querySelector('.content-container');

    if (!scrollContainer) {
      console.error('Scroll container (.content-container) not found!');
      return;
    }

    // Create the ScrollTrigger configuration
    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: this.container.nativeElement,
      scroller: scrollContainer,
      start: 'top 60%',
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => console.log('ScrollRevealText4 entered viewport'),
      onLeave: () => console.log('ScrollRevealText4 left viewport'),
    };

    // If pinInPlace is enabled, add pin configuration
    if (this.pinInPlace) {
      scrollTriggerConfig.pin = true;
      scrollTriggerConfig.start = 'top top';
      scrollTriggerConfig.end = '+=200%';
      scrollTriggerConfig.anticipatePin = 2; // ← Changed from 1 to 2
      scrollTriggerConfig.pinReparent = true; // ← Added for stability

      console.log('Pin in place enabled for ScrollRevealText4');
    } else {
      scrollTriggerConfig.end = 'top 20%';
    }

    // Animate characters on a scroll with random breaking effect
    gsap.from(this.splitTextInstance.chars, {
      yPercent: gsap.utils.random([-100, 100], true), // Random vertical offset
      rotation: gsap.utils.random(-30, 30, true), // Random rotation
      autoAlpha: 0,
      ease: 'back.out(1.7)',
      force3D: true, // ← Added for GPU acceleration
      stagger: {
        amount: 0.8,
        from: 'random', // CRITICAL: Random stagger order creates the breaking effect
      },
      scrollTrigger: scrollTriggerConfig,
    });

    // Multiple refreshes at different intervals for stability
    setTimeout(() => ScrollTrigger.refresh(), 100);
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1000);
  }

  ngOnDestroy(): void {
    // Cleanup ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === this.container?.nativeElement) {
        trigger.kill();
      }
    });

    // Revert SplitText
    if (this.splitTextInstance) {
      this.splitTextInstance.revert();
    }
  }
}
