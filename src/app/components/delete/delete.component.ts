import { Component, OnDestroy, OnInit } from '@angular/core';
import { first, Subject, takeUntil } from 'rxjs';
import { Activity, DeleteParameters } from 'src/app/app-data.models';
import { ApiError, DataService } from 'src/app/app-data.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit, OnDestroy {
  id?: string;
  model: DeleteParameters;
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
        .makeDeleteCall(this.model, this.id)
        .pipe(first(), takeUntil(this.destroy$))
        .subscribe((result) => {
          this.activityReturn = result;
          this.id = undefined;
          this.model = { includeDescendants: false };
        });
    }
  }
}
