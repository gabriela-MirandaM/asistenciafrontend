import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  userRole = signal<string>('');

  ngOnInit() {
    this.loadUserRole();
  }

  private loadUserRole() {
    const token = this.authService.getAccessToken();
    if (token) {
      const decoded = this.authService.decodeAccessToken(token);
      if (decoded) {
        this.userRole.set(decoded.role);
      }
    }
  }
}
