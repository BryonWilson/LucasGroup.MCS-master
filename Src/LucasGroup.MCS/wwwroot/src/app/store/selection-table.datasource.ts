import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { SelectionTableData } from './selectionTable.model';

export class SelectionTableDatasource extends DataSource<SelectionTableData> {
  public constructor(private selectionTable$: Observable<SelectionTableData[]>) {
    super();
  }

  public connect(collectionViewer: CollectionViewer): Observable<SelectionTableData[]> {
    return this.selectionTable$;
  }

  public disconnect(collectionViewer: CollectionViewer): void {
  }
}
