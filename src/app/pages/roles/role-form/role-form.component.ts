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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Role } from '../../../models/role';

@Component({
  selector: 'app-role-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
})
export class RoleFormComponent implements OnInit {
  role = input<Role>();
  formSubmit = output<Partial<Role>>();

  form: FormGroup;

  // Señales manuales de errores
  touchedFields = signal({
    name: false,
    description: false,
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

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [false],
    });
  }

  ngOnInit() {
    if (this.role()) {
      const roleData = this.role();
      this.form.patchValue({
        name: roleData!.name,
        description: roleData!.description,
        isActive: !!roleData!.isActive, // <--- fuerza a boolean
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
      });
    }
  }
}
