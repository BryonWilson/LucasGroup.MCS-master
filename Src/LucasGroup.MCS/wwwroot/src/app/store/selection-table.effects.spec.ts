import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { SelectionDataEffects } from './selection-table.effects';

describe('SelectionTableEffects', () => {
  let actions$: Observable<any>;
  let effects: SelectionDataEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectionDataEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SelectionDataEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
