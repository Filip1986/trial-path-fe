import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-reveal-text-2',
  standalone: true,
  imports: [],
  templateUrl: './scroll-reveal-text-2.component.html',
  styleUrl: './scroll-reveal-text-2.component.scss',
})
export class ScrollRevealText2Component implements AfterViewInit, OnDestroy {
  @ViewChild('splitText', { static: false }) splitTextElement!: ElementRef<HTMLElement>;
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
    const textElement = this.splitTextElement.nativeElement;

    console.log('Initializing ScrollRevealText2 animation');

    // Set performance optimizations BEFORE animations
    gsap.set(textElement, {
      opacity: 1,
      willChange: 'transform', // ← Added for performance
    });

    // Create a SplitText instance with configuration
    this.splitTextInstance = new SplitText(textElement, {
      type: 'words,lines',
      linesClass: 'line',
    });

    console.log('Total lines created:', this.splitTextInstance.lines.length);

    // CRITICAL: Find the scrollable container
    const scrollContainer = document.querySelector('.content-container');

    if (!scrollContainer) {
      console.error('Scroll container (.content-container) not found!');
      return;
    }

    console.log('Scroll container found:', scrollContainer);

    // Set initial state - KEEP THEM HIDDEN with performance hints
    gsap.set(this.splitTextInstance.lines, {
      yPercent: 20,
      opacity: 0,
      willChange: 'transform, opacity',
      force3D: true, // ← Added for GPU acceleration
    });

    // Important: Refresh ScrollTrigger first to account for any pinned sections above
    ScrollTrigger.refresh();

    if (this.pinInPlace) {
      // When pinInPlace is true, animate all lines together in a pinned section
      console.log('Pin in place enabled for ScrollRevealText2');

      gsap.to(this.splitTextInstance.lines, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out',
        force3D: true, // ← Added for GPU acceleration
        scrollTrigger: {
          trigger: this.container.nativeElement,
          scroller: scrollContainer,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 2, // ← Changed from 1 to 2
          pinReparent: true, // ← Added for stability
          markers: false,
          invalidateOnRefresh: true,
          onEnter: () => console.log('ScrollRevealText2 (pinned) entered viewport'),
          onLeave: () => console.log('ScrollRevealText2 (pinned) left viewport'),
        },
      });
    } else {
      // Original behavior: Animate each line individually on scroll
      this.splitTextInstance.lines.forEach((line: Element, index: number) => {
        ScrollTrigger.create({
          trigger: line,
          scroller: scrollContainer,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1,
          markers: false, // Set to true to debug
          id: `line-${index}`,
          invalidateOnRefresh: true, // ← Added for better recalculation
          onUpdate: (self) => {
            // Manually animate yPercent and opacity based on progress
            // Add a small slide up effect (from 20% down to 0%)
            const slideAmount = 30;
            gsap.to(line, {
              yPercent: slideAmount - slideAmount * self.progress,
              opacity: self.progress,
              duration: 0.1,
              ease: 'power2.out',
              overwrite: true,
              force3D: true, // ← Added for GPU acceleration
            });

            if (index === 0 && self.progress > 0) {
              console.log(`First line progress: ${self.progress.toFixed(2)}`);
            }
          },
          onEnter: () => console.log(`Line ${index} entered`),
        });
      });
    }

    // Force multiple refreshes after creating all triggers
    setTimeout(() => {
      ScrollTrigger.refresh();
      console.log('ScrollTrigger refreshed, total triggers:', ScrollTrigger.getAll().length);
    }, 100);

    // Additional refreshes for stability
    setTimeout(() => ScrollTrigger.refresh(), 500);
    setTimeout(() => ScrollTrigger.refresh(), 1000);
  }

  ngOnDestroy(): void {
    // Clean up ScrollTrigger instances
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Revert SplitText changes
    if (this.splitTextInstance) {
      this.splitTextInstance.revert();
      this.splitTextInstance = null;
    }
  }
}
