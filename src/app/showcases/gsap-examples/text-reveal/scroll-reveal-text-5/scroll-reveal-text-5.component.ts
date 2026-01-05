import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-scroll-reveal-text-5',
  standalone: true,
  imports: [],
  templateUrl: './scroll-reveal-text-5.component.html',
  styleUrl: './scroll-reveal-text-5.component.scss',
})
export class ScrollRevealText5Component implements AfterViewInit, OnDestroy {
  @ViewChild('blockquote', { static: false }) blockquote!: ElementRef<HTMLElement>;
  @ViewChild('note', { static: false }) note!: ElementRef<HTMLElement>;
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
    }, 1000);
  }

  private initScrollAnimation(): void {
    console.log('Initializing ScrollRevealText5 animation');

    const el = this.blockquote.nativeElement;

    gsap.set(el, {
      opacity: 1,
      willChange: 'transform', // ← Add this
    });

    // Create a SplitText instance
    this.splitTextInstance = new SplitText(el, {
      type: 'lines,words',
      linesClass: 'ts-line',
    });

    console.log('Total words created:', this.splitTextInstance.words.length);

    // CRITICAL: Find the scrollable container
    const scrollContainer = document.querySelector('.content-container');

    if (!scrollContainer) {
      console.error('Scroll container (.content-container) not found!');
      return;
    }

    // Create the ScrollTrigger configuration for words animation
    const wordsScrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: this.container.nativeElement,
      scroller: scrollContainer,
      start: 'top 60%',
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => console.log('ScrollRevealText5 entered viewport'),
      onLeave: () => console.log('ScrollRevealText5 left viewport'),
    };

    // Create the ScrollTrigger configuration for note animation
    const noteScrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: this.container.nativeElement,
      scroller: scrollContainer,
      start: 'top 50%',
      scrub: 1,
      markers: false,
    };

    // If pinInPlace is enabled, add pin configuration
    if (this.pinInPlace) {
      wordsScrollTriggerConfig.pin = true;
      wordsScrollTriggerConfig.start = 'top top';
      wordsScrollTriggerConfig.end = '+=200%';
      wordsScrollTriggerConfig.anticipatePin = 2;
      wordsScrollTriggerConfig.pinReparent = true;

      // Note animation should also adjust when pinned
      noteScrollTriggerConfig.start = 'top top';
      noteScrollTriggerConfig.end = '+=200%';

      console.log('Pin in place enabled for ScrollRevealText5');
    } else {
      wordsScrollTriggerConfig.end = 'top 20%';
      noteScrollTriggerConfig.end = 'top 20%';
    }

    // Animate words entering on scroll
    gsap.from(this.splitTextInstance.words, {
      yPercent: 100,
      opacity: 0,
      duration: 0.6,
      ease: 'circ.out',
      stagger: 0.2,
      force3D: true,
      scrollTrigger: wordsScrollTriggerConfig,
    });

    // Fade in the note on the scroll
    gsap.from(this.note.nativeElement, {
      willChange: 'opacity',
      opacity: 0,
      duration: 1,
      ease: 'none',
      force3D: true,
      scrollTrigger: noteScrollTriggerConfig,
    });

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
