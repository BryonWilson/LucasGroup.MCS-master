import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConferenceViewComponent } from './create-conference-view.component';

describe('CreateConferenceViewComponent', () => {
  let component: CreateConferenceViewComponent;
  let fixture: ComponentFixture<CreateConferenceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateConferenceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
