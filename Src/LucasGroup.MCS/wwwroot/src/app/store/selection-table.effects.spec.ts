import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SelectionTableEffects } from './selection-table.effects';

describe('SelectionTableEffects', () => {
  let actions$: Observable<any>;
  let effects: SelectionTableEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectionTableEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SelectionTableEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
