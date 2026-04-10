import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Group } from '../../../models/group';
import { GroupService } from '../../../core/services/group.service';
import { GrupoFormComponent } from '../grupo-form/grupo-form.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-grupo-edit',
  imports: [GrupoFormComponent, RouterLink],
  templateUrl: './grupo-edit.component.html',
})
export class GrupoEditComponent {
  group = signal<Group | undefined>(undefined);

  constructor(
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.groupService
        .getGrupoById(id)
        .subscribe((res) => this.group.set(res));
    }
  }

  updateGroup(data: Partial<Group>) {
    const id = this.group()?.id;
    if (id) {
      this.groupService.updateGroup(id, data).subscribe(
        {
          next: () => {
            this.notificationService.show(
              'success',
              'Grupo actualizado correctamente'
            ),
              this.router.navigate(['/grupos']);
            return;
          },
        }
        // () => {
        //   this.router.navigate(['/grupos']);
        // }
      );
    }
  }
}
