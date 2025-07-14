import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { of } from 'rxjs';
import { Estudiante, Carrera } from '../../services/interfaces';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const estudiantesMock: Estudiante[] = [
      { id: 1, nombre: 'Juan Pérez', carreraId: 2, nombreCarrera: 'Diseño Gráfico' }
    ];
    const carrerasMock: Carrera[] = [
      { id: 2, nombre: 'Diseño Gráfico' }
    ];

    mockApiService = jasmine.createSpyObj('ApiService', ['getEstudiantes', 'getCarreras', 'addEstudiante']);
    mockApiService.getEstudiantes.and.returnValue(of(estudiantesMock));
    mockApiService.getCarreras.and.returnValue(of(carrerasMock));
    mockApiService.addEstudiante.and.returnValue(of(estudiantesMock[0]));

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [RegistroComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load carreras on init', () => {
    expect(component.carreras.length).toBeGreaterThan(0);
    expect(component.carreras[0].nombre).toBe('Diseño Gráfico');
  });

  it('should load estudiantes on init', () => {
    expect(component.estudiantes.length).toBeGreaterThan(0);
    expect(component.estudiantes[0].nombre).toBe('Juan Pérez');
  });
});