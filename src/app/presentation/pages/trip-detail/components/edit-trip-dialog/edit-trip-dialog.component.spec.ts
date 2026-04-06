import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTripDialog } from './edit-trip-dialog';

describe('EditTripDialog', () => {
  let component: EditTripDialog;
  let fixture: ComponentFixture<EditTripDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTripDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTripDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
