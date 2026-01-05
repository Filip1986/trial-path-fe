import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
} from '@angular/core';

import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

@Component({
  selector: 'app-animated-logo-1',
  standalone: true,
  imports: [],
  templateUrl: './animated-logo-1.component.html',
  styleUrl: './animated-logo-1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedLogo1Component implements AfterViewInit, OnDestroy {
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGSVGElement>;
  @ViewChild('logoPath', { static: false }) logoPath!: ElementRef<SVGPathElement>;
  @ViewChild('revealPath', { static: false }) revealPath!: ElementRef<SVGPathElement>;

  // Animation state
  animationState: WritableSignal<'idle' | 'animating' | 'complete'> = signal('idle');

  private timeline: gsap.core.Timeline | null = null;

  ngAfterViewInit(): void {
    this.initializeAnimation();
  }

  ngOnDestroy(): void {
    this.cleanupAnimation();
  }

  /**
   * Initialize the GSAP animation timeline with continuous looping for inner path only
   */
  private initializeAnimation(): void {
    if (!this.svgElement || !this.logoPath || !this.revealPath) {
      console.warn('AnimatedLogo1Component: Required elements not found');
      return;
    }

    this.animationState.set('animating');

    // Set initial SVG visibility
    gsap.set(this.svgElement.nativeElement, { autoAlpha: 1 });

    // Animate logo fade-in once (no repeat)
    gsap.from(this.logoPath.nativeElement, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
    });

    // Create separate timeline for the inner reveal path with infinite repeat
    this.timeline = gsap.timeline({
      repeat: -1, // -1 means infinite loop
      repeatDelay: 0.5, // Optional: add a small delay between loops
    });

    // Animate reveal path with DrawSVG on loop
    this.timeline.from(this.revealPath.nativeElement, {
      drawSVG: '0%',
      duration: 1.5,
      ease: 'power2.inOut',
    });
  }

  /**
   * Clean up GSAP animations and timelines
   */
  private cleanupAnimation(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }

  /**
   * Replay the animation (optional public method)
   */
  replayAnimation(): void {
    if (this.timeline) {
      this.animationState.set('animating');
      this.timeline.restart();
    }
  }
}
