import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostToBullhornModalComponent } from './post-to-bullhorn-modal.component';

describe('PostToBullhornModalComponent', () => {
  let component: PostToBullhornModalComponent;
  let fixture: ComponentFixture<PostToBullhornModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostToBullhornModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostToBullhornModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
