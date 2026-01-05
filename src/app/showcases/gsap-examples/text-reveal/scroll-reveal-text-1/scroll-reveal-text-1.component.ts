import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-reveal-text-1',
  templateUrl: './scroll-reveal-text-1.component.html',
  styleUrls: ['./scroll-reveal-text-1.component.scss'],
  standalone: true,
})
export class ScrollRevealText1Component implements AfterViewInit, OnDestroy {
  @ViewChild('revealText', { static: false }) revealText!: ElementRef;
  @ViewChild('container', { static: false }) container!: ElementRef;

  // New input to enable pinning the view in place
  @Input() pinInPlace = false;

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    // Wait longer to ensure a horizontal scroll section is fully initialized
    setTimeout(() => {
      this.initScrollAnimation();
    }, 800);
  }

  private initScrollAnimation(): void {
    const textElement = this.revealText.nativeElement;
    const content = textElement.textContent || '';

    console.log('Original text:', content);

    // Split text into words wrapped in spans
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word: any) => word.length > 0);

    textElement.innerHTML = words
      .map((word: string) => `<span class="word">${word}</span>`)
      .join(' ');

    const wordElements = textElement.querySelectorAll('.word');

    console.log('Total words created:', wordElements.length);

    // CRITICAL: Find the scrollable container
    const scrollContainer = document.querySelector('.content-container');

    if (!scrollContainer) {
      console.error('Scroll container (.content-container) not found!');
      return;
    }

    // Set initial state for words with performance hints
    gsap.set(wordElements, {
      opacity: 0.3,
      filter: 'blur(10px)',
      willChange: 'opacity, filter', // ← Added for performance
      force3D: true, // ← Added for GPU acceleration
    });

    // Create the ScrollTrigger configuration
    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: this.container.nativeElement,
      scroller: scrollContainer,
      start: 'top 80%',
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => console.log('ScrollRevealText entered viewport'),
      onLeave: () => console.log('ScrollRevealText left viewport'),
    };

    // If pinInPlace is enabled, add pin configuration similar to HorizontalScrollSectionComponent
    if (this.pinInPlace) {
      scrollTriggerConfig.pin = true;
      scrollTriggerConfig.start = 'top top';
      scrollTriggerConfig.end = '+=200%'; // Extend the scroll distance for the animation
      scrollTriggerConfig.anticipatePin = 2; // ← Changed from 1 to 2
      scrollTriggerConfig.pinReparent = true; // ← Added for stability

      console.log('Pin in place enabled for ScrollRevealText');
    } else {
      scrollTriggerConfig.end = 'top 30%';
    }

    // Animate words to reveal
    gsap.to(wordElements, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.05,
      ease: 'power2.out',
      force3D: true, // ← Added for GPU acceleration
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
  }
}
