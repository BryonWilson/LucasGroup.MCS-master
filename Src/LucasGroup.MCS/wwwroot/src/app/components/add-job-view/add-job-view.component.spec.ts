import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobViewComponent } from './add-job-view.component';

describe('AddJobViewComponent', () => {
  let component: AddJobViewComponent;
  let fixture: ComponentFixture<AddJobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJobViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
