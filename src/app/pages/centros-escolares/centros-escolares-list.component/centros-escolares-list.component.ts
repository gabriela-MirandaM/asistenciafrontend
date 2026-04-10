import { Component } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-centros-escolares-list',
  imports: [],
  templateUrl: './centros-escolares-list.component.html',
})
export class CentrosEscolaresListComponent {

  constructor(private router: Router,){}

  centros = signal([
    {
      id: 1,
      codigo: '11011',
      nombre: 'Centro Escolar El Manguito',
      direccion: 'Cantón El Manguito'
    },
    {
      id: 2,
      codigo: '11012',
      nombre: 'Centro Escolar San José',
      direccion: 'San Salvador'
    }
  ]);

  searchTerm = signal('');

  setSearchTerm(value: string) {
    this.searchTerm.set(value);
  }

  limpiarBusqueda() {
    this.searchTerm.set('');
  }

  centrosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();

    if (!term) return this.centros();

    return this.centros().filter(c =>
      c.nombre.toLowerCase().includes(term) ||
      c.codigo.includes(term)
    );
  });

  seleccionarCentro(centro: any) {
    console.log('Centro seleccionado:', centro);

    // luego:
    // navegar a grupos o cargar grupos
    this.router.navigate([`/centros-escolares/${centro.id}/grupos/`]);
  }
}
