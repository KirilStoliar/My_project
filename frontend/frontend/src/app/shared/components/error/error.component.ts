import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div *ngIf="message" class="error-alert alert alert-danger alert-dismissible fade show" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <strong>Error!</strong> {{ message }}
          <div *ngIf="details" class="error-details mt-1">{{ details }}</div>
        </div>
      </div>
      <button *ngIf="dismissible" type="button" class="btn-close" (click)="onDismiss()" aria-label="Close"></button>
    </div>
  `,
  styles: [`
    .error-alert {
      border: none;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 0.125rem 0.25rem rgba(220, 53, 69, 0.1);
    }

    .error-details {
      font-size: 0.875rem;
      color: #842029;
      background-color: rgba(220, 53, 69, 0.05);
      padding: 0.5rem;
      border-radius: 0.25rem;
      margin-top: 0.5rem;
      border-left: 3px solid #dc3545;
    }

    .btn-close {
      padding: 1.25rem;
      background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23842029'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
    }

    i.bi-exclamation-triangle-fill {
      font-size: 1.25rem;
    }
  `]
})
export class ErrorComponent {
  @Input() message: string = '';
  @Input() details: string = '';
  @Input() dismissible: boolean = true;
  @Output() dismissed = new EventEmitter<void>();

  onDismiss(): void {
    this.message = '';
    this.details = '';
    this.dismissed.emit();
  }
}
