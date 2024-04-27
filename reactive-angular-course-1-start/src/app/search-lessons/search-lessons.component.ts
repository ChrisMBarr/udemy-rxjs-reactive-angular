import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLessonsComponent implements OnInit {
  searchResults$?: Observable<Lesson[]>;
  activeLesson?: Lesson;

  constructor(private readonly coursesSvc: CoursesService) {}

  ngOnInit() {}

  onSearch(search: string) {
    this.searchResults$ = this.coursesSvc.searchLessons(search);
  }

  openLesson(lesson: Lesson) {
    this.activeLesson = lesson;
  }

  onBackToSearch() {
    this.activeLesson = undefined;
  }
}
