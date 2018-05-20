import { TestBed, inject } from '@angular/core/testing';

import { UploadService } from './upload-service.service';

describe('UploadServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadService]
    });
  });

  it('should be created', inject([UploadService], (service: UploadService) => {
    expect(service).toBeTruthy();
  }));
});
