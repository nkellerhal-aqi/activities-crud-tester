import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, exhaustMap, first, map, of } from 'rxjs';
import { Activity } from './app-data.models';

export interface ApiError {
  statusCode: number;
  code: string;
  detail: string;
}

interface ActivitiesCollection {
  items: Activity[];
}

interface ActivitiesReturnWrapper {
  content: {
    activities: ActivitiesCollection;
  };
  errors: ApiError[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private authToken$ = new BehaviorSubject<string>('');
  private region = 'us';
  private environment = 'feature';
  private domain = 'aquaticinformatics.net';

  constructor(private http: HttpClient) {}

  updateAuthToken(value: string) {
    this.authToken$.next(value);
  }

  makeGetCall(params: any, ending: string, id?: string) {
    delete params.repeatCount;

    return this.authToken$.pipe(
      first(),
      exhaustMap((token) => {
        const url = this.getUrl(ending, id);
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

  private getUrl(ending: string, id?: string): string {
    const path = `https://api-${this.environment}-${this.region}.${this.domain}/common/activity/${ending}/`;

    return id ? `${path}/${id}` : path;
  }

  private getHttpOptions(
    authToken: string,
    params: any
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
      result.content.activities.items
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
