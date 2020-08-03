import { TestBed } from '@angular/core/testing';

import { ActividadDesarrolladorService } from './actividad-desarrollador.service';

describe('ActividadDesarrolladorService', () => {
  let service: ActividadDesarrolladorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadDesarrolladorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
