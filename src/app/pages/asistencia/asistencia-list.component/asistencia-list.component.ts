import { Component } from '@angular/core';
import { signal } from '@angular/core';


@Component({
  selector: 'app-asistencia-list',
  imports: [],
  templateUrl: './asistencia-list.component.html'
})
export class AsistenciaListComponent {
  alumnos = signal([
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'Ana', apellido: 'López' }
  ]);

  dias = signal([
    '2026-04-13',
    '2026-04-14',
    '2026-04-15',
    '2026-04-16',
    '2026-04-17',
    '2026-04-18'
  ]);

  centroEscolar = signal("Centro Escolar Canton El Manguito");

  grupo = signal("Grupo B1");

  guardar(): void { };
  cancelar(): void { };


  asistencia = signal<Record<number, Record<string, boolean>>>({});
  observaciones = signal<Record<number, string>>({});

  isAsistio(alumnoId: number, dia: string): boolean {
    return this.asistencia()[alumnoId]?.[dia] ?? false;
  }

  toggleAsistencia(alumnoId: number, dia: string) {
    this.asistencia.update(state => {
      const alumno = state[alumnoId] ?? {};
      alumno[dia] = !alumno[dia];

      return {
        ...state,
        [alumnoId]: { ...alumno }
      };
    });
  }

  observacion(alumnoId: number): string {
    return this.observaciones()[alumnoId] ?? '';
  }

  setObservacion(alumnoId: number, value: string) {
    this.observaciones.update(state => ({
      ...state,
      [alumnoId]: value
    }));
  }

  diaLabel(dia: string): string {
    const [year, month, day] = dia.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    const diasMap: Record<number, string> = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado'
    };

    const label = diasMap[date.getDay()] ?? '';
    return `${label} ${date.getDate()}`;
  }

  semanaLabel(): string {
    return '13 - 18 Abril 2026';
  }
}
