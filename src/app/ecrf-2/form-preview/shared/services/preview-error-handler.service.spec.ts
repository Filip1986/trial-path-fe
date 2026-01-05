import { TestBed } from '@angular/core/testing';

import { PreviewErrorHandlerService } from './preview-error-handler.service';

describe('PreviewErrorHandlerService', () => {
  let service: PreviewErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviewErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
