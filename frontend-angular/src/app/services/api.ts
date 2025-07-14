import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, Carrera } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/estudiantes';

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  addEstudiante(data: { nombre: string; carreraId: number }): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, data);
  }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>('http://localhost:3001/carreras');
  }
  
}
