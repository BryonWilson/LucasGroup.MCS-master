import { Component, OnInit, Input } from '@angular/core';

import { Conference } from '../../models/conference';

@Component({
  selector: 'app-conference-card',
  templateUrl: './conference-card.component.html',
  styleUrls: ['./conference-card.component.scss']
})
export class ConferenceCardComponent implements OnInit {
  @Input() conference: Conference;

  constructor() { }

  ngOnInit() {
  }

}
