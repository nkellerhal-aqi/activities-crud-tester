import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityTreeNode,
  EnumActivityPriority,
  EnumActivityStatus,
} from 'src/app/app-data.models';

@Component({
  selector: 'app-activity-summary',
  templateUrl: './activity-summary.component.html',
  styleUrls: ['./activity-summary.component.scss'],
})
export class ActivitySummaryComponent implements OnInit {
  @Input() activity?: ActivityTreeNode;

  priorityCode: string = '';
  statusCode: string = '';

  constructor() {}

  ngOnInit() {
    this.mapPriorityCode();
    this.mapStatusCode();
  }

  private mapPriorityCode() {
    switch (this.activity?.priorityCode) {
      case EnumActivityPriority.ACTIVITY_PRIORITY_LOW:
        this.priorityCode = 'Low';
        break;
      case EnumActivityPriority.ACTIVITY_PRIORITY_NORMAL:
        this.priorityCode = 'Normal';
        break;
      case EnumActivityPriority.ACTIVITY_PRIORITY_LOW:
        this.priorityCode = 'Low';
        break;
    }
  }

  private mapStatusCode() {
    switch (this.activity?.statusCode) {
      case EnumActivityStatus.ACTIVITY_STATUS_OPEN:
        this.priorityCode = 'Open';
        break;
      case EnumActivityStatus.ACTIVITY_STATUS_COMPLETED:
        this.priorityCode = 'Completed';
        break;
      case EnumActivityStatus.ACTIVITY_STATUS_CANCELED:
        this.priorityCode = 'Canceled';
        break;
      case EnumActivityStatus.ACTIVITY_STATUS_BLOCKED:
        this.priorityCode = 'Blocked';
        break;
      case EnumActivityStatus.ACTIVITY_STATUS_IN_PROGRESS:
        this.priorityCode = 'In progress';
        break;
    }
  }
}
