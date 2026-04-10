import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Permission } from '../../../models/permission';
import { PermisoFormComponent } from './../permiso-form/permiso-form.component';
import { PermissionService } from './../../../core/services/permission.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-permiso-edit',
  imports: [PermisoFormComponent, RouterLink],
  templateUrl: './permiso-edit.component.html',
})
export class PermisoEditComponent implements OnInit {
  permission = signal<Permission | undefined>(undefined);

  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.permissionService
        .getPermissionById(id)
        .subscribe((res) => this.permission.set(res));
    }
  }

  updatePermission(data: Partial<Permission>) {
    const id = this.permission()?.id;
    if (id) {
      this.permissionService.updatePermission(id, data).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'success',
              'Permiso actualizado correctamente'
            ),
              this.router.navigate(['/permisos']);
            return;
          },
        }
        // () => {
        //   this.router.navigate(['/permisos']);
        // }
      );
    }
  }
}
