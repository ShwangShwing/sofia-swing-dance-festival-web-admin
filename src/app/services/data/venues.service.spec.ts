import { TestBed, inject } from '@angular/core/testing';

import { VenuesService } from './venues.service';

describe('VenuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VenuesService]
    });
  });

  it('should be created', inject([VenuesService], (service: VenuesService) => {
    expect(service).toBeTruthy();
  }));
});
