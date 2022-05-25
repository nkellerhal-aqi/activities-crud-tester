import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import {
  Activity,
  EnumActivityPriority,
  EnumActivityStatus,
} from 'src/app/app-data.models';
import { ApiError, DataService } from 'src/app/app-data.service';

export interface createFormModel {
  id: string;
  authTwinRefId?: string;
  parentId?: string;
  owningUserId?: string;
  priorityCode: EnumActivityPriority;
  activityTypeId?: string;
  scheduleId?: string;
  startTime?: string;
  endTime?: string;
  subject: string;
  description: string;
  propertyBag?: string;
  statusCode: EnumActivityStatus;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  model: createFormModel;
  createCollection: Partial<Activity>[];
  createReturn?: Activity[] | ApiError;

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {
    this.model = {
      id: '',
      subject: '',
      description: '',
      priorityCode: EnumActivityPriority.ACTIVITY_PRIORITY_UNKNOWN,
      statusCode: EnumActivityStatus.ACTIVITY_STATUS_UNKNOWN,
    };
    this.createCollection = [];
  }

  ngOnInit() {
    this.resetModel();
    this.createCollection = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAdd() {
    this.createCollection.push(this.mapFormToActivity(this.model));
  }

  onSubmit() {
    this.dataService
      .makePostCall(this.createCollection, 'v1')
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((result) => (this.createReturn = result));
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
    this.model = {
      id: '',
      subject: '',
      description: '',
      priorityCode: EnumActivityPriority.ACTIVITY_PRIORITY_UNKNOWN,
      statusCode: EnumActivityStatus.ACTIVITY_STATUS_UNKNOWN,
    };
  }

  private mapFormToActivity(form: createFormModel): Partial<Activity> {
    const activity: Partial<Activity> = { ...form };

    if (form.startTime) {
      activity.scheduledStart = { jsonDateTime: form.startTime };
      delete (activity as createFormModel).startTime;
    }

    if (form.endTime) {
      activity.scheduledEnd = { jsonDateTime: form.endTime };
      delete (activity as createFormModel).endTime;
    }

    activity.statusCode = +form.statusCode;
    activity.priorityCode = +form.priorityCode;

    return activity;
  }
}
