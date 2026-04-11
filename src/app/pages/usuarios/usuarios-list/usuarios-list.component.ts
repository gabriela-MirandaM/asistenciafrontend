import { DatePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [DatePipe],
  templateUrl: './usuarios-list.component.html',
})
export class UsuariosListComponent {
  users = signal<User[]>([]);
  totalPages = signal(1);
  currentPage = signal(1);
  loading = signal(false);

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    effect(() => {
      const page = this.currentPage();
      this.loadUsers(page);
    });
  }

  loadUsers(page?: number) {
    this.loading.set(true);
    this.userService.getUsers(page ?? this.currentPage()).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  goToCreate() {
    this.router.navigate(['/usuarios/create']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/usuarios/edit', id]);
  }

  deleteUser(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'warning',
              'Usuario eliminado correctamente'
            );
            this.loadUsers();
          },
        }
        // () => this.loadUsers()
      );
    }
  }

  toggleUsuarioActiveStatus(usuario: User) {
    if (confirm('¿Estás seguro de cambiar el estado de este usuario?')) {
      this.userService
        .updateUser(usuario.id, {
          username: usuario.username,
          email: usuario.email,
          isActive: !usuario.isActive,
        })
        .subscribe(
          {
            next: () => {
              this.notificationService.show(
                'info',
                'Estado del usuario actualizado correctamente'
              );
              this.loadUsers();
            },
          }
          // () => this.loadUsers()
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
