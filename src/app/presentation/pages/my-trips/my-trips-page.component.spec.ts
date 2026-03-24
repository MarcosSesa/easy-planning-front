import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTripsPageComponent } from 'app/presentation/pages/my-trips-page.component/my-trips-page.component';

describe('MyTripsPageComponent', () => {
  let component: MyTripsPageComponent;
  let fixture: ComponentFixture<MyTripsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTripsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyTripsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
