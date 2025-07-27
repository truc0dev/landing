import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-section">
      <div class="contact-container">
        <h1 class="contact-title">CONTACT</h1>
        
        <form class="contact-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="formData.name" 
              name="name"
              placeholder="Your name" 
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <input 
              type="email" 
              [(ngModel)]="formData.email" 
              name="email"
              placeholder="Your email" 
              required
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <textarea 
              [(ngModel)]="formData.message" 
              name="message"
              placeholder="Message" 
              required
              class="form-textarea"
              rows="6"
            ></textarea>
          </div>
          
          <button type="submit" class="submit-btn" [disabled]="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
        
        <div *ngIf="isSubmitted" class="success-message">
          Thanks for reaching out!
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      background: #000000;
      max-height: 100vh;
      padding: 6rem 2rem;
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      border-top: 1px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: relative;
      z-index: 1;
      margin-top: 200px;
      margin-bottom: -49px;
      min-width: 97.65vw;
      margin-left: -423.5px;
    }
    
    .contact-container {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
    }
    
    .contact-title {
      color: #ffffff;
      font-size: 2.5rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin: 0;
      text-align: center;
    }
    
    .contact-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .form-group {
      width: 100%;
    }
    
    .form-input,
    .form-textarea {
      width: 100%;
      padding: 1rem 0;
      background: transparent;
      border: none;
      border-bottom: 2px solid #ffffff;
      color: #ffffff;
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      font-size: 1rem;
      outline: none;
      box-sizing: border-box;
      transition: border-bottom-color 0.3s ease;
    }
    
    .form-input:focus,
    .form-textarea:focus {
      border-bottom-color: #ffffff;
    }
    
    .form-input::placeholder,
    .form-textarea::placeholder {
      color: #ffffff;
      opacity: 0.7;
    }
    
          .form-textarea {
        resize: vertical;
        min-height: 120px;
      }
      
      @media (max-width: 768px) {
        .form-textarea {
          min-height: 80px;
        }
      }
    
    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: transparent;
      border: 2px solid #ffffff;
      color: #ffffff;
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      font-size: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .submit-btn:hover:not(:disabled) {
      background: #ffffff;
      color: #000000;
    }
    
    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .success-message {
      color: #ffffff;
      font-size: 1.2rem;
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    @media (max-width: 768px) {
      .contact-section {
        min-height: 70vh;
        padding: 2.5rem 1rem;
        min-width: 97vw !important;
        margin-left: -5px !important;
        margin-right: 0 !important;
        margin-top: 120px !important;
        width: 97vw !important;
        left: 0 !important;
        right: 0 !important;
        position: relative !important;
        overflow-x: hidden !important;
      }
      
      .contact-title {
        font-size: 2rem;
        letter-spacing: 0.1em;
      }
      
      .contact-container {
        gap: 1.5rem;
        padding: 0 1rem;
        max-width: 100%;
      }
      
      .contact-form {
        gap: 1.2rem;
        width: 100%;
      }
      
      .form-input,
      .form-textarea {
        padding: 0.8rem 0;
        font-size: 0.9rem;
      }
      
      .submit-btn {
        padding: 0.8rem;
        font-size: 0.9rem;
      }
      
      .success-message {
        font-size: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .contact-section {
        height: 80vh;
        padding: 2rem 0.8rem;
        margin-top: 110px;
        margin-bottom: -100px;
        min-height: 50vh;
        margin-left: -5px;
        min-width: 95vw !important;
        width: 95vw !important;
      }
      
      .contact-title {
        font-size: 1.8rem;
        letter-spacing: 0.1em;
      }
      
      .contact-container {
        gap: 1rem;
        padding: 0 0.5rem;
      }
      
      .contact-form {
        gap: 1rem;
      }
      
      .form-input,
      .form-textarea {
        padding: 0.7rem 0;
        font-size: 0.85rem;
      }
      
      .submit-btn {
        padding: 0.7rem;
        font-size: 0.85rem;
      }
      
      .success-message {
        font-size: 0.9rem;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };
  
  isSubmitting = false;
  isSubmitted = false;
  
  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', this.formData);
      
      // Reset form
      this.formData = {
        name: '',
        email: '',
        message: ''
      };
      
      this.isSubmitting = false;
      this.isSubmitted = true;
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.isSubmitted = false;
      }, 5000);
      
    }, 1000);
  }
} 