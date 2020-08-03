import { TestBed } from '@angular/core/testing';

import { PeriodoGeneralService } from './periodo-general.service';

describe('PeriodoGeneralService', () => {
  let service: PeriodoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
