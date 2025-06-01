import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <a routerLink="/" class="home-link">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 20px;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #e74c3c;
    }
    h2 {
      font-size: 2rem;
      margin: 10px 0;
    }
    .home-link {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    .home-link:hover {
      background-color: #2980b9;
    }
  `]
})
export class NotFoundComponent {} 