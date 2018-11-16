import {
  SelectionDataActionTypes,
  AddSelectionData,
  UpdateSelectionData,
  RemoveSelectionData,
} from './selection-table.actions';


describe('SelectionData Actions', () => {
  it('should create AddSelectionData action', () => {
    const action = new AddSelectionData({
      selectionData: {
        id: '1',
        job: 'testJob',
        client: 'testClient',
        candidate: 'testCandidate',
        userId: 1,
        conferenceId: 1,
        jobOrderId: 1,
        candidateId: 1,
        duration: 1,
        interviewerFirstName: 'Firstname',
        interviewerLastName: 'Lastname',
        clientId: 1,
        clientContactId: 1,
        dateBegin: new Date(2018, 1, 1, 1, 1, 1, 1),
        dateEnd: new Date(2018, 1, 1, 11, 11, 11, 11),
        selected: false
      }
    });
    expect(action.type).toEqual(SelectionDataActionTypes.ADD_ELEMENT);
    expect(action.payload.selectionData).toEqual(
      jasmine.objectContaining({
        id: '1',
        job: 'testJob',
        client: 'testClient',
        candidate: 'testCandidate',
        userId: 1,
        conferenceId: 1,
        jobOrderId: 1,
        candidateId: 1,
        duration: 1,
        interviewerFirstName: 'Firstname',
        interviewerLastName: 'Lastname',
        clientId: 1,
        clientContactId: 1,
        dateBegin: new Date(2018, 1, 1, 1, 1, 1, 1),
        dateEnd: new Date(2018, 1, 1, 11, 11, 11, 11),
        selected: false
      })
    );
  });

  it('should create UpdateSelectionData action', () => {
    const action = new UpdateSelectionData({
      selectionData: {
        id: '1',
        changes: {
          id: 'updated'
        }
      }
    });
    expect(action.type).toEqual(SelectionDataActionTypes.UPDATE_ELEMENT);
    expect(action.payload.selectionData).toEqual(
      jasmine.objectContaining({
        id: '1',
        changes: {
          id: 'updated'
        }
      })
    );
  });

  it('should create RemoveSelectionData action', () => {
    const action = new RemoveSelectionData({ id: '1' });
    expect(action.type).toEqual(SelectionDataActionTypes.REMOVE_ELEMENT);
    expect(action.payload.id).toEqual('1');
  });
});
