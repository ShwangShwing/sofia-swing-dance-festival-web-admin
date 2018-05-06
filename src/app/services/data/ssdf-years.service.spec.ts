import { TestBed, inject } from '@angular/core/testing';

import { SsdfYearsService } from './ssdf-years.service';

describe('SsdfYearsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SsdfYearsService]
    });
  });

  it('should be created', inject([SsdfYearsService], (service: SsdfYearsService) => {
    expect(service).toBeTruthy();
  }));
});
