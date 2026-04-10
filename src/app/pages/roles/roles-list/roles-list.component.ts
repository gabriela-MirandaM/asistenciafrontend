import { DatePipe, CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from '../../../models/role';
import { RoleService } from '../../../core/services/role.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-roles-list',
  imports: [CommonModule, DatePipe],
  templateUrl: './roles-list.component.html',
})
export class RolesListComponent {
  roles = signal<Role[]>([]);
  totalPages = signal(1);
  currentPage = signal(1);
  loading = signal(false);

  constructor(
    private roleService: RoleService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    effect(() => {
      const page = this.currentPage();
      this.loadRoles(page);
    });
  }

  loadRoles(page?: number) {
    this.loading.set(true);
    this.roleService.getRoles(page ?? this.currentPage()).subscribe(
      {
        next: (res) => {
          this.roles.set(res.data);
          this.totalPages.set(res.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      }
      // () => this.loadRoles()
    );
  }

  goToCreate() {
    this.router.navigate(['roles/create']);
  }

  goToEdit(id: string) {
    this.router.navigate(['roles/edit', id]);
  }

  deleteRole(id: string) {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      this.roleService.deleteRole(id).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'warning',
              'Rol eliminado correctamente'
            );
            this.loadRoles();
          },
        }
        // () => this.loadRoles()
      );
    }
  }

  toggleRoleActiveStatus(role: Role) {
    if (confirm('¿Estás seguro de cambiar el estado de este rol?')) {
      this.roleService
        .updateRole(role.id, { isActive: !role.isActive })
        .subscribe(
          {
            next: () => {
              this.notificationService.show(
                'info',
                'Estado del rol actualizado correctamente'
              );
              this.loadRoles();
            },
          }
          // () => this.loadRoles();
        );
    }
  }

  changePage(delta: number) {
    const newPage = this.currentPage() + delta;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }

  trackByRoleId(index: number, role: Role) {
    return role.id;
  }

  // Pantalla para asignar permisos a un rol
  goToAsignarPermisos(id: string) {
    this.router.navigate(['roles', id, 'permisos']);
  }
}
