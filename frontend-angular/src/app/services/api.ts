// Contenido para src/app/services/api.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estudiante {
  id: number;
  nombre: string;
  carreraId: number;
  nombreCarrera: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/estudiantes';

  constructor(private http: HttpClient) { }

  public getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  public addEstudiante(data: { nombre: string, carreraId: number }): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, data);
  }
}