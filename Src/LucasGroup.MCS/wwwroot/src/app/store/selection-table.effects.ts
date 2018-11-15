import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import { Observable, from, of } from 'rxjs';
// import { filter, map, mergeMap, mergeAll, switchMap, toArray, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';
import { SelectionTableData, SelectionDataState } from './selectionTable.model';
import * as fromActions from './selection-table.actions';
// import { selectAllSelectionData, selectSelectionDataState } from './selection-table.selectors';
import { selectAllSelectionData } from './selection-table.selectors';

export const SELECTIONDATA_KEY = 'mcsClient.selectiondata';

@Injectable()
export class SelectionDataEffects {

  // allSelectionData$: Observable<SelectionTableData[]>;
  allSelectionData$ = this.store.pipe(select(selectAllSelectionData));

  constructor(
    private actions$: Actions,
    private actionsPersist$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private store: Store<SelectionDataState>,
  ) {}

  @Effect({ dispatch: false })
  persistSelectionData = this.actions$.pipe(
    ofType<fromActions.PersistSelectionDataElements>(fromActions.SelectionDataActionTypes.PERSIST_ELEMENTS),
    tap(action => {
// console.log('action.payload.selectionData', action.payload.selectionData);
      this.localStorageService.setItem(SELECTIONDATA_KEY, action.payload.selectionData);
    }
    )
  );

  @Effect({ dispatch: false })
  persistState = this.actions$.pipe(
    ofType(
      fromActions.SelectionDataActionTypes.ADD_ELEMENT,
      fromActions.SelectionDataActionTypes.ADD_ELEMENTS,
      fromActions.SelectionDataActionTypes.UPDATE_ELEMENT,
      fromActions.SelectionDataActionTypes.UPDATE_ELEMENTS,
      fromActions.SelectionDataActionTypes.REMOVE_ELEMENT,
      fromActions.SelectionDataActionTypes.REMOVE_ELEMENTS,
      // fromActions.SelectionDataActionTypes.PERSIST_ELEMENTS,
      fromActions.SelectionDataActionTypes.CLEAR_ELEMENTS,
      // fromActions.SelectionDataActionTypes.LOAD_ALL_ELEMENTS
    ),
    withLatestFrom(this.store.pipe(select(selectAllSelectionData))),
    // tslint:disable-next-line:no-shadowed-variable
    // tap(([actions, selectSelectionDataState]) => {
// console.log('selectSelectionDataState', selectSelectionDataState);
    //   this.localStorageService.setItem(SELECTIONDATA_KEY, selectSelectionDataState);
    tap(([actions, selectionDataState]) => {
// console.log('selectionDataState', selectionDataState);
      this.localStorageService.setItem(SELECTIONDATA_KEY, selectionDataState);
    }
    )
  );

  @Effect()
  loadAllElements$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromActions.SelectionDataActionTypes.LOAD_ALL_ELEMENTS),
      withLatestFrom(this.store.pipe(select(selectAllSelectionData))),
      switchMap(() =>
        this.getAllSelectionData()
          .pipe(
            // toArray(),
            // tap(data => console.log(`Loaded Elements` + data)),
            map((data: SelectionTableData[]) => new fromActions.LoadSelectionDataSuccess({ selectionData: data }))
          )
      )
    );

  getAllSelectionData(): Observable<SelectionTableData[]> {
    // const elements = this.localStorageService.getItem(SELECTIONDATA_KEY);
    // const keys = Object.keys(elements);
    // const values = keys.map(function(v) { return elements[v]; });
// console.log(`Loaded Element Values` + values);

    return of(this.localStorageService.getItem(SELECTIONDATA_KEY));
  }
}
