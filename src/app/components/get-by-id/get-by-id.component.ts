import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import { Activity, GetByIdParameters } from 'src/app/app-data.models';
import { ApiError, DataService } from 'src/app/app-data.service';

@Component({
  selector: 'app-get-by-id',
  templateUrl: './get-by-id.component.html',
  styleUrls: ['./get-by-id.component.scss'],
})
export class GetByIdComponent implements OnInit, OnDestroy {
  id?: string;
  model: GetByIdParameters;
  activityReturn?: Activity[] | ApiError;

  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {
    this.model = { includeDescendants: false };
  }

  ngOnInit() {
    this.model = { includeDescendants: false };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.id) {
      this.dataService
        .makeGetCall(this.model, this.id)
        .pipe(first(), takeUntil(this.destroy$))
        .subscribe((result) => (this.activityReturn = result));
    }
  }
}
