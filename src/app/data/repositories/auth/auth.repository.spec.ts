import { TestBed } from '@angular/core/testing';

import { AuthRepository } from 'src/app/data/repositories/auth/auth.repository';

describe('Auth', () => {
  let service: AuthRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
