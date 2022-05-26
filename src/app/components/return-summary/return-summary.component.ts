import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Activity, ActivityTreeNode } from 'src/app/app-data.models';
import { ApiError } from 'src/app/app-data.service';

@Component({
  selector: 'app-return-summary',
  templateUrl: './return-summary.component.html',
  styleUrls: ['./return-summary.component.scss'],
})
export class ReturnSummaryComponent implements OnChanges {
  @Input() result?: Activity[] | ApiError;

  summary?: ApiError;
  activities: ActivityTreeNode[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result']) {
      this.summary = undefined;
      this.activities = [];

      if (this.isApiError(this.result)) {
        this.summary = this.result;
      } else if (this.result?.length) {
        this.activities = [];
        const activityList: ActivityTreeNode[] = this.result.slice();

        activityList.forEach((activity) => {
          if (!activity.parentId) {
            this.activities.push(activity);
          } else {
            const parent = activityList.find((a) => a.id === activity.parentId);

            if (parent) {
              if (!parent.children) {
                parent.children = [];
              }

              parent.children.push(activity);
            } else {
              this.activities.push(activity);
            }
          }
        });
      }
    }
  }

  private isApiError(result: any): result is ApiError {
    if (!result) {
      return false;
    }

    return (
      typeof result.statusCode === 'number' &&
      typeof result.code === 'string' &&
      typeof result.detail === 'string'
    );
  }
}
