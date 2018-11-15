import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { SelectionTableData } from './selectionTable.model';

export enum SelectionDataActionTypes {
  ADD_ELEMENT = '[SelectionData] Add Element',
  ADD_ELEMENTS = '[SelectionData] Add Elements',
  UPDATE_ELEMENT = '[SelectionData] Update Element',
  UPDATE_ELEMENTS = '[SelectionData] Update Elements',
  REMOVE_ELEMENT = '[SelectionData] Remove Element',
  REMOVE_ELEMENTS = '[SelectionData] Remove Elements',
  PERSIST_ELEMENTS = '[SelectionData] Persist Elements',
  CLEAR_ELEMENTS = '[SelectionData] Clear Elements',
  LOAD_ALL_ELEMENTS = '[SelectionData] Load All Elements',
  LOAD_ALL_ELEMENTS_SUCCESS = '[SelectionData] Load All Elements Success',
  SELECT_ELEMENT = '[SelectionData] Select Element By Id'
}

export class AddSelectionData implements Action {
  readonly type = SelectionDataActionTypes.ADD_ELEMENT;
  constructor(public payload: { selectionData: SelectionTableData }) {}
}

export class AddSelectionDataElements implements Action {
  readonly type = SelectionDataActionTypes.ADD_ELEMENTS;
  constructor(public payload: { selectionData: SelectionTableData[] }) {}
}

export class UpdateSelectionData implements Action {
  readonly type = SelectionDataActionTypes.UPDATE_ELEMENT;
  constructor(public payload: { selectionData: Update<SelectionTableData> }) {}
}

export class UpdateSelectionDataElements implements Action {
  readonly type = SelectionDataActionTypes.UPDATE_ELEMENTS;
  constructor(public payload: { selectionData: Update<SelectionTableData>[] }) {}
}

export class RemoveSelectionData implements Action {
  readonly type = SelectionDataActionTypes.REMOVE_ELEMENT;
  constructor(public payload: { id: string }) {}
}

export class RemoveSelectionDataElements implements Action {
  readonly type = SelectionDataActionTypes.REMOVE_ELEMENTS;
  constructor(public payload: { ids: string[] }) {}
}

export class PersistSelectionDataElements implements Action {
  readonly type = SelectionDataActionTypes.PERSIST_ELEMENTS;
  constructor(readonly payload: { selectionData: SelectionTableData[] }) {}
}

export class ClearSelectionDataElements implements Action {
  readonly type = SelectionDataActionTypes.CLEAR_ELEMENTS;
}

export class LoadSelectionDataElements implements Action {
  readonly type = SelectionDataActionTypes.LOAD_ALL_ELEMENTS;
}

export class LoadSelectionDataSuccess implements Action {
  readonly type = SelectionDataActionTypes.LOAD_ALL_ELEMENTS_SUCCESS;
  constructor(public payload: { selectionData: SelectionTableData[] }) {}
}

export class SelectSelectionData implements Action {
  readonly type = SelectionDataActionTypes.SELECT_ELEMENT;
  constructor(public payload: { id: string }) {}
}

export type SelectionDataActions =
  AddSelectionData
  | AddSelectionDataElements
  | UpdateSelectionData
  | UpdateSelectionDataElements
  | RemoveSelectionData
  | RemoveSelectionDataElements
  | PersistSelectionDataElements
  | ClearSelectionDataElements
  | LoadSelectionDataElements
  | LoadSelectionDataSuccess
  | SelectSelectionData;
