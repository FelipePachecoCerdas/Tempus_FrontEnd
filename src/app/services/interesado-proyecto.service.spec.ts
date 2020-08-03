import { TestBed } from '@angular/core/testing';

import { InteresadoProyectoService } from './interesado-proyecto.service';

describe('InteresadoProyectoService', () => {
  let service: InteresadoProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteresadoProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
