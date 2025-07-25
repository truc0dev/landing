import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit, AfterViewInit {
  visible = true;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    // El componente se ocultará después de que las animaciones GSAP terminen
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  private initializeAnimations(): void {
    // Register ScrambleText plugin
    gsap.registerPlugin(ScrambleTextPlugin);

    // Create custom ease for animations
    const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";

    // Initialize elements
    const terminalLines = document.querySelectorAll(".terminal-line");
    const preloaderEl = document.getElementById("preloader");
    const progressBar = document.getElementById("progress-bar");

    // Special characters for scramble effect
    const specialChars = "▪";

    // Store original text content for spans that will be scrambled
    const originalTexts: { [key: number]: string } = {};
    document
      .querySelectorAll('.terminal-line span[data-scramble="true"]')
      .forEach(function (span, index) {
        const originalText = span.textContent || '';
        originalTexts[index] = originalText;
        span.setAttribute("data-original-text", originalText);
        // Don't clear the text initially, let GSAP handle it
      });

    // Set initial state - make sure terminal lines are initially hidden
    gsap.set(".terminal-line", {
      opacity: 0
    });

    // Function to update progress bar
    const updateProgress = (percent: number) => {
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = percent + "%";
      }
    };

    // Terminal preloader animation
    const animateTerminalPreloader = () => {
      // Reset progress to 0%
      updateProgress(0);

      // Create main timeline for text animation
      const tl = gsap.timeline({
        onComplete: () => {
          // Once preloader is done, animate the garage door transition
          this.animateGarageDoorTransition();
        }
      });

      // Total animation duration in seconds
      const totalDuration = 2;

      // Get all terminal lines and sort them by top position
      const allLines = Array.from(document.querySelectorAll(".terminal-line"));
      allLines.sort((a, b) => {
        const aTop = parseInt((a as HTMLElement).style.top);
        const bTop = parseInt((b as HTMLElement).style.top);
        return aTop - bTop;
      });

      // Set initial state - all lines hidden and spans empty
      gsap.set(".terminal-line", {
        opacity: 0
      });
      
      gsap.set('span[data-scramble="true"]', {
        text: ""
      });

      // Process each line sequentially
      allLines.forEach((line, lineIndex) => {
        const lineTime = lineIndex * 0.2; // Each line takes 0.2 seconds (much faster)
        
        // Show the line
        tl.to(line, {
          opacity: 1,
          duration: 0.05
        }, lineTime);

        // Get all spans in this line that should be scrambled
        const scrambleSpans = line.querySelectorAll('span[data-scramble="true"]');
        
        // Process each span in the line
        scrambleSpans.forEach((span, spanIndex) => {
          const originalText = span.getAttribute("data-original-text") || '';
          const spanTime = lineTime + 0.02 + (spanIndex * 0.08); // Stagger spans within line (much faster)
          
          // Type out the text character by character like a typewriter
          tl.to(span, {
            duration: 0.15,
            scrambleText: {
              text: originalText,
              chars: specialChars,
              revealDelay: 0,
              speed: 0.05,
              newClass: "revealed"
            },
            ease: "none"
          }, spanTime);

          // After typing, fade to gray (for faded spans)
          if (span.classList.contains('faded')) {
            tl.to(span, {
              opacity: 0.5,
              duration: 0.05
            }, spanTime + 0.15);
          }
        });
      });

      // After all lines are written, wait 0.2 seconds then start erasing
      const eraseStartTime = allLines.length * 0.2 + 0.2;
      
      // Erase lines in reverse order (right to left, bottom to top)
      for (let i = allLines.length - 1; i >= 0; i--) {
        const line = allLines[i];
        const eraseTime = eraseStartTime + (allLines.length - 1 - i) * 0.08;
        
        // Erase from right to left
        const scrambleSpans = line.querySelectorAll('span[data-scramble="true"]');
        for (let j = scrambleSpans.length - 1; j >= 0; j--) {
          const span = scrambleSpans[j];
          const spanEraseTime = eraseTime + (scrambleSpans.length - 1 - j) * 0.02;
          
          // Erase text character by character
          tl.to(span, {
            duration: 0.05,
            scrambleText: {
              text: "",
              chars: specialChars,
              revealDelay: 0,
              speed: 0.02
            },
            ease: "none"
          }, spanEraseTime);
        }
        
        // Hide the line
        tl.to(line, {
          opacity: 0,
          duration: 0.05
        }, eraseTime + 0.08);
      }

      // Set up progress bar animation
      tl.eventCallback("onUpdate", () => {
        const progress = Math.min(99, tl.progress() * 100);
        updateProgress(progress);
      });

      // Force final update to 100% at the end
      tl.call(
        () => {
          updateProgress(100);
        },
        [],
        totalDuration - 0.5
      );

      return tl;
    };

    // Start terminal preloader animation
    const terminalAnimation = animateTerminalPreloader();
  }

  private animateGarageDoorTransition(): void {
    const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";
    
    // Create timeline for garage door transition
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide the component after animation completes
        this.visible = false;
      }
    });

    // Animate the entire loader-screen container to slide up like a garage door
    tl.to('.loader-screen', {
      y: '-100%',
      duration: 1.2,
      ease: slideEase,
      onStart: () => {
        // Notify the service immediately when garage door starts opening
        // This will trigger the hero content animation
        this.loadingService.completeLoading();
      }
    });

    // Also animate the preloader separately for extra smoothness
    tl.to('.preloader', {
      y: '-100%',
      duration: 1.2,
      ease: slideEase
    }, 0); // Start at the same time as the loader-screen
  }
} 