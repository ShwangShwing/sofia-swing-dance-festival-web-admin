import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSsdfYearComponent } from './new-ssdf-year.component';

describe('NewSsdfYearComponent', () => {
  let component: NewSsdfYearComponent;
  let fixture: ComponentFixture<NewSsdfYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSsdfYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSsdfYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
