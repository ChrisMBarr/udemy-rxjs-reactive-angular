import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { Observable, combineLatest } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { map, startWith, tap } from "rxjs/operators";

interface ICourseData {
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {
  data$: Observable<ICourseData>;

  constructor(private readonly route: ActivatedRoute, private readonly coursesService: CoursesService) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.coursesService.loadCourseById(courseId).pipe(startWith({}))
    const lessons$ = this.coursesService.loadAllCourseLessons(courseId).pipe(startWith([]))

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => ({ course, lessons })),
      tap(console.log)
    );
  }
}
