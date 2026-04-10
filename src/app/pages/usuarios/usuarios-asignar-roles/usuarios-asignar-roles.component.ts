import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RoleService } from '../../../core/services/role.service';

import { User } from '../../../models/user.interface';
import { Role } from '../../../models/role';
import { RoleAssignment } from '../../../models/role-assignment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-asignar-roles',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './usuarios-asignar-roles.component.html',
})
export class UsuariosAsignarRolesComponent implements OnInit {
  user = signal<User | undefined>(undefined);
  roles = signal<Role[]>([]);
  selectedRoleIds = signal<Set<string>>(new Set());

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.userService.getUserById(id).subscribe({
      next: (res) => this.user.set(res),
    });

    this.roleService.getRolesActivos().subscribe({
      next: (res) => this.roles.set(res.data),
    });

    this.userService.getUserRoles(id).subscribe({
      next: (res) => {
        const roleIds = new Set(res.map((r: RoleAssignment) => r.role.id));
        this.selectedRoleIds.set(roleIds);
      },
    });
  }

  toggleSeleccion(roleId: string) {
    const actual = new Set(this.selectedRoleIds());
    const userId = this.user()?.id;
    if (!userId) return;

    if (actual.has(roleId)) {
      // El usuario está desmarcando → confirmar antes de eliminar
      const confirmado = confirm(
        '¿Estás seguro de quitar este rol al usuario?'
      );
      if (!confirmado) {
        return; // No continuar si el usuario cancela
      }

      actual.delete(roleId);
      this.selectedRoleIds.set(actual);

      this.userService.eliminarRoles(userId, roleId).subscribe({
        next: () => {
          this.notificationService.show('info', `Rol eliminado`);
        },
        error: () => {
          this.notificationService.show('error', `Error al eliminar el rol`);
          actual.add(roleId); // Revertir visualmente
          this.selectedRoleIds.set(actual);
        },
      });
    } else {
      // El usuario está seleccionando el rol
      actual.add(roleId);
      this.selectedRoleIds.set(actual);
    }
  }

  guardarRoles() {
    const id = this.user()?.id;
    if (!id) return;

    const roleIds = Array.from(this.selectedRoleIds());

    this.userService.asignarRoles(id, roleIds).subscribe({
      next: () => {
        this.notificationService.show(
          'success',
          'Roles asignados correctamente'
        );
        this.router.navigate(['/usuarios']);
      },
      error: () => {
        this.notificationService.show('error', 'Error al asignar roles');
      },
    });
  }
}
