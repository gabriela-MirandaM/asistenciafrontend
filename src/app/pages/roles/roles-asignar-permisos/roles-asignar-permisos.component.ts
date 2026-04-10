import { PermisoAssignment } from './../../../models/permiso-assignment';
import { Role } from './../../../models/role';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotificationService } from '../../../core/services/notification.service';
import { RoleService } from '../../../core/services/role.service';

import { CommonModule } from '@angular/common';
import { PermissionService } from '../../../core/services/permission.service';
import { Permission } from '../../../models/permission';

@Component({
  selector: 'app-roles-asignar-permisos',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './roles-asignar-permisos.component.html',
})
export class RolesAsignarPermisosComponent implements OnInit {
  role = signal<Role | undefined>(undefined);
  permissions = signal<Permission[]>([]);
  selectedPermissionIds = signal<Set<string>>(new Set());

  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.roleService.getRoleById(id).subscribe({
      next: (res) => this.role.set(res),
    });

    this.permissionService.getAllActivePermissions().subscribe({
      next: (res) => this.permissions.set(res.data),
    });

    this.roleService.getRolePermissions(id).subscribe({
      next: (res) => {
        const permissionIds = new Set(
          res.map((p: PermisoAssignment) => p.permission.id)
        );
        this.selectedPermissionIds.set(permissionIds);
      },
    });
  }

  toggleSeleccion(permissionId: string) {
    const actual = new Set(this.selectedPermissionIds());
    const roleId = this.role()?.id;
    if (!roleId) return;

    if (actual.has(permissionId)) {
      // El rol está desmarcando → confirmar antes de eliminar
      const confirmado = confirm(
        '¿Estás seguro de quitar este permiso al rol?'
      );
      if (!confirmado) {
        return; // No continuar si el usuario cancela
      }

      actual.delete(permissionId);
      this.selectedPermissionIds.set(actual);

      this.roleService.deleteRolePermission(roleId, permissionId).subscribe({
        next: () => {
          this.notificationService.show('info', `Permiso eliminado`);
        },
        error: () => {
          this.notificationService.show(
            'error',
            `Error al eliminar el permiso`
          );
          actual.add(permissionId); // Revertir visualmente
          this.selectedPermissionIds.set(actual);
        },
      });
    } else {
      // El usuario está seleccionando el permiso
      actual.add(permissionId);
      this.selectedPermissionIds.set(actual);
    }
  }

  guardarPermisos() {
    const id = this.role()?.id;
    if (!id) return;

    const roleIds = Array.from(this.selectedPermissionIds());

    this.roleService.assignRolePermissions(id, roleIds).subscribe({
      next: () => {
        this.notificationService.show(
          'success',
          'Permisos asignados correctamente'
        );
        this.router.navigate(['/roles']);
      },
      error: () => {
        this.notificationService.show('error', 'Error al asignar permisos');
      },
    });
  }
}
