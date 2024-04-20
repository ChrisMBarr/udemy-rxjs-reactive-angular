import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import { catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap } from "rxjs/operators";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private readonly coursesSvc: CoursesService) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.coursesSvc.loadAllCourses().pipe(map((courses) => courses.sort(sortCoursesBySeqNo)));
    this.beginnerCourses$ = courses$.pipe(map((list) => list.filter((c) => c.category === "BEGINNER")));
    this.advancedCourses$ = courses$.pipe(map((list) => list.filter((c) => c.category === "ADVANCED")));
  }
}
