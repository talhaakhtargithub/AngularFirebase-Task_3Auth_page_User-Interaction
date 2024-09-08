import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  studentForm!: FormGroup;
  students: any[] = [];  // Ensure this is correctly typed
  semesters: string[] = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudents(); // Ensure this method is correctly implemented
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      semester: [''],
      identificationNumber: [''],
      dateOfBirth: [''],
      dateOfAdmission: [''],
      degreeTitle: [''],
      yearOfStudy: [''],
      uploadPicture: [null]
    });
  }

  loadStudents(): void {
    this.http.get<any[]>('api/students') // Ensure the type matches
      .subscribe(
        (data: any[]) => {  // Correct type for data
          this.students = data;
        },
        (error: any) => {
          console.error('Error fetching students:', error);
        }
      );
  }

  onSubmit(): void {
    console.log(this.studentForm.value);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.studentForm.patchValue({
      uploadPicture: file
    });
  }
}
