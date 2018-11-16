import { selectionDataReducer, initialState } from './selection-table.reducer';

describe('SelectionData Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = selectionDataReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
