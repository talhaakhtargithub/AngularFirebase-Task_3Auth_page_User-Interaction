import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  sessions: string[] = ['2021-2022', '2022-2023', '2023-2024'];
  courses: string[] = ['Mathematics', 'Physics', 'Computer Science'];
  timeCategories: string[] = ['Morning', 'Afternoon', 'Evening'];

  selectedSession!: string;
  selectedCourse!: string;
  selectedTimeCategory!: string;



  onFilter(): void {
    console.log('Selected Session:', this.selectedSession);
    console.log('Selected Course:', this.selectedCourse);
    console.log('Selected Time Category:', this.selectedTimeCategory);
  }
}
