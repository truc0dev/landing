import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule, CommonModule],
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

  constructor(private toastr: ToastrService) {
    // Generate bubble properties
    this.generateBubbles();
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.typeWriter(this.fullName, 'animatedName', 60, () => {
        this.typeWriter(this.fullHeader, 'animatedHeader', 16);
      });
      this.initializeProjectsSection();
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.setupTechCardsAnimation();
    }
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
    const cards = Array.from(section.querySelectorAll('.tech-card'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('visible');
            }, i * 220);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(section);
  }

  onSubmit() {
    console.log('Form submitted:', this.contactForm);
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }

  private initializeProjectsSection() {
    const list = document.querySelector('ul');
    if (!list) return;

    const items = list.querySelectorAll('li');
    const stackDescriptions = document.querySelectorAll('.stack-description');
    
    const setIndex = (event: Event) => {
      const target = event.target as HTMLElement;
      const closest = target.closest('li');
      if (closest) {
        const index = Array.from(items).indexOf(closest);
        const cols = Array(items.length)
          .fill(null)
          .map((_, i) => {
            items[i].setAttribute('data-active', (index === i).toString());
            stackDescriptions[i].setAttribute('data-active', (index === i).toString());
            return index === i ? '10fr' : '1fr';
          })
          .join(' ');
        list.style.setProperty('grid-template-columns', cols);
      }
    };

    list.addEventListener('focus', setIndex, true);
    list.addEventListener('click', setIndex);
    list.addEventListener('pointermove', setIndex);

    const resync = () => {
      const w = Math.max(
        ...Array.from(items).map((i) => i.offsetWidth)
      );
      list.style.setProperty('--article-width', w.toString());
    };

    window.addEventListener('resize', resync);
    resync();
  }

  private generateBubbles() {
    this.bubbles = Array(1024).fill(null).map(() => ({
      size: `${0.5 + Math.random() * 2}rem`,
      distance: `${2 + Math.random() * 8}rem`,
      position: `${-5 + Math.random() * 110}%`,
      time: `${1 + Math.random() * 3.5}s`,
      delay: `${-1 * (1 + Math.random() * 3.5)}s`
    }));
  }
}
