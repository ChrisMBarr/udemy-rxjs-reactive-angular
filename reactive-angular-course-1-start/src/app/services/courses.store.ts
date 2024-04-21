import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private coursesSubj$ = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubj$.asObservable();

  constructor(private http: HttpClient, private loadingSvc: LoadingService, private messagesSvc: MessagesService) {
    this.loadAllCourses();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(map((courses) => courses.filter((c) => c.category === category).sort(sortCoursesBySeqNo)));
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.coursesSubj$.getValue();
    const index = courses.findIndex((course) => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newList: Course[] = courses.slice(0);
    newList[index] = newCourse;
    this.coursesSubj$.next(newList);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save courses";
        this.messagesSvc.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay())
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messagesSvc.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this.coursesSubj$.next(courses))
    );

    this.loadingSvc.showLoadingUntilCompleted(loadCourses$).subscribe();
  }
}
