import { Component, ChangeDetectionStrategy } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { ScrollRevealText1Component } from '../gsap-examples/text-reveal/scroll-reveal-text-1/scroll-reveal-text-1.component';
import { ScrollRevealText2Component } from '../gsap-examples/text-reveal/scroll-reveal-text-2/scroll-reveal-text-2.component';
import { ScrollRevealText3Component } from '../gsap-examples/text-reveal/scroll-reveal-text-3/scroll-reveal-text-3.component';
import { ScrollRevealText4Component } from '../gsap-examples/text-reveal/scroll-reveal-text-4/scroll-reveal-text-4.component';
import { ScrollRevealText5Component } from '../gsap-examples/text-reveal/scroll-reveal-text-5/scroll-reveal-text-5.component';
import { ScrollRevealText6Component } from '../gsap-examples/text-reveal/scroll-reveal-text-6/scroll-reveal-text-6.component';
import { AnimatedLogo1Component } from '../gsap-examples/animated-logo-1/animated-logo-1.component';
import { AnimatedLogo2Component } from '../gsap-examples/animated-logo-2/animated-logo-2.component';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  category: 'text' | 'cards' | 'logo';
  component: any;
}

@Component({
  selector: 'app-gsap-showcase',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TabsModule,
    ScrollRevealText1Component,
    ScrollRevealText2Component,
    ScrollRevealText3Component,
    ScrollRevealText4Component,
    ScrollRevealText5Component,
    ScrollRevealText6Component,
    AnimatedLogo1Component,
    AnimatedLogo2Component
],
  templateUrl: './gsap-showcase.component.html',
  styleUrls: ['./gsap-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GsapShowcaseComponent {
  showcaseItems: ShowcaseItem[] = [
    {
      id: 'text-reveal-1',
      title: 'Text Reveal 1',
      description: 'Basic text reveal animation with scroll trigger',
      category: 'text',
      component: ScrollRevealText1Component,
    },
    {
      id: 'text-reveal-2',
      title: 'Text Reveal 2',
      description: 'Advanced text reveal with character animation',
      category: 'text',
      component: ScrollRevealText2Component,
    },
    {
      id: 'text-reveal-3',
      title: 'Text Reveal 3',
      description: 'Word-by-word text reveal animation',
      category: 'text',
      component: ScrollRevealText3Component,
    },
    {
      id: 'text-reveal-4',
      title: 'Text Reveal 4',
      description: 'Line-by-line text reveal with stagger',
      category: 'text',
      component: ScrollRevealText4Component,
    },
    {
      id: 'text-reveal-5',
      title: 'Text Reveal 5',
      description: 'Split text animation with custom timing',
      category: 'text',
      component: ScrollRevealText5Component,
    },
    {
      id: 'text-reveal-6',
      title: 'Text Reveal 6',
      description: 'Complex text reveal with multiple effects',
      category: 'text',
      component: ScrollRevealText6Component,
    },
    {
      id: 'animated-logo-1',
      title: 'Animated Logo 1',
      description: 'SVG path drawing animation',
      category: 'logo',
      component: AnimatedLogo1Component,
    },
    {
      id: 'animated-logo-2',
      title: 'Animated Logo 2',
      description: 'Complex logo animation with multiple paths',
      category: 'logo',
      component: AnimatedLogo2Component,
    },
  ];

  get textShowcases(): ShowcaseItem[] {
    return this.showcaseItems.filter((item) => item.category === 'text');
  }

  get cardsShowcases(): ShowcaseItem[] {
    return this.showcaseItems.filter((item) => item.category === 'cards');
  }

  get logoShowcases(): ShowcaseItem[] {
    return this.showcaseItems.filter((item) => item.category === 'logo');
  }
}
