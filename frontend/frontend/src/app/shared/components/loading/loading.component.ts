import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-overlay" *ngIf="show">
      <div class="loading-spinner">
        <div class="spinner-border" [ngClass]="sizeClass" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div *ngIf="message" class="loading-message mt-2">{{ message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-spinner {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    .loading-message {
      color: #6c757d;
      font-size: 0.875rem;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
      border-width: 0.2em;
    }

    .spinner-border-md {
      width: 2rem;
      height: 2rem;
      border-width: 0.2em;
    }

    .spinner-border-lg {
      width: 3rem;
      height: 3rem;
      border-width: 0.25rem;
    }
  `]
})
export class LoadingComponent {
  @Input() show = false;
  @Input() message = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get sizeClass(): string {
    return `spinner-border-${this.size}`;
  }
}
