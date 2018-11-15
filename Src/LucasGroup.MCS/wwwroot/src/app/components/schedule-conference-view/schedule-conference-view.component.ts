import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-schedule-conference-view',
  templateUrl: './schedule-conference-view.component.html',
  styleUrls: ['./schedule-conference-view.component.scss']
})
export class ScheduleConferenceViewComponent implements OnInit, AfterViewInit {
  displayedColumns = ['ClientName', 'JobTitle', 'StartTime', 'EndTime', 'Length', 'Candidate'];
  dataSource = new MatTableDataSource(data);
  @ViewChild(MatSort) sort: MatSort;
  defaultSessionIntervals = ['15 mins', '30 mins', '45 mins', '60 mins'];
  startDatePicker = '';
  endDatePicker = '';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

}

const data = [
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'},
  {clientName: 1, jobTitle: 'Hydrogen', startTime: '1:00', endTime: '1:45', length: 45, candidate: 'Rick'}
];