import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType, ChartOptions } from 'chart.js';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public studentAttendanceData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Attendance' }]
  };
  public studentAttendanceOptions: ChartOptions = {
    responsive: true,
  };
  public studentAttendanceChartType: ChartType = 'bar';

  public teacherAttendanceData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Attendance' }]
  };
  public teacherAttendanceChartType: ChartType = 'bar';

  public courseAssessmentData: ChartData<'doughnut'> = {
    labels: ['Performance'],
    datasets: [{ data: [0, 100], backgroundColor: ['#42A5F5', '#EBEFF2'] }]
  };
  public courseAssessmentChartType: ChartType = 'doughnut';

  public emotionData: ChartData<'pie'> = {
    labels: ['Alert', 'Bored', 'Neutral', 'Fear', 'Non-serious'],
    datasets: [{ data: [0, 0, 0, 0, 0], backgroundColor: ['#42A5F5', '#FF6384', '#FFCE56', '#FF9F40', '#36A2EB'] }]
  };
  public emotionChartType: ChartType = 'pie';

  public students: any[] = [];
  public courses: any[] = []; // Declare the courses property

  selectedSession: string = '';
  selectedCourse: string = '';
  selectedTime: 'week' | 'month' | 'year' = 'week';

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadInitialData();
  }

  loadCourses(): void {
    this.studentService.getCourses().subscribe(courses => {
      this.courses = courses; // Populate courses
      if (courses.length > 0) {
        this.selectedCourse = courses[0]?.code || '';
        this.applyFilter();
      }
    });
  }

  loadInitialData(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedSession && this.selectedCourse) {
      this.studentService.getFilteredAttendance(this.selectedSession, this.selectedCourse, this.selectedTime).subscribe(data => {
        this.studentAttendanceData = {
          labels: data.days,
          datasets: [{ data: data.counts, label: 'Attendance' }]
        };
        this.updateTeacherAttendance();
        this.updateCourseAssessment();
        this.updateEmotionData();
      });
    }
  }

  updateTeacherAttendance(): void {
    // Replace with actual logic to get teacher attendance
    this.teacherAttendanceData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{ data: [2, 3, 4, 2, 3, 5], label: 'Attendance' }]
    };
  }

  updateCourseAssessment(): void {
    // Replace with actual logic to calculate course assessment
    this.courseAssessmentData = {
      labels: ['Performance'],
      datasets: [{ data: [80, 20], backgroundColor: ['#42A5F5', '#EBEFF2'] }]
    };
  }

  updateEmotionData(): void {
    this.studentService.getStudents().subscribe(students => {
      const emotions: { [key: string]: number } = { 'Alert': 0, 'Bored': 0, 'Neutral': 0, 'Fear': 0, 'Non-serious': 0 };
      students.forEach(student => {
        emotions[student.emotion] = (emotions[student.emotion] || 0) + 1;
      });
      this.emotionData = {
        labels: Object.keys(emotions),
        datasets: [{ data: Object.values(emotions), backgroundColor: ['#42A5F5', '#FF6384', '#FFCE56', '#FF9F40', '#36A2EB'] }]
      };
    });
  }
}
