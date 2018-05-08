import { TestBed, inject } from '@angular/core/testing';

import { ClassLevelsService } from './class-levels.service';

describe('ClassLevelsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassLevelsService]
    });
  });

  it('should be created', inject([ClassLevelsService], (service: ClassLevelsService) => {
    expect(service).toBeTruthy();
  }));
});
