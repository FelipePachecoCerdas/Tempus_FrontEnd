import { TestBed } from '@angular/core/testing';

import { HorarioEspecificoPorDiaService } from './horario-especifico-por-dia.service';

describe('HorarioEspecificoPorDiaService', () => {
  let service: HorarioEspecificoPorDiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioEspecificoPorDiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
