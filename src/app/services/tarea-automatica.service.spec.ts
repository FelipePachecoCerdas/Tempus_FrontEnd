import { TestBed } from '@angular/core/testing';

import { TareaAutomaticaService } from './tarea-automatica.service';

describe('TareaAutomaticaService', () => {
  let service: TareaAutomaticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaAutomaticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
