import { TestBed } from '@angular/core/testing';

import { PeriodoEspecificoService } from './periodo-especifico.service';

describe('PeriodoEspecificoService', () => {
  let service: PeriodoEspecificoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodoEspecificoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
