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
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    const { username, password } = this.form.value;
    if (this.form.invalid) return;

    this.authService.login(username!, password!).subscribe({
      next: () => {
        // Decodificar el token para obtener el rol y redirigir según corresponda
        const token = this.authService.getAccessToken();
        if (token) {
          const decoded = this.authService.decodeAccessToken(token);
          if (decoded) {
            switch (decoded.role) {
              case 'ADMINISTRADOR':
                this.router.navigate(['/dashboard']);
                break;
              case 'PROFESOR':
                this.router.navigate(['/asistencia']);
                break;
              case 'SUPERVISOR':
                this.router.navigate(['/centros-escolares']);
                break;
              default:
                this.router.navigate(['/dashboard']); // fallback
                break;
            }
          } else {
            this.router.navigate(['/dashboard']); // fallback si no se puede decodificar
          }
        }
      },
      error: (err) => {
        this.loginError.set('Credenciales inválidas');
        console.error(err);
      },
    });
  }
}
