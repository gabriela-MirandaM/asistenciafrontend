import { DatePipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Group } from '../../../models/group';
import { NotificationService } from '../../../core/services/notification.service';
import { GroupService } from '../../../core/services/group.service';

@Component({
  selector: 'app-grupos-list',
  imports: [DatePipe],
  templateUrl: './grupos-list.component.html',
})
export class GruposListComponent {
  groups = signal<Group[]>([]);
  totalPages = signal(1);
  currentPage = signal(1);
  loading = signal(false);

  constructor(
    private groupService: GroupService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    effect(() => {
      const page = this.currentPage();
      this.loadGroups(page);
    });
  }

  loadGroups(page?: number) {
    this.loading.set(true);
    this.groupService.getGroups(page ?? this.currentPage()).subscribe({
      next: (res) => {
        this.groups.set(res.data);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  goToCreate() {
    this.router.navigate(['/grupos/create']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/grupos/edit', id]);
  }

  deleteGroup(id: string) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.groupService.deleteGroup(id).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'warning',
              'Usuario eliminado correctamente'
            );
            this.loadGroups();
          },
        }
        // () => this.loadGroups()
      );
    }
  }

  toggleGrupoActivoStatus(group: Group) {
    if (confirm('¿Estás seguro de cambiar el estado de este usuario?')) {
      this.groupService
        .updateGroup(group.id, {
          isActive: !group.isActive,
        })
        .subscribe(
          {
            next: () => {
              this.notificationService.show(
                'info',
                'Estado del usuario actualizado correctamente'
              );
              this.loadGroups();
            },
          }
          // () => this.loadGroups()
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
