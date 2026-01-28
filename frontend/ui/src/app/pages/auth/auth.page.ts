import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';

import { LoginRequest, UserCredentialsRequest } from '../../types/auth.types';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.css'],
})
export class Auth {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  mode = signal<'login' | 'register'>('login');
  title = computed(() => (this.mode() === 'login' ? 'Sign in' : 'Create user (ADMIN)'));

  isSubmitting = signal(false);
  errorText = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
  });

  // UserCredentialsRequest: surename + birthDate LocalDate(string)
  registerForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    name: this.fb.nonNullable.control('', [Validators.required]),
    surename: this.fb.nonNullable.control('', [Validators.required]),
    birthDate: this.fb.nonNullable.control('', [Validators.required]), // "YYYY-MM-DD"
    role: this.fb.nonNullable.control<'USER' | 'ADMIN'>('USER', [Validators.required]),
  });

  toggleMode() {
    this.errorText.set(null);

    // если не админ — не даём открыть register
    if (this.mode() === 'login') {
      if (!this.auth.isAdmin()) {
        this.errorText.set('Register endpoint is ADMIN-only on backend.');
        return;
      }
      this.mode.set('register');
    } else {
      this.mode.set('login');
    }
  }

  submitLogin() {
    this.errorText.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const req: LoginRequest = this.loginForm.getRawValue();

    this.isSubmitting.set(true);
    this.auth.login(req).pipe(
      switchMap((res) => {
        if (!res.success) throw new Error(res.message || 'Login failed');
        this.auth.setTokens(res.data);
        return this.auth.validate(res.data.accessToken);
      }),
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: (vres) => {
        if (!vres.success || !vres.data?.valid) {
          this.errorText.set(vres.message || 'Token invalid');
          return;
        }
        this.auth.setIdentity(vres.data);
        // TODO: navigate
      },
      error: (e) => this.errorText.set(e?.message ?? 'Login failed'),
    });
  }

  submitRegister() {
    this.errorText.set(null);

    if (!this.auth.isAdmin()) {
      this.errorText.set('Only ADMIN can register users (backend restriction).');
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const req: UserCredentialsRequest = this.registerForm.getRawValue();

    this.isSubmitting.set(true);
    this.auth.registerByAdmin(req)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (res) => {
          if (!res.success) {
            this.errorText.set(res.message || 'Register failed');
            return;
          }
          // успех: можно очистить форму/вернуться на login
          this.mode.set('login');
        },
        error: (err) => {
          this.errorText.set(err?.error?.message ?? 'Register failed');
        },
      });
  }
}