import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
  private loadingSubj$ = new BehaviorSubject(false);
  loading$: Observable<boolean> = this.loadingSubj$.asObservable();

  showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()), //immediately show the loader from the completed null observable
      concatMap(() => obs$), //now map the null value to return the rea values from the passed observable
      finalize(() => this.loadingOff()) //when completed or errored out, hide the loader.
    );
  }

  loadingOn() {
    this.loadingSubj$.next(true);
  }

  loadingOff() {
    this.loadingSubj$.next(false);
  }
}
