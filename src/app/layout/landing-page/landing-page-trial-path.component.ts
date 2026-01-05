import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealText1Component } from '../../showcases/gsap-examples/text-reveal/scroll-reveal-text-1/scroll-reveal-text-1.component';
import { ScrollRevealText2Component } from '../../showcases/gsap-examples/text-reveal/scroll-reveal-text-2/scroll-reveal-text-2.component';
import { ScrollRevealText3Component } from '../../showcases/gsap-examples/text-reveal/scroll-reveal-text-3/scroll-reveal-text-3.component';
import { ScrollRevealText4Component } from '../../showcases/gsap-examples/text-reveal/scroll-reveal-text-4/scroll-reveal-text-4.component';
import { ScrollRevealText5Component } from '../../showcases/gsap-examples/text-reveal/scroll-reveal-text-5/scroll-reveal-text-5.component';
import { TrialPathHeaderComponent } from './trial-path-header/trial-path-header.component';
import { TrialPathHowItWorksComponent } from './trial-path-how-it-works/trial-path-how-it-works.component';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing-page-trial-path',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonModule,
    ScrollRevealText1Component,
    ScrollRevealText2Component,
    ScrollRevealText3Component,
    ScrollRevealText4Component,
    ScrollRevealText5Component,
    TrialPathHeaderComponent,
    TrialPathHowItWorksComponent
],
  templateUrl: './landing-page-trial-path.component.html',
  styleUrls: ['./landing-page-trial-path.component.scss'],
})
export class LandingPageTrialPathComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: false }) heroSection!: ElementRef;
  @ViewChild('featureCards', { static: false }) featureCards!: ElementRef;
  @ViewChild('ctaButtons', { static: false }) ctaButtons!: ElementRef;
  @ViewChild('brandsSection', { static: false }) brandsSection!: ElementRef;
  @ViewChild('brandLogos', { static: false }) brandLogos!: ElementRef;
  @ViewChild('horizontalSection', { static: false }) horizontalSection!: ElementRef;
  @ViewChild('cardsWrapper', { static: false }) cardsWrapper!: ElementRef;

  private scrollTriggerInstances: ScrollTrigger[] = [];

  features = [
    {
      icon: '🔒',
      title: 'Secure',
      description:
        'Enterprise-grade security with end-to-end encryption to keep your data safe and private.',
      features: ['256-bit encryption', 'SOC 2 certified', 'GDPR compliant'],
    },
    {
      icon: '⚡',
      title: 'Fast',
      description:
        'Lightning-fast performance with optimized infrastructure for real-time data processing.',
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

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    // Animate hero section fade-in
    if (this.heroSection) {
      gsap.from(this.heroSection.nativeElement, { opacity: 0, y: -50, duration: 1 });
    }

    // Animate feature cards stagger
    if (this.featureCards) {
      gsap.from(this.featureCards.nativeElement.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });
    }

    // Animate brands section logos
    if (this.brandLogos) {
      gsap.from(this.brandLogos.nativeElement.children, {
        opacity: 0,
        scale: 0.7,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.3,
      });

      const logoElements = Array.from(this.brandLogos.nativeElement.children) as HTMLElement[];
      logoElements.forEach((logo) => {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, { scale: 1.15, duration: 0.3, ease: 'power1.out' });
        });
        logo.addEventListener('mouseleave', () => {
          gsap.to(logo, { scale: 1, duration: 0.3, ease: 'power1.in' });
        });
      });
    }

    // Initialize horizontal scroll animation
    this.initHorizontalScroll();
  }

  ngOnDestroy(): void {
    // Clean up all ScrollTriggers
    this.scrollTriggerInstances.forEach((trigger) => trigger.kill());
    this.scrollTriggerInstances = [];

    // Kill any remaining ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
      const cards = wrapper.querySelectorAll('.horizontal-card');

      // CRITICAL: Find the scrollable container
      const scrollContainer = document.querySelector('.content-container');

      if (!scrollContainer) {
        console.error('Scroll container (.content-container) not found!');
        return;
      }

      if (cards.length === 0) {
        console.warn('No cards found in horizontal section');
        return;
      }

      // Calculate scroll distance
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
        cardsCount: cards.length,
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
          start: 'top top',
          end: () => {
            const scrollAmount = Math.abs(getScrollAmount());
            // Add extra scroll distance for a smoother experience
            return `+=${scrollAmount + window.innerHeight}`;
          },
          scroller: scrollContainer, // CRITICAL: Target the scrollable container
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false, // Set to true for debugging
          id: 'horizontal-scroll',
        },
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

      // Optional: Card entrance animations
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          scroller: scrollContainer, // Use the same scroller
          toggleActions: 'play none none reverse',
        },
      });

      entranceTl.from(cards, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Refresh after initialization
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 500);
  }

  private resizeTimeout: any;
  private handleResize = (): void => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  };

  navigateToDemo(): void {
    void this.router.navigate(['/demo']);
  }

  navigateToSignUp(): void {
    void this.router.navigate(['/register']);
  }
}
