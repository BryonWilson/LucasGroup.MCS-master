import { createFeatureSelector, createSelector, select } from '@ngrx/store';
// import { selectState } from '../core/core.state';
import { SelectionDataState } from './selectionTable.model';
import { adapter } from './selection-table.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
// export const {
//   selectIds: selectSelectionDataIds,
//   selectEntities: selectSelectionDataEntities,
//   selectAll: selectAllSelectionData,
//   selectTotal: selectionDataCount
// } = adapter.getSelectors();

export const getSelectedSelectionDataId = (state: SelectionDataState) => state.selectedDataId;
export const getSelectionDataState = createFeatureSelector<SelectionDataState>('selectionDataState');

// export const selectSelectionDataState = createSelector(
//   selectState,
//   (state: SelectionDataState) => state
// );
export const selectSelectionDataState = createSelector(getSelectionDataState);

export const selectSelectionDataIds = createSelector(getSelectionDataState, selectIds);
export const selectSelectionDataEntities = createSelector(getSelectionDataState, selectEntities);
export const selectAllSelectionData = createSelector(getSelectionDataState, selectAll);
export const selectionDataCount = createSelector(getSelectionDataState, selectTotal);

export const selectCurrentSelectionDataId = createSelector(getSelectionDataState, getSelectedSelectionDataId);

export const selectCurrentSelectionData = createSelector(
  selectSelectionDataEntities,
  selectCurrentSelectionDataId,
  (selectionDataEntities, selectionDataId) => selectionDataEntities[selectionDataId]
);

export const selectSelectedTotal = createSelector(
  selectAllSelectionData,
  entities => entities.filter(entity => entity.selected).length
);
