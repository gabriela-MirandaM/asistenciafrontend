import { DatePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Permission } from '../../../models/permission';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionService } from '../../../core/services/permission.service';

@Component({
  selector: 'app-permisos-list',
  imports: [DatePipe],
  templateUrl: './permisos-list.component.html',
})
export class PermisosListComponent {
  permissions = signal<Permission[]>([]);
  totalPages = signal(1);
  currentPage = signal(1);
  loading = signal(false);

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    effect(() => {
      const page = this.currentPage();
      this.loadPermissions(page);
    });
  }

  loadPermissions(page?: number) {
    this.loading.set(true);
    this.permissionService
      .getPermissions(page ?? this.currentPage())
      .subscribe({
        next: (res) => {
          this.permissions.set(res.data);
          this.totalPages.set(res.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  goToCreate() {
    this.router.navigate(['/permisos/create']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/permisos/edit', id]);
  }

  deletePermission(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.permissionService.deletePermission(id).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'warning',
              'Usuario eliminado correctamente'
            );
            this.loadPermissions();
          },
        }
        // () => this.loadPermissions()
      );
    }
  }

  togglePermissionActivoStatus(permission: Permission) {
    if (confirm('¿Estás seguro de cambiar el estado de este permiso?')) {
      this.permissionService
        .updatePermission(permission.id, {
          name: permission.name,
          description: permission.description,
          isActive: !permission.isActive,
        })
        .subscribe(
          {
            next: () => {
              this.notificationService.show(
                'info',
                'Estado del usuario actualizado correctamente'
              );
              this.loadPermissions();
            },
          }
          // () => this.loadPermissions()
        );
    }
  }

  changePage(delta: number) {
    const newPage = this.currentPage() + delta;
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.currentPage.set(newPage);
    }
  }
}
