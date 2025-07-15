import { Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro';
import { CarrerasComponent } from './components/carreras/carreras';
export const routes: Routes = [
   // Ruta por defecto redirige a la página de estudiantes
  { path: '', redirectTo: '/estudiantes', pathMatch: 'full' },
  // Ruta para la gestión de estudiantes
  { path: 'estudiantes', component: RegistroComponent },
  // NUEVA RUTA para la gestión de carreras
  { path: 'carreras', component: CarrerasComponent },
  // Ruta comodín para páginas no encontradas
  { path: '**', redirectTo: '/estudiantes' }

];
