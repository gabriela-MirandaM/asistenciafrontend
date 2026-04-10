import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginError = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  login() {
    const { email, password } = this.form.value;
    if (this.form.invalid) return;

    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.router.navigate(['/']); // o la ruta que tengas
      },
      error: (err) => {
        this.loginError.set('Credenciales inválidas');
        console.error(err);
      },
    });
  }
}
