import { Component, ElementRef, ViewChild } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-scroll-animation-1',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './scroll-animation-1.component.html',
  styleUrl: './scroll-animation-1.component.scss',
})
export class ScrollAnimation1Component {
  @ViewChild('horizontalSection', { static: false }) horizontalSection!: ElementRef;
  @ViewChild('cardsWrapper', { static: false }) cardsWrapper!: ElementRef;

  private scrollTriggerInstances: ScrollTrigger[] = [];
  private resizeTimeout: any;

  featureCardsData: FeatureCard[] = [
    {
      icon: '🚀',
      title: 'Fast Setup',
      description:
        'Get started in minutes with our intuitive onboarding process and comprehensive documentation.',
      features: ['One-click deployment', 'Pre-configured templates', 'Step-by-step guides'],
    },
    {
      icon: '🎯',
      title: 'Smart Analytics',
      description:
        'Track user behavior and optimize your trial conversion with powerful analytics tools.',
      features: ['Real-time dashboards', 'Custom event tracking', 'Conversion insights'],
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description:
        'Bank-level security with SOC 2 compliance and end-to-end encryption for your peace of mind.',
      features: ['256-bit encryption', 'SOC 2 Type II certified', 'GDPR compliant'],
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description:
        'Optimized for speed with CDN delivery and edge computing for global performance.',
      features: ['99.99% uptime SLA', 'Global CDN network', 'Sub-100ms response'],
    },
    {
      icon: '🎨',
      title: 'Customizable',
      description:
        'Tailor every aspect to match your brand with our flexible theming and white-label options.',
      features: ['Custom branding', 'White-label ready', 'API-first design'],
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description:
        'Our dedicated support team is always here to help you succeed with expert guidance.',
      features: ['Live chat support', 'Video tutorials', 'Community forum'],
    },
  ];

  ngAfterViewInit(): void {
    // Initialize horizontal scroll animation
    this.initHorizontalScroll();

    // Add resize listener
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    // Clean up all ScrollTriggers
    this.scrollTriggerInstances.forEach((trigger) => trigger.kill());
    this.scrollTriggerInstances = [];

    // Kill any remaining ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Remove resize listener
    window.removeEventListener('resize', this.handleResize);

    // Clear resize timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  private initHorizontalScroll(): void {
    if (!this.horizontalSection || !this.cardsWrapper) {
      console.warn('Horizontal section elements not found');
      return;
    }

    // Wait for the layout to settle
    setTimeout(() => {
      const wrapper = this.cardsWrapper.nativeElement as HTMLElement;
      const section = this.horizontalSection.nativeElement as HTMLElement;

      // CRITICAL: Find the scrollable container
      const scrollContainer = document.querySelector('.content-body');

      if (!scrollContainer) {
        console.error('Scroll container (.content-body) not found!');
        return;
      }

      // Calculate scroll distance based on wrapper width
      const getScrollAmount = () => {
        const wrapperWidth = wrapper.scrollWidth;
        const containerWidth = scrollContainer.clientWidth;
        return -(wrapperWidth - containerWidth);
      };

      console.log('Horizontal Scroll Setup:', {
        scrollContainer: scrollContainer,
        sectionHeight: section.offsetHeight,
        wrapperWidth: wrapper.scrollWidth,
        containerWidth: scrollContainer.clientWidth,
        scrollAmount: getScrollAmount(),
      });

      // Kill any existing ScrollTriggers on this element
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) {
          st.kill();
        }
      });

      // Create the horizontal scroll animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top', // Start when section top hits container top
          end: () => `+=${Math.abs(getScrollAmount())}`, // Dynamic end based on content width
          scroller: scrollContainer, // CRITICAL: Use .content-body as scroller
          scrub: 1, // Smooth scrubbing with 1 second lag
          pin: true, // Pin the section while scrolling
          pinSpacing: true, // Add spacing for pinned element
          anticipatePin: 1, // Prevent jump on pin
          invalidateOnRefresh: true, // Recalculate on resize
          markers: false, // Set to true for debugging
          id: 'horizontal-scroll',
        },
        defaults: { ease: 'none' }, // CRITICAL for smooth constant speed
      });

      // Animate the wrapper moving to the left
      tl.to(wrapper, {
        x: getScrollAmount,
        ease: 'none',
      });

      // Store ScrollTrigger instance
      if (tl.scrollTrigger) {
        this.scrollTriggerInstances.push(tl.scrollTrigger);
      }

      // Single refresh after initialization
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 100);
  }

  private handleResize = (): void => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  };
}
