import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { Router} from '@angular/router';
import { AccountService } from '../../services';
import { User } from '../../models';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  errors: string;
  array: any;
  usersDataSource: any;
  displayColumns = ['Email', 'Name', 'BranchId', 'BullhornId'];

  pageEvent: PageEvent;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20];
  public currentPage = 0;
  totalSize = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _router: Router, private _accountService: AccountService) { }

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    this._accountService.getUsers()
      .subscribe(
        result => {
          if (result) {
            this.usersDataSource = new MatTableDataSource(result);
            this.usersDataSource.paginator = this.paginator;
            this.array = result;
            this.totalSize = this.array.length;
            this.iterator();
          }
        },
        error => {
          this.errors = error;
        }
      );
  }

  public handlePage(e?: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
    return e;
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.array.slice(start, end);
    this.usersDataSource = part;
  }

  selectRow(row) {
    localStorage.setItem(
      'selectedUser',
      JSON.stringify({
        branchId: row.branchId,
        bullhornUserId: row.bullhornUserId,
        firstName: row.firstName,
        lastName: row.lastName,
        username: row.email
      })
    );
    this._router.navigate(['/userDetails']);
  }

}
