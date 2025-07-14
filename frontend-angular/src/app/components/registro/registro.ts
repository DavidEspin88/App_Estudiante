import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { Estudiante, Carrera } from '../../services/interfaces';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {
  carreras: Carrera[] = [];
  estudiantes: Estudiante[] = [];
  searchTerm: string = '';
  modoEdicion: boolean = false;
  estudianteEditando: Estudiante | null = null;

  nuevoEstudiante: { nombre: string; carreraId: number | null } = {
    nombre: '',
    carreraId: null,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCarreras().subscribe({
      next: (data) => this.carreras = data,
      error: (err) => console.error('Error al cargar carreras:', err)
    });
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.apiService.getEstudiantes().subscribe({
      next: (data) => this.estudiantes = data,
      error: (err) => console.error('Error al cargar estudiantes:', err)
    });
  }

  registrarEstudiante(): void {
    if (!this.nuevoEstudiante.nombre || this.nuevoEstudiante.carreraId === null) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.apiService.addEstudiante({
      nombre: this.nuevoEstudiante.nombre,
      carreraId: Number(this.nuevoEstudiante.carreraId)
    }).subscribe({
      next: (estudianteCreado) => {
        this.estudiantes.push(estudianteCreado);
        this.resetFormulario();
        alert('Estudiante registrado con éxito');
      },
      error: (err) => {
        console.error('Error al registrar estudiante:', err);
        alert('No se pudo registrar el estudiante.');
      }
    });
  }

  iniciarEdicion(est: Estudiante): void {
    this.estudianteEditando = { ...est };
    this.nuevoEstudiante.nombre = est.nombre;
    this.nuevoEstudiante.carreraId = est.carreraId;
    this.modoEdicion = true;
  }

  guardarEdicion(): void {
    if (!this.estudianteEditando || !this.nuevoEstudiante.nombre || this.nuevoEstudiante.carreraId === null) {
      alert('Completa todos los campos para actualizar.');
      return;
    }

    const nombreCarrera = this.carreras.find(c => c.id === this.nuevoEstudiante.carreraId)?.nombre || '';

    const actualizado: Estudiante = {
      ...this.estudianteEditando,
      nombre: this.nuevoEstudiante.nombre,
      carreraId: Number(this.nuevoEstudiante.carreraId),
      nombreCarrera
    };

    this.apiService.updateEstudiante(actualizado).subscribe({
      next: (res) => {
        const index = this.estudiantes.findIndex(e => e.id === actualizado.id);
        if (index !== -1) {
          this.estudiantes[index] = res;
        }
        this.resetFormulario();
        alert('Estudiante actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar estudiante:', err);
        alert('No se pudo actualizar el estudiante');
      }
    });
  }

  resetFormulario(): void {
    this.nuevoEstudiante = { nombre: '', carreraId: null };
    this.searchTerm = '';
    this.modoEdicion = false;
    this.estudianteEditando = null;
  }

  getEstudiantesFiltrados(): Estudiante[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtrados = !term
      ? this.estudiantes
      : this.estudiantes.filter(e =>
          e.nombre.toLowerCase().includes(term) ||
          e.nombreCarrera.toLowerCase().includes(term)
        );

    return filtrados.sort((a, b) => a.id - b.id); // orden por ingreso
  }
  eliminarEstudiante(id: number): void {
  if (!confirm(`¿Seguro que quieres eliminar al estudiante #${id}?`)) return;

  this.apiService.deleteEstudiante(id).subscribe({
    next: () => {
      this.estudiantes = this.estudiantes.filter(e => e.id !== id);
      alert('Estudiante eliminado exitosamente');
    },
    error: (err) => {
      console.error('Error al eliminar estudiante:', err);
      alert('No se pudo eliminar el estudiante');
    }
  });
}

}

