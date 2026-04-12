import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActvityFormDialog } from './actvity-form-dialog';

describe('ActvityFormDialog', () => {
  let component: ActvityFormDialog;
  let fixture: ComponentFixture<ActvityFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActvityFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ActvityFormDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
