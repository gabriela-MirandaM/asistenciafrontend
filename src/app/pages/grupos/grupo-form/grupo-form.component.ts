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

import { Group } from '../../../models/group';

@Component({
  selector: 'app-grupo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './grupo-form.component.html',
})
export class GrupoFormComponent implements OnInit {
  group = input<Group>();
  formSubmit = output<Partial<Group>>();

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [false],
    });
  }

  ngOnInit(): void {
    if (this.group()) {
      const groupData = this.group();
      this.form.patchValue({
        name: groupData!.name,
        description: groupData!.description,
        isActive: !!groupData!.isActive, // <--- fuerza a boolean
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
