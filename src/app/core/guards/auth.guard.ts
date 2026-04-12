import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = (childRoute.data?.['roles'] as string[] | undefined) ?? [];
    if (allowedRoles.length === 0) {
      return true;
    }

    const userRole = this.authService.getUserRole();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    const redirectRoute = this.redirectRouteForRole(userRole);
    this.router.navigate([redirectRoute]);
    return false;
  }

  private redirectRouteForRole(role: string | null): string {
    switch (role) {
      case 'PROFESOR':
        return '/asistencia';
      case 'SUPERVISOR':
        return '/centros-escolares';
      case 'ADMINISTRADOR':
        return '/dashboard';
      default:
        return '/login';
    }
  }
}
