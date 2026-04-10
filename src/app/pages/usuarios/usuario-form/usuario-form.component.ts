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

import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-form.component.html',
})
export class UsuarioFormComponent implements OnInit {
  user = input<User>();
  formSubmit = output<Partial<User>>();

  form: FormGroup;

  // Señales manuales de errores
  touchedFields = signal({
    username: false,
    email: false,
    password: false,
  });

  // Computed que depende de la señal `touchedFields`
  usernameError = computed(() => {
    return this.touchedFields().username && this.form.get('username')?.invalid;
  });

  emailError = computed(() => {
    return this.touchedFields().email && this.form.get('email')?.invalid;
  });

  passwordError = computed(() => {
    return this.touchedFields().password && this.form.get('password')?.invalid;
  });

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user() as Partial<User>);
    }

    // Escuchar los cambios manualmente
    this.form
      .get('username')
      ?.valueChanges.subscribe(() => this.markTouched('username'));
    this.form
      .get('email')
      ?.valueChanges.subscribe(() => this.markTouched('email'));
    this.form
      .get('password')
      ?.valueChanges.subscribe(() => this.markTouched('password'));
  }

  markTouched(field: 'username' | 'email' | 'password') {
    this.touchedFields.update((current) => ({
      ...current,
      [field]: true,
    }));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      // Actualizamos todas las señales de campos como tocadas
      this.touchedFields.set({
        username: true,
        email: true,
        password: true,
      });

      return;
    }

    this.formSubmit.emit(this.form.value);
  }
}
