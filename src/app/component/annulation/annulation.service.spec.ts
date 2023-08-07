import { TestBed } from '@angular/core/testing';

import { AnnulationService } from './annulation.service';

describe('AnnulationService', () => {
  let service: AnnulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
