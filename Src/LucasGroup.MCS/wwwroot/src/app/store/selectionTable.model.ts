import { SelectionTableData } from './selectionTable.model';
import { EntityState } from '@ngrx/entity';

export interface SelectionTableData {
  id: string;
  job: any;
  client: any;
  candidate: string;
  userId: number;
  conferenceId: number;
  jobOrderId: number;
  candidateId: number;
  duration: number;
  interviewerFirstName: string;
  interviewerLastName: string;
  clientId: number;
  clientContactId: number;
  dateBegin: Date;
  dateEnd: Date;
  selected: boolean;
}

export interface AppState {
  selectionDataState: SelectionDataState;
}

export interface SelectionDataState extends EntityState<SelectionTableData> {
  selectedDataId: string | number | null;
}
