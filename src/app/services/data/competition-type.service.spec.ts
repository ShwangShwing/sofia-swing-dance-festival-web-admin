import { TestBed, inject } from '@angular/core/testing';

import { CompetitionTypeService } from './competition-type.service';

describe('CompetitionTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompetitionTypeService]
    });
  });

  it('should be created', inject([CompetitionTypeService], (service: CompetitionTypeService) => {
    expect(service).toBeTruthy();
  }));
});
