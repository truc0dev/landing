import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { LoadingService } from './loading.service';

declare var gsap: any;
declare var CustomEase: any;
import { Subscription } from 'rxjs';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, LoadingScreenComponent],
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

  contactForm: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  // Bubble animation properties
  bubbles: Array<{
    size: string;
    distance: string;
    position: string;
    time: string;
    delay: string;
  }> = [];

  constructor(private loadingService: LoadingService) {
    // Generate bubble properties
    this.generateBubbles();
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
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.initializeTechListAnimation();
      this.initializeProjectsSection();
      this.setupFabButton();
      // Forzar reproducción del video hero si está presente
      this.initializeHeroVideo();
    }
  }

  private initializeHeroVideo() {
    if (this.heroVideoRef && this.heroVideoRef.nativeElement) {
      const video = this.heroVideoRef.nativeElement;
      
      // Keep video completely hidden but ready to play
      video.style.opacity = '1';
      video.style.visibility = 'hidden';
      
      // Don't pause the video, let it load and be ready
      console.log('Video initialized - hidden but ready to play');
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
    // Wait for GSAP to be available
    setTimeout(() => {
      if (typeof gsap !== 'undefined') {
        this.animateTechList();
      }
    }, 100);
  }

  private animateTechList() {
    // Create custom easing functions
    gsap.registerPlugin(CustomEase);
    CustomEase.create("customEase", "0.6, 0.01, 0.05, 1");
    CustomEase.create("blurEase", "0.25, 0.1, 0.25, 1");
    CustomEase.create("counterEase", "0.35, 0.0, 0.15, 1");
    CustomEase.create("gentleIn", "0.38, 0.005, 0.215, 1");

    const timeline = gsap.timeline();

    // Fade in header
    timeline.to(".tech-list-header", {
      opacity: 1,
      duration: 0.15,
      ease: "customEase"
    });

    // Fade in rows one by one
    timeline.to(".tech-row", {
      opacity: 1,
      duration: 0.2,
      stagger: 0.2,
      ease: "gentleIn"
    });

    // Change color of items in each row
    timeline.to(".tech-item", {
      color: "#fff",
      duration: 0.15,
      stagger: 0.05,
      ease: "blurEase"
    }, "-=0.5"); // Start slightly before the previous animation ends

    // Fade out rows one by one after delay
    timeline.to(".tech-row", {
      opacity: 0,
      duration: 0.2,
      stagger: 0.1,
      delay: 1.5,
      ease: "counterEase"
    });

    timeline.to(".tech-list-header", {
      opacity: 0,
      duration: 0.15,
      ease: "customEase"
    });
  }

  onSubmit() {
    console.log('Form submitted:', this.contactForm);
    alert('Message sent successfully!');
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }

  private generateBubbles() {
    for (let i = 0; i < 512; i++) {
      this.bubbles.push({
        size: `${0.8 + Math.random() * 1.5}rem`,
        distance: `${4 + Math.random() * 3}rem`,
        position: `${-2 + Math.random() * 104}%`,
        time: `${1.2 + Math.random() * 1.8}s`,
        delay: `${-1 * (1.2 + Math.random() * 1.8)}s`
      });
    }
  }

  private setupFabButton() {
    const wrapper = document.getElementById('wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('click', (e) => {
      // Prevent click event if clicking on the GitHub button
      if ((e.target as HTMLElement).closest('#one')) {
        return;
      }

      const one = document.getElementById('one');
      const two = document.getElementById('two');

      if (!two?.classList.contains('two-anime')) {
        one?.classList.add('one-anime');
        two?.classList.add('two-anime');
      } else {
        one?.classList.remove('one-anime');
        two?.classList.add('slide-down');
        two?.classList.remove('two-anime');
      }
    });
  }

  openGithub() {
    window.open('https://github.com/truc0dev/README.md', '_blank');
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
}
