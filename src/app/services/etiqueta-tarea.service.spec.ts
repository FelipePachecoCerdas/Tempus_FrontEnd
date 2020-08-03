import { TestBed } from '@angular/core/testing';

import { EtiquetaTareaService } from './etiqueta-tarea.service';

describe('EtiquetaTareaService', () => {
  let service: EtiquetaTareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtiquetaTareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
