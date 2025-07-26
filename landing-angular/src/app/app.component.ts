import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingService } from './loading.service';
import { ContactComponent } from './contact/contact.component';
import { Subscription } from 'rxjs';

// Import GSAP dynamically
declare var gsap: any;
declare var CustomEase: any;



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, LoadingScreenComponent, ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'landing';
  Math = Math;
  private loadingSubscription?: Subscription;

  // Texto completo para animar
  fullName = 'Juan Machado.';
  fullHeader = `Web developer in the making — curious, creative, and always building.\nStudying Software Engineering while learning by doing: building real projects, exploring new tools, and trying to improve a bit every day.\nI enjoy crafting clean and meaningful user interfaces, and I'm always up for a good challenge.`;

  // Texto mostrado (animado)
  animatedName = '';
  animatedHeader = '';

  @ViewChild('techSection', { static: false }) techSectionRef!: ElementRef;
  @ViewChild('projectsList', { static: false }) projectsListRef!: ElementRef;
  @ViewChild('heroVideo', { static: false }) heroVideoRef!: ElementRef<HTMLVideoElement>;

  activeSection = 'home';
  lineColor = 'white';
  lineOpacity = 0.3;

  constructor(private loadingService: LoadingService) {
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.typeWriter(this.fullName, 'animatedName', 120, () => {
        this.typeWriter(this.fullHeader, 'animatedHeader', 40);
      });
    }

    // Subscribe to loading completion
    this.loadingSubscription = this.loadingService.loadingComplete$.subscribe(() => {
      this.animateHeroContent();
      // Initialize tech animation after loading is complete
      setTimeout(() => {
        this.initializeTechListAnimation();
      }, 1000); // Wait 1 second after loading to start tech animation
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.initializeProjectsSection();
      // Forzar reproducción del video hero si está presente
      this.initializeHeroVideo();
      // Initialize mobile video handling
      this.initializeMobileVideo();
      // Initialize scroll spy for vertical navigation
      this.initializeScrollSpy();
    }
  }

  private initializeHeroVideo() {
    if (this.heroVideoRef && this.heroVideoRef.nativeElement) {
      const video = this.heroVideoRef.nativeElement;
      
      // Make video visible and ready to play
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      
      // Ensure video plays on mobile
      video.muted = true;
      video.playsInline = true;
      
      // Try to play the video
      video.play().then(() => {
        console.log('Hero video playing successfully');
      }).catch((error) => {
        console.log('Video autoplay failed:', error);
        // This is normal on mobile, user interaction required
      });
      
      console.log('Video initialized and ready to play');
    }
  }

  private initializeMobileVideo() {
    // Handle mobile video specifically
    const mobileVideo = document.querySelector('.hero-video-mobile') as HTMLVideoElement;
    if (mobileVideo) {
      mobileVideo.muted = true;
      mobileVideo.playsInline = true;
      
      // Try to play mobile video
      mobileVideo.play().then(() => {
        console.log('Mobile video playing successfully');
      }).catch((error) => {
        console.log('Mobile video autoplay failed:', error);
        // Add click listener to start video on user interaction
        document.addEventListener('click', () => {
          mobileVideo.play().catch(e => console.log('Mobile video play failed:', e));
        }, { once: true });
      });
    }
  }



  private initializeProjectsSection() {
    const list = this.projectsListRef?.nativeElement;
    if (!list) return;

    const items = list.querySelectorAll('li');
    const stackDescriptions = document.querySelectorAll('.stack-description');
    
    const setIndex = (event: Event) => {
      const target = event.target as HTMLElement;
      const closest = target.closest('li');
      if (closest) {
        const index = Array.from(items).indexOf(closest);
        const cols = new Array(list.children.length)
          .fill(null)
          .map((_, i) => {
            items[i].setAttribute('data-active', (index === i).toString());
            return index === i ? '10fr' : '1fr';
          })
          .join(' ');
        list.style.setProperty('grid-template-columns', cols);

        // Update stack descriptions
        stackDescriptions.forEach((desc, i) => {
          desc.setAttribute('data-active', (index === i).toString());
        });
      }
    };

    const resync = () => {
      const widths = Array.from(items).map((i) => (i as HTMLElement).offsetWidth);
      const w = Math.max(...widths);
      list.style.setProperty('--article-width', `${w}px`);
    };

    list.addEventListener('focus', setIndex, true);
    list.addEventListener('click', setIndex);
    list.addEventListener('pointermove', setIndex);
    window.addEventListener('resize', resync);
    resync();
  }

  typeWriter(text: string, target: 'animatedName' | 'animatedHeader', speed = 40, callback?: () => void) {
    let i = 0;
    const next = () => {
      if (i <= text.length) {
        this[target] = text.slice(0, i);
        i++;
        setTimeout(next, speed);
      } else if (callback) {
        callback();
      }
    };
    next();
  }

  initializeTechListAnimation() {
    console.log('Initializing tech list animation...');
    
    // Import GSAP dynamically and animate when section is visible
    import('gsap').then(({ gsap }) => {
      import('gsap/CustomEase').then(({ CustomEase }) => {
        console.log('GSAP loaded, setting up intersection observer...');
        
        // Create intersection observer to trigger animation when section is visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log('Tech section is visible, starting animation...');
              this.animateTechList(gsap, CustomEase);
              observer.disconnect(); // Only animate once
            }
          });
        }, { 
          threshold: 0.3,
          rootMargin: '0px 0px -100px 0px' // Trigger when section is 100px from bottom
        });

        // Observe the tech section
        const techSection = document.querySelector('.tech-section');
        if (techSection) {
          console.log('Tech section found, observing...');
          observer.observe(techSection);
        } else {
          console.log('Tech section not found');
        }
      });
    });
  }

  private animateTechList(gsap: any, CustomEase: any) {
    console.log('Starting tech list animation...');
    
    // Create custom easing functions
    gsap.registerPlugin(CustomEase);
    CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
    CustomEase.create("blurEase", "0.25, 0.1, 0.25, 1");
    CustomEase.create("counterEase", "0.35, 0.0, 0.15, 1");
    CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");

    const timeline = gsap.timeline();

    // Set initial state - hide all elements and set initial colors
    gsap.set(".tech-list-header, .tech-row", {
      opacity: 0,
      y: 30
    });
    
    gsap.set(".tech-item", {
      opacity: 0,
      color: "#4f4f4f"
    });

    // Fade in header with slide up
    timeline.to(".tech-list-header", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "gentleIn"
    });

    // Fade in rows one by one with slide up
    timeline.to(".tech-row", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.4,
      ease: "gentleIn"
    }, "-=0.4");

    // Fade in tech items with stagger
    timeline.to(".tech-item", {
      opacity: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "blurEase"
    }, "-=0.6");

    // Change color of items to white and keep them white
    timeline.to(".tech-item", {
      color: "#fff",
      duration: 0.4,
      stagger: 0.08,
      ease: "blurEase"
    }, "-=0.3");

    // Animation complete - items stay white
    timeline.call(() => {
      console.log('Tech list animation complete - items will stay white');
    });
  }





  private animateHeroContent() {
    // Import gsap dynamically to avoid SSR issues
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";
        
        // Handle video visibility and playback
        if (this.heroVideoRef && this.heroVideoRef.nativeElement) {
          const video = this.heroVideoRef.nativeElement;
          
          // Make video visible first
          video.style.visibility = 'visible';
          
          // Force video to load and play aggressively
          const forcePlayVideo = () => {
            // Set video properties
            video.muted = true;
            video.playsInline = true;
            video.currentTime = 0;
            
            // Try to play multiple times
            const playAttempts = [
              () => video.play(),
              () => new Promise(resolve => setTimeout(() => video.play().then(resolve), 100)),
              () => new Promise(resolve => setTimeout(() => video.play().then(resolve), 500)),
              () => new Promise(resolve => setTimeout(() => video.play().then(resolve), 1000))
            ];
            
            playAttempts.forEach((attempt, index) => {
              setTimeout(() => {
                attempt().catch((error) => {
                  console.log(`Play attempt ${index + 1} failed:`, error);
                });
              }, index * 200);
            });
          };
          
          // Try to play immediately
          forcePlayVideo();
          
          // Also try when video is ready
          if (video.readyState >= 2) {
            forcePlayVideo();
          } else {
            video.addEventListener('loadeddata', forcePlayVideo, { once: true });
            video.addEventListener('canplay', forcePlayVideo, { once: true });
            video.addEventListener('canplaythrough', forcePlayVideo, { once: true });
          }
          
          console.log('Video made visible and attempting aggressive play');
        }

        // Set initial state for hero content (only texts)
        gsap.set('.hero-section h1, .hero-section p, .hero-section button', {
          opacity: 0,
          y: 30
        });

        // Animate hero content with staggered fade in (only texts)
        gsap.to('.hero-section h1', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: slideEase,
          delay: 0.3
        });

        gsap.to('.hero-section p', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: slideEase,
          delay: 0.5
        });

        gsap.to('.hero-section button', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: slideEase,
          delay: 0.7
        });
      });
    }
  }

  private initializeScrollSpy() {
    if (typeof window === 'undefined') return;

    const sections = [
      { id: 'home', selector: '.hero-section', lineColor: 'white' },
      { id: 'about', selector: '#about', lineColor: 'black' },
      { id: 'services', selector: '#services', lineColor: 'black' },
      { id: 'technologies', selector: '.tech-section', lineColor: 'white' },
      { id: 'projects', selector: '.projects-section', lineColor: 'black' },
      { id: 'contact', selector: '.contact-section', lineColor: 'white' }
    ];

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let currentSection = sections[0];
      let nextSection = sections[1];
      let progress = 0;
      let foundSection = false;

      // Find current and next section
      for (let i = 0; i < sections.length - 1; i++) {
        const current = sections[i];
        const next = sections[i + 1];
        
        const currentElement = document.querySelector(current.selector);
        const nextElement = document.querySelector(next.selector);
        
        if (currentElement && nextElement) {
          const currentRect = currentElement.getBoundingClientRect();
          const nextRect = nextElement.getBoundingClientRect();
          
          const currentTop = currentRect.top + window.scrollY;
          const currentBottom = currentTop + currentRect.height;
          const nextTop = nextRect.top + window.scrollY;
          
          if (scrollPosition >= currentTop && scrollPosition <= nextTop) {
            currentSection = current;
            nextSection = next;
            
            // Calculate progress between sections (0 to 1)
            const sectionHeight = nextTop - currentBottom;
            const scrollInSection = scrollPosition - currentBottom;
            progress = Math.max(0, Math.min(1, scrollInSection / sectionHeight));
            foundSection = true;
            break;
          }
        }
      }

      // Handle last section (contact) - if we didn't find a section in the loop
      if (!foundSection) {
        const lastSection = sections[sections.length - 1];
        const lastElement = document.querySelector(lastSection.selector);
        
        if (lastElement) {
          const lastRect = lastElement.getBoundingClientRect();
          const lastTop = lastRect.top + window.scrollY;
          const lastBottom = lastTop + lastRect.height;
          
          if (scrollPosition >= lastTop && scrollPosition <= lastBottom) {
            currentSection = lastSection;
            nextSection = lastSection; // Same section for last one
            progress = 0;
            foundSection = true;
          }
        }
      }

      // Update active section
      this.activeSection = currentSection.id;

      // Interpolate color based on progress
      if (currentSection.lineColor === nextSection.lineColor) {
        this.lineColor = currentSection.lineColor;
        this.lineOpacity = 0.3;
      } else {
        // Smooth transition between different colors
        const currentColor = currentSection.lineColor === 'white' ? 1 : 0;
        const nextColor = nextSection.lineColor === 'white' ? 1 : 0;
        const interpolatedColor = currentColor + (nextColor - currentColor) * progress;
        
        this.lineColor = interpolatedColor > 0.5 ? 'white' : 'black';
        this.lineOpacity = 0.3 + (progress * 0.2); // Slight opacity change during transition
      }
    };

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call
  }
}
