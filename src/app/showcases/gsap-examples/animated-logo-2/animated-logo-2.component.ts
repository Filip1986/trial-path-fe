import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  signal,
  WritableSignal,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export type ThicknessLevel = 'thin' | 'medium' | 'thick';

@Component({
  selector: 'app-animated-logo-2',
  standalone: true,
  imports: [],
  templateUrl: './animated-logo-2.component.html',
  styleUrl: './animated-logo-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedLogo2Component implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('svgElement', { static: false }) svgElement!: ElementRef<SVGSVGElement>;
  @ViewChild('revealPath', { static: false }) revealPath!: ElementRef<SVGPathElement>;

  // Configurable inputs
  @Input() size = 50; // Size in pixels
  @Input() color: string | null = null; // Stroke color (null = use CSS variable)
  @Input() thickness: ThicknessLevel = 'medium'; // Thickness level

  // Animation state
  animationState: WritableSignal<'idle' | 'animating' | 'complete'> = signal('idle');

  private timeline: gsap.core.Timeline | null = null;

  // Thickness mapping
  private readonly thicknessMap: Record<ThicknessLevel, number> = {
    thin: 6,
    medium: 10,
    thick: 14,
  };

  /**
   * Get the computed color value (either from Input or CSS variable)
   */
  get computedColor(): string {
    // If color input is provided, use it
    if (this.color) {
      return this.color;
    }

    // Otherwise, use CSS variable
    return 'var(--primary-color)';
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If any inputs change after initialization, restart animation with new values
    if (
      (changes['size'] || changes['color'] || changes['thickness']) &&
      !changes['size']?.firstChange
    ) {
      this.restartAnimation();
    }
  }

  ngAfterViewInit(): void {
    this.initializeAnimation();
  }

  ngOnDestroy(): void {
    this.cleanupAnimation();
  }

  /**
   * Get the stroke width based on thickness level
   */
  get strokeWidth(): number {
    return this.thicknessMap[this.thickness];
  }

  /**
   * Initialize the GSAP animation timeline with continuous looping for inner path only
   */
  private initializeAnimation(): void {
    if (!this.svgElement || !this.revealPath) {
      console.warn('AnimatedLogo2Component: Required elements not found');
      return;
    }

    this.animationState.set('animating');

    // Set initial SVG visibility
    gsap.set(this.svgElement.nativeElement, { autoAlpha: 1 });

    // Create timeline for the reveal path with infinite repeat
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
   * Restart animation with updated values
   */
  private restartAnimation(): void {
    this.cleanupAnimation();
    if (this.svgElement && this.revealPath) {
      // Small delay to ensure DOM is updated
      setTimeout(() => this.initializeAnimation(), 0);
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
