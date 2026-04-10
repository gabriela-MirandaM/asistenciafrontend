import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Role } from '../../../models/role';
import { RoleService } from '../../../core/services/role.service';
import { RoleFormComponent } from '../role-form/role-form.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-role-create',
  imports: [CommonModule, RoleFormComponent, RouterLink],
  templateUrl: './role-create.component.html',
})
export class RoleCreateComponent {
  constructor(private roleService: RoleService, private router: Router, private notificationService: NotificationService) {}

  createRole(data: Partial<Role>) {
    this.roleService.createRole(data).subscribe(
      {
        next: () => {
          this.notificationService.show('success', 'Rol creado correctamente'),
            this.router.navigate(['/roles']);
          return;
        },
      }
      //   () => {
      //   this.router.navigate(['/roles']);
      // }
    );
  }
}
