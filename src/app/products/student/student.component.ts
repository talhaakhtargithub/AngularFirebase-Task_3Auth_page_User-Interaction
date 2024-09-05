import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  studentForm!: FormGroup;
  semesters: string[] = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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
