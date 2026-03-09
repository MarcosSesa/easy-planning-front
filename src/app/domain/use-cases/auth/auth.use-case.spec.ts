import { TestBed } from '@angular/core/testing';

import { AuthUseCase } from 'src/app/domain/use-cases/auth/auth.use-case';

describe('Auth', () => {
  let service: AuthUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthUseCase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
