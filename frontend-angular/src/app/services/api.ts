import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, Carrera , EstudiantePayload} from './interfaces';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly estudiantesUrl = 'http://localhost:3000/estudiantes';
  private readonly carrerasUrl = 'http://localhost:3001/carreras';

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.estudiantesUrl);
  }

  addEstudiante(data: { nombre: string; carreraId: number }): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.estudiantesUrl, data);
  }

  updateEstudiante(data: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.estudiantesUrl}/${data.id}`, data);
  }

  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete(`${this.estudiantesUrl}/${id}`);
  }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.carrerasUrl);
  }
  
  public addCarrera(data: { nombre: string }): Observable<Carrera> {
    return this.http.post<Carrera>(this.carrerasUrl, data);
  }

  public updateCarrera(id: number, data: { nombre: string }): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.carrerasUrl}/${id}`, data);
  }

  public deleteCarrera(id: number): Observable<void> {
    return this.http.delete<void>(`${this.carrerasUrl}/${id}`);
  }
}
