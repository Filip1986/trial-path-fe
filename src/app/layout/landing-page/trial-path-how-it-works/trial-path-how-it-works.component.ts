import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-trial-path-how-it-works',
  standalone: true,
  imports: [],
  templateUrl: './trial-path-how-it-works.component.html',
  styleUrls: ['./trial-path-how-it-works.component.scss'],
})
export class TrialPathHowItWorksComponent implements AfterViewInit, OnDestroy {
  @ViewChild('howItWorksSection', { static: false }) howItWorksSection!: ElementRef;

  private observer!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.howItWorksSection) return;

    const section = this.howItWorksSection.nativeElement;

    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -20% 0px',
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('animate-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observer.observe(section);
  }
}
