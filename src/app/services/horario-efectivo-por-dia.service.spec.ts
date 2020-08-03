import { TestBed } from '@angular/core/testing';

import { HorarioEfectivoPorDiaService } from './horario-efectivo-por-dia.service';

describe('HorarioEfectivoPorDiaService', () => {
  let service: HorarioEfectivoPorDiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioEfectivoPorDiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
