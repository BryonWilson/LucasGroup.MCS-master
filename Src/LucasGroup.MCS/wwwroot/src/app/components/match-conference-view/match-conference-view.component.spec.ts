import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchConferenceViewComponent } from './match-conference-view.component';

describe('MatchConferenceViewComponent', () => {
  let component: MatchConferenceViewComponent;
  let fixture: ComponentFixture<MatchConferenceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchConferenceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
