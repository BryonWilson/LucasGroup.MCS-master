import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleConferenceViewComponent } from './schedule-conference-view.component';

describe('ScheduleConferenceViewComponent', () => {
  let component: ScheduleConferenceViewComponent;
  let fixture: ComponentFixture<ScheduleConferenceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleConferenceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
