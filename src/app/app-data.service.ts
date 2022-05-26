import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  exhaustMap,
  first,
  map,
  Observable,
  of,
} from 'rxjs';
import { Activity } from './app-data.models';

export enum Environment {
  feature = 'feature',
  integration = 'integration',
  stage = 'stage',
}

export interface ApiError {
  statusCode: number;
  code: string;
  detail: string;
}

interface ActivitiesCollection {
  items: Partial<Activity>[];
}

interface ActivitiesReturnWrapper {
  content: {
    activities: {
      items: Activity[];
    };
  };
  errors: ApiError[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private authToken$ = new BehaviorSubject<string>('');
  private environment$ = new BehaviorSubject<Environment>(Environment.feature);
  private region = 'us';
  private domain = 'aquaticinformatics.net';

  constructor(private http: HttpClient) {}

  updateAuthToken(value: string) {
    this.authToken$.next(value);
  }

  updateEnvironment(value: Environment) {
    this.environment$.next(value);
  }

  makeGetCall(params: any, id?: string): Observable<Activity[] | ApiError> {
    delete params.repeatCount;

    return combineLatest([this.authToken$, this.environment$]).pipe(
      first(),
      exhaustMap(([token, environment]) => {
        const url = this.getUrl(environment, id);
        const httpOptions = this.getHttpOptions(token, params);

        return this.http
          .get<ActivitiesReturnWrapper>(url, {
            ...httpOptions,
            observe: 'response',
          })
          .pipe(
            map((result) => this.getActivitiesOrApiError(result)),
            catchError((error) => of(this.mapError(error)))
          );
      })
    );
  }

  makePostCall(
    activities: Partial<Activity>[]
  ): Observable<Activity[] | ApiError> {
    const activitiesCollection: ActivitiesCollection = { items: activities };

    return combineLatest([this.authToken$, this.environment$]).pipe(
      first(),
      exhaustMap(([token, environment]) => {
        const url = this.getUrl(environment);
        const httpOptions = this.getHttpOptions(token);

        return this.http
          .post<ActivitiesReturnWrapper>(url, activitiesCollection, {
            ...httpOptions,
            observe: 'response',
          })
          .pipe(
            map((result) => this.getActivitiesOrApiError(result)),
            catchError((error) => of(this.mapError(error)))
          );
      })
    );
  }

  makePutCall(
    activities: Partial<Activity>[]
  ): Observable<Activity[] | ApiError> {
    const activitiesCollection: ActivitiesCollection = { items: activities };

    return combineLatest([this.authToken$, this.environment$]).pipe(
      first(),
      exhaustMap(([token, environment]) => {
        const url = this.getUrl(environment);
        const httpOptions = this.getHttpOptions(token);

        return this.http
          .put<ActivitiesReturnWrapper>(url, activitiesCollection, {
            ...httpOptions,
            observe: 'response',
          })
          .pipe(
            map((result) => this.getActivitiesOrApiError(result)),
            catchError((error) => of(this.mapError(error)))
          );
      })
    );
  }

  makeDeleteCall(params: any, id: string): Observable<Activity[] | ApiError> {
    delete params.repeatCount;

    return combineLatest([this.authToken$, this.environment$]).pipe(
      first(),
      exhaustMap(([token, environment]) => {
        const url = this.getUrl(environment, id);
        const httpOptions = this.getHttpOptions(token, params);

        return this.http
          .delete<ActivitiesReturnWrapper>(url, {
            ...httpOptions,
            observe: 'response',
          })
          .pipe(
            map((result) => this.getActivitiesOrApiError(result)),
            catchError((error) => of(this.mapError(error)))
          );
      })
    );
  }

  private getUrl(environment: Environment, id?: string): string {
    const path = `https://api-${environment}-${this.region}.${this.domain}/common/activity/v1/`;

    return id ? `${path}/${id}` : path;
  }

  private getHttpOptions(
    authToken: string,
    params?: any
  ): { headers?: HttpHeaders; params?: any } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }),
      params,
    };
  }

  private getActivitiesOrApiError(
    response: HttpResponse<ActivitiesReturnWrapper>
  ): Activity[] | ApiError {
    const result = response.body;

    if (
      result &&
      result.content &&
      result.content.activities &&
      result.content.activities.items &&
      result.content.activities.items.length > 0
    ) {
      return result.content.activities.items;
    } else if (result && result.errors && result.errors.length) {
      return result.errors[0];
    } else {
      return {
        statusCode: response.status,
        code: response.status.toString(),
        detail: response.statusText,
      } as ApiError;
    }
  }

  private mapError(error: any): ApiError {
    return {
      statusCode: error.status,
      code: error.statusText,
      detail: error.message,
    } as ApiError;
  }
}
