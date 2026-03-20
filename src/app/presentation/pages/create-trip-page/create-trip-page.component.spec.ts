import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTripPageComponent } from 'app/presentation/pages/create-trip-page/create-trip-page.component';

describe('CreateTripPageComponent', () => {
  let component: CreateTripPageComponent;
  let fixture: ComponentFixture<CreateTripPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTripPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTripPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
