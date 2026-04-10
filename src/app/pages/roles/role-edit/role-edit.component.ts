import { Component, signal } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Role } from '../../../models/role';
import { RoleService } from '../../../core/services/role.service';
import { RoleFormComponent } from '../role-form/role-form.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-role-edit',
  imports: [CommonModule, RoleFormComponent, RouterLink],
  templateUrl: './role-edit.component.html',
})
export class RoleEditComponent {
  role = signal<Role | undefined>(undefined);

  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roleService.getRoleById(id).subscribe((res) => this.role.set(res));
    }
  }

  updateRole(data: Partial<Role>) {
    const id = this.role()?.id;
    if (id) {
      this.roleService.updateRole(id, data).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'success',
              'Rol actualizado correctamente'
            ),
              this.router.navigate(['/roles']);
            return;
          },
        }
        // () => {
        //   this.router.navigate(['/roles']);
        // }
      );
    }
  }
}
