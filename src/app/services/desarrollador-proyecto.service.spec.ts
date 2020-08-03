import { TestBed } from '@angular/core/testing';

import { DesarrolladorProyectoService } from './desarrollador-proyecto.service';

describe('DesarrolladorProyectoService', () => {
  let service: DesarrolladorProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesarrolladorProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
