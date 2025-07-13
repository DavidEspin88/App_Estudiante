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
      carreraId: this.nuevoEstudiante.carreraId!
    }).subscribe({
      next: (estudianteCreado) => {
        this.estudiantes.push(estudianteCreado);
        this.nuevoEstudiante = { nombre: '', carreraId: null };
        alert('Estudiante registrado con éxito');
      },
      error: (err) => {
        console.error('Error al registrar estudiante:', err);
        alert('Error al registrar estudiante. Verifica los datos.');
      }
    });
  }
}
