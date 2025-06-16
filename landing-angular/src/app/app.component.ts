import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'landing';
  Math = Math;

  // Texto completo para animar
  fullName = 'Juan Machado.';
  fullHeader = `Web developer in the making — curious, creative, and always building.\nStudying Software Engineering while learning by doing: building real projects, exploring new tools, and trying to improve a bit every day.\nI enjoy crafting clean and meaningful user interfaces, and I'm always up for a good challenge.`;

  // Texto mostrado (animado)
  animatedName = '';
  animatedHeader = '';

  @ViewChild('techSection', { static: false }) techSectionRef!: ElementRef;
  @ViewChild('projectsList', { static: false }) projectsListRef!: ElementRef;

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

  constructor() {
    // Generate bubble properties
    this.generateBubbles();
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.typeWriter(this.fullName, 'animatedName', 120, () => {
        this.typeWriter(this.fullHeader, 'animatedHeader', 40);
      });
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.setupTechCardsAnimation();
      this.initializeProjectsSection();
      this.setupFabButton();
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

  setupTechCardsAnimation() {
    const section = document.querySelector('.tech-section-cards');
    if (!section) return;

    // Add visible class to section when it comes into view
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    sectionObserver.observe(section);

    // Animate individual cards
    const cards = Array.from(section.querySelectorAll('.tech-card'));
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    cards.forEach(card => {
      cardObserver.observe(card);
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

    wrapper.addEventListener('click', () => {
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
}
