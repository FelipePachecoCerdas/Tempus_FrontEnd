import { TestBed } from '@angular/core/testing';

import { TareaPeriodoService } from './tarea-periodo.service';

describe('TareaPeriodoService', () => {
  let service: TareaPeriodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaPeriodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
