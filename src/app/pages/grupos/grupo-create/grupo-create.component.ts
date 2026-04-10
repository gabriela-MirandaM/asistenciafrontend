import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Group } from '../../../models/group';
import { GroupService } from './../../../core/services/group.service';
import { GrupoFormComponent } from './../grupo-form/grupo-form.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-grupo-create',
  imports: [GrupoFormComponent, RouterLink],
  templateUrl: './grupo-create.component.html',
})
export class GrupoCreateComponent {
  constructor(
    private groupService: GroupService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  createGroup(data: Partial<Group>) {
    this.groupService.createGroup(data).subscribe(
      {
        next: () => {
          this.notificationService.show(
            'success',
            'Grupo creado correctamente'
          ),
            this.router.navigate(['/grupos']);
          return;
        },
      }
      //   () => {
      //   this.router.navigate(['/grupos']);
      // }
    );
  }
}
