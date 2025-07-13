// Contenido para src/app/components/registro/registro.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// Importamos el SERVICIO desde su ubicación correcta
import { ApiService, Estudiante } from '../../services/api';
imports: [CommonModule, FormsModule] 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})

export class RegistroComponent implements OnInit {

  public estudiantes: Estudiante[] = [];
  
  public nuevoEstudiante: { nombre: string, carreraId: number | null } = {
    nombre: '',
    carreraId: null
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  public cargarEstudiantes(): void {
    this.apiService.getEstudiantes().subscribe({
      next: (data: Estudiante[]) => {
        this.estudiantes = data;
      },
      error: (err: any) => {
        console.error('Error al cargar estudiantes:', err);
      }
    });
  }

  public registrarEstudiante(): void {
    if (!this.nuevoEstudiante.nombre || this.nuevoEstudiante.carreraId === null) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    
    const estudianteParaEnviar = {
      nombre: this.nuevoEstudiante.nombre,
      carreraId: this.nuevoEstudiante.carreraId
    };
    
    this.apiService.addEstudiante(estudianteParaEnviar).subscribe({
      next: (estudianteCreado: Estudiante) => {
        this.estudiantes.push(estudianteCreado);
        this.nuevoEstudiante.nombre = '';
        this.nuevoEstudiante.carreraId = null;
      },
      error: (err: any) => {
        console.error('Error al registrar estudiante:', err);
        alert(`Error: ${err.error}`);
      }
    });
  }
}