import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);

  toggleTheme() {
    const html = document.documentElement;
    html.setAttribute(
      'data-theme',
      html.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    );
  }

  logout() {
    console.log('Cerrando sesión...');
    this.authService.logout();
  }
}
