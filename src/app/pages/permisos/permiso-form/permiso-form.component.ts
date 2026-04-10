import {
  Component,
  input,
  output,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Permission } from '../../../models/permission';
import { Group } from '../../../models/group';
import { GroupService } from '../../../core/services/group.service';

@Component({
  selector: 'app-permiso-form',
  imports: [ReactiveFormsModule],
  templateUrl: './permiso-form.component.html',
})
export class PermisoFormComponent implements OnInit {
  permission = input<Permission>();
  formSubmit = output<Partial<Permission>>();
  gruposActivos = signal<Group[]>([]);

  form: FormGroup;

  // Señales manuales de errores
  touchedFields = signal({
    name: false,
    description: false,
    groupId: false,
  });

  // Computed que depende de la señal `touchedFields`
  nameError = computed(() => {
    return this.touchedFields().name && this.form.get('name')?.invalid;
  });

  descriptionError = computed(() => {
    return (
      this.touchedFields().description && this.form.get('description')?.invalid
    );
  });

  groupIdError = computed(() => {
    return this.touchedFields().groupId && this.form.get('groupId')?.invalid;
  });

  constructor(private fb: FormBuilder, private groupService: GroupService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [false],
      groupId: [null, Validators.required], // <- nuevo campo obligatorio
    });
  }

  ngOnInit(): void {
    this.groupService.getGroupsActivos().subscribe((res) => {
      this.gruposActivos.set(res.data);
    });
    if (this.permission()) {
      const permissionData = this.permission();
      this.form.patchValue({
        name: permissionData!.name,
        description: permissionData!.description,
        isActive: !!permissionData!.isActive, // <--- fuerza a boolean
        groupId: permissionData!.group?.id ?? null, // <- usa el id del grupo si existe
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const fixedForm = {
        ...this.form.value,
        isActive: !!this.form.get('isActive')?.value, // asegura booleano
      };
      this.formSubmit.emit(fixedForm);
    } else {
      this.touchedFields.set({
        name: true,
        description: true,
        groupId: true
      });
    }
  }
}
