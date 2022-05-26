import { Component, OnInit } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import {
  Activity,
  EnumActivityPriority,
  EnumActivityStatus,
} from 'src/app/app-data.models';
import { ApiError, DataService } from 'src/app/app-data.service';

export interface updateFormModel {
  id: string;
  authTwinRefId?: string;
  parentId?: string;
  owningUserId?: string;
  priorityCode?: EnumActivityPriority;
  activityTypeId?: string;
  scheduleId?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  description?: string;
  propertyBag?: string;
  statusCode?: EnumActivityStatus;
}

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
  model: updateFormModel;
  updateCollection: Partial<Activity>[];
  updateReturn?: Activity[] | ApiError;

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {
    this.model = { id: '' };
    this.updateCollection = [];
  }

  ngOnInit(): void {
    this.model = { id: '' };
    this.updateCollection = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAdd() {
    this.updateCollection.push(this.mapFormToActivity(this.model));
    this.resetModel();
  }

  onSubmit() {
    this.dataService
      .makePutCall(this.updateCollection)
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((result) => (this.updateReturn = result));
  }

  getPriorityDisplay(activity: Partial<Activity>): string {
    switch (activity.priorityCode) {
      case EnumActivityPriority.ACTIVITY_PRIORITY_LOW:
        return 'Low priority';
      case EnumActivityPriority.ACTIVITY_PRIORITY_NORMAL:
        return 'Normal priority';
      case EnumActivityPriority.ACTIVITY_PRIORITY_HIGH:
        return 'High priority';
      default:
        return '';
    }
  }

  getStatusDisplay(activity: Partial<Activity>): string {
    switch (activity.statusCode) {
      case EnumActivityStatus.ACTIVITY_STATUS_OPEN:
        return 'Open';
      case EnumActivityStatus.ACTIVITY_STATUS_COMPLETED:
        return 'Completed';
      case EnumActivityStatus.ACTIVITY_STATUS_CANCELED:
        return 'Canceled';
      case EnumActivityStatus.ACTIVITY_STATUS_BLOCKED:
        return 'Blocked';
      case EnumActivityStatus.ACTIVITY_STATUS_IN_PROGRESS:
        return 'In progress';
      default:
        return '';
    }
  }

  private resetModel() {
    this.model = { id: '' };
  }

  private mapFormToActivity(form: updateFormModel): Partial<Activity> {
    const activity: Partial<Activity> = { ...form };

    if (form.startTime) {
      activity.scheduledStart = { jsonDateTime: form.startTime };
      delete (activity as updateFormModel).startTime;
    }

    if (form.endTime) {
      activity.scheduledEnd = { jsonDateTime: form.endTime };
      delete (activity as updateFormModel).endTime;
    }

    activity.statusCode = form.statusCode ? +form.statusCode : undefined;
    activity.priorityCode = form.priorityCode ? +form.priorityCode : undefined;

    return activity;
  }
}
