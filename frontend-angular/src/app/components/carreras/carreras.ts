import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@services/api';
import { Carrera } from '@services/interfaces';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadiremos los módulos de Material después
  templateUrl: './carreras.html',
  styleUrls: ['./carreras.css']
})
export class CarrerasComponent implements OnInit {

  public carreras: Carrera[] = [];
  public carreraEnFormulario: { nombre: string } = { nombre: '' };
  public idCarreraEditando: number | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  public cargarCarreras(): void {
    this.apiService.getCarreras().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras', err)
    });
  }

  public guardarCarrera(): void {
    if (!this.carreraEnFormulario.nombre.trim()) {
      alert('El nombre de la carrera no puede estar vacío.');
      return;
    }

    const onSucesso = () => {
      this.cargarCarreras();
      this.cancelarEdicion();
    };
    const onError = (err: any) => alert(`Error: ${err.error.message || 'Ocurrió un error'}`);

    if (this.idCarreraEditando) {
      this.apiService.updateCarrera(this.idCarreraEditando, this.carreraEnFormulario)
        .subscribe({ next: onSucesso, error: onError });
    } else {
      this.apiService.addCarrera(this.carreraEnFormulario)
        .subscribe({ next: onSucesso, error: onError });
    }
  }

  public seleccionarParaEditar(carrera: Carrera): void {
    this.idCarreraEditando = carrera.id;
    this.carreraEnFormulario = { nombre: carrera.nombre };
  }

  public cancelarEdicion(): void {
    this.idCarreraEditando = null;
    this.carreraEnFormulario = { nombre: '' };
  }

  public eliminarCarrera(id: number): void {
    if (confirm('¿Estás seguro? Al eliminar la carrera, puede afectar a los estudiantes inscritos.')) {
      this.apiService.deleteCarrera(id).subscribe({
        next: () => this.cargarCarreras(),
        error: (err) => alert(`Error al eliminar: ${err.error.message || 'Ocurrió un error'}`)
      });
    }
  }
}