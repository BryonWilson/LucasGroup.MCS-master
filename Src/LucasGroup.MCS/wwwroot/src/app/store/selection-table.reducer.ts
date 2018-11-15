import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { environment } from '../../environments/environment';
// import { SelectionTableData, SelectionDataState } from './selectionTable.model';
import { AppState, SelectionTableData, SelectionDataState } from './selectionTable.model';
import * as fromActions from './selection-table.actions';

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export function sortByCandidate(a: SelectionTableData, b: SelectionTableData): number {
  return a.candidate.localeCompare(b.candidate);
}

export const adapter: EntityAdapter<SelectionTableData> = createEntityAdapter<SelectionTableData>({
  sortComparer: sortByCandidate
});

export const initialState: SelectionDataState = adapter.getInitialState({
  selectedDataId: null
});

export const reducers: ActionReducerMap<AppState> = {
  selectionDataState: selectionDataReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];

export function selectionDataReducer(state = initialState, action: fromActions.SelectionDataActions): SelectionDataState {
  switch (action.type) {
    case fromActions.SelectionDataActionTypes.ADD_ELEMENT: {
      return adapter.addOne(action.payload.selectionData, state);
    }

    case fromActions.SelectionDataActionTypes.ADD_ELEMENTS: {
      return adapter.addMany(action.payload.selectionData, state);
    }

    case fromActions.SelectionDataActionTypes.UPDATE_ELEMENT: {
      return adapter.updateOne(action.payload.selectionData, state);
    }

    case fromActions.SelectionDataActionTypes.UPDATE_ELEMENTS: {
      return adapter.updateMany(action.payload.selectionData, state);
    }

    case fromActions.SelectionDataActionTypes.REMOVE_ELEMENT: {
      return adapter.removeOne(action.payload.id, state);
    }

    case fromActions.SelectionDataActionTypes.REMOVE_ELEMENTS: {
      return adapter.removeMany(action.payload.ids, state);
    }
    case fromActions.SelectionDataActionTypes.CLEAR_ELEMENTS: {
      return adapter.removeAll({ ...state, selectedDataId: null });
    }

    case fromActions.SelectionDataActionTypes.LOAD_ALL_ELEMENTS_SUCCESS: {
// console.log('action.payload.selectionData', action.payload.selectionData);
// console.log('state', state);
      return adapter.addAll(action.payload.selectionData, state);
    }

    case fromActions.SelectionDataActionTypes.SELECT_ELEMENT: {
      return Object.assign({ ...state, selectedDataId: action.payload.id });
    }

    default: {
      return state;
    }
  }
}
