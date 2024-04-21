import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private readonly errorSubj$ = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.errorSubj$.asObservable().pipe(filter((messages) => messages && messages.length > 0));

  showErrors(...errors: string[]) {
    this.errorSubj$.next(errors);
  }
}
