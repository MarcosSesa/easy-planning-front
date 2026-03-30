import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailPageComponent } from './trip-detail-page.component';

describe('TripDetailPageComponent', () => {
  let component: TripDetailPageComponent;
  let fixture: ComponentFixture<TripDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
