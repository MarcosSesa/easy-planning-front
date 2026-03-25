import { TestBed } from '@angular/core/testing';
import { TripUseCase } from './trip.use-case';
import { TripRepository } from 'app/data/repositories/trip/trip.repository';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TripUseCase', () => {
  let service: TripUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TripUseCase,
        TripRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(TripUseCase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

