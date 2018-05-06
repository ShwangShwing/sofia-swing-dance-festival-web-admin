import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSsdfYearComponent } from './set-ssdf-year.component';

describe('SetSsdfYearComponent', () => {
  let component: SetSsdfYearComponent;
  let fixture: ComponentFixture<SetSsdfYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSsdfYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSsdfYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
