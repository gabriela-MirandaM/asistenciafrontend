import { Component } from '@angular/core';
import { PermisoFormComponent } from '../permiso-form/permiso-form.component';
import { Router, RouterLink } from '@angular/router';
import { PermissionService } from '../../../core/services/permission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Permission } from '../../../models/permission';

@Component({
  selector: 'app-permiso-create',
  imports: [PermisoFormComponent, RouterLink],
  templateUrl: './permiso-create.component.html',
})
export class PermisoCreateComponent {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  createPermission(data: Partial<Permission>) {
    this.permissionService.createPermission(data).subscribe(
      {
        next: () => {
          this.notificationService.show(
            'success',
            'Permiso creado correctamente'
          ),
            this.router.navigate(['/permisos']);
          return;
        },
      }
      //   () => {
      //   this.router.navigate(['/permisos']);
      // }
    );
  }
}
