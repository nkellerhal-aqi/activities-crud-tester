import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import { Activity, GetManyParameters } from 'src/app/app-data.models';
import { ApiError, DataService } from 'src/app/app-data.service';

export interface GetManyFormModel extends GetManyParameters {
  contextPairs?: { key: string; value: string }[];
}

@Component({
  selector: 'app-get-many',
  templateUrl: './get-many.component.html',
  styleUrls: ['./get-many.component.scss'],
})
export class GetManyComponent implements OnInit, OnDestroy {
  model: GetManyFormModel;
  activityReturn?: Activity[] | ApiError;
  newKey?: string;
  newValue?: string;

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {
    this.model = {
      repeatCount: 1,
      includeActivityDescendants: false,
      includeAuthTwinDescendants: false,
    };
  }

  ngOnInit() {
    this.model = {
      repeatCount: 1,
      includeActivityDescendants: false,
      includeAuthTwinDescendants: false,
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addContextEntry() {
    if (this.newKey && this.newValue) {
      if (!this.model.contextPairs) {
        this.model.contextPairs = [];
      }

      this.model.contextPairs.push({ key: this.newKey, value: this.newValue });
      this.newKey = undefined;
      this.newValue = undefined;
    }
  }

  onSubmit() {
    this.dataService
      .makeGetCall(this.mapFormToParams(this.model))
      .pipe(first(), takeUntil(this.destroy$))
      .subscribe((result) => (this.activityReturn = result));
  }

  private mapFormToParams(form: GetManyFormModel): GetManyParameters {
    const params: GetManyFormModel = { ...form };

    if (!form.contextPairs) {
      return params;
    }

    if (form.contextPairs.length > 0) {
      const contextString = form.contextPairs
        .map((kvp) => `${kvp.key}:${kvp.value}`)
        .join(',');
      params.context = contextString;
    }

    delete params.contextPairs;

    return params;
  }
}
