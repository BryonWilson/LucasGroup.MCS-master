import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAndSaveConferenceViewComponent } from './print-and-save-conference-view.component';

describe('PrintAndSave', () => {
  let component: PrintAndSaveConferenceViewComponent;
  let fixture: ComponentFixture<PrintAndSaveConferenceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintAndSaveConferenceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAndSaveConferenceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
