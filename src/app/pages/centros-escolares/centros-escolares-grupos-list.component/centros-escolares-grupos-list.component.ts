import { Component } from '@angular/core';
import { signal } from '@angular/core';

@Component({
  selector: 'app-centros-escolares-grupos-list',
  imports: [],
  templateUrl: './centros-escolares-grupos-list.component.html',
})
export class CentrosEscolaresGruposListComponent {

centroSeleccionado = signal({
  id: 1,
  nombre: 'Centro Escolar El Manguito'
});

grupos = signal([
  { id: 1, nombre: 'Grupo B1' },
  { id: 2, nombre: 'Grupo B2' }
]);

grupoExpandido = signal<number | null>(null);

toggleGrupo(grupoId: number) {
  this.grupoExpandido.update(current =>
    current === grupoId ? null : grupoId
  );
}

// Mock alumnos por grupo
alumnosPorGrupo(grupoId: number) {
  return [
    { id: 1, nombre: 'Juan', apellido: 'Pérez' },
    { id: 2, nombre: 'Ana', apellido: 'López' }
  ];
}

// Días (lunes a sábado)
dias = signal([
  '2026-04-13',
  '2026-04-14',
  '2026-04-15',
  '2026-04-16',
  '2026-04-17',
  '2026-04-18'
]);

  asistencia = signal<Record<number, Record<string, boolean>>>({
    1: {
      '2026-04-13': true,
      '2026-04-14': false,
      '2026-04-15': true,
      '2026-04-16': true,
      '2026-04-17': false,
      '2026-04-18': false
    },
    2: {
      '2026-04-13': true,
      '2026-04-14': true,
      '2026-04-15': true,
      '2026-04-16': true,
      '2026-04-17': true,
      '2026-04-18': false
    }
  });

  observaciones = signal<Record<number, Record<string, string>>>({});

  observacion(alumnoId: number, dia: string): string {
    return this.observaciones()[alumnoId]?.[dia] ?? '';
  }
isAsistio(alumnoId: number, dia: string): boolean {
  return this.asistencia()[alumnoId]?.[dia] ?? false;
}


// IMPORTANTE (fix zona horaria)
diaLabel(dia: string): string {
  const [y, m, d] = dia.split('-').map(Number);
  const date = new Date(y, m - 1, d);

  const diasMap: Record<number, string> = {
    1: 'Lun',
    2: 'Mar',
    3: 'Mié',
    4: 'Jue',
    5: 'Vie',
    6: 'Sáb'
  };

  return `${diasMap[date.getDay()] ?? ''} ${date.getDate()}`;
}

}
