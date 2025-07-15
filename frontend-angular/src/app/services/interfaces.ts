export interface Carrera {
  id: number;
  nombre: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  carreraId: number;
  nombreCarrera: string;
}

export type EstudiantePayload = {
  // ...
};